/// Récupération du modèle 'sauce' grâce à la fonction schéma de mongoose
const Sauce = require('../models/Sauce');

/// Récupération du module 'file system' permettant de gérer les téléchargements et modifications d'images
const fs = require('fs');


/// Création d'une sauce
exports.createSauce = (req, res, next) => {
///  Stockage des données envoyées par le front-end en objet js
  const sauceObject = JSON.parse(req.body.sauce);
/// Suppression de l'id crée par le frontend pour une nouvelle sauce, mongoDB le fait si bien tout seul
  delete sauceObject._id;
/// Création du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
/// Modification de l'URL de l'image pour la trouver plus facilement
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
/// Sauvegarde de la sauce crée
  sauce.save()
/// On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête  
    .then(() => res.status(201).json({ message: 'Sauce crée !'}))
/// Code d'erreur en cas de problème    
    .catch(error => res.status(400).json({ error }));
};


/// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  console.log(req.body.sauce)
/// La sauce contient elle une image ?  
  const sauceObject = req.file ?
    {
///  Modification des données + ajout de la nouvelle image      
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body};
/// On applique les paramètre de sauceObject
     Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
  };


///  Suppession d'une sauce  
exports.deleteSauce = (req, res, next) => {
/// On cherche la sauce  
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
/// Recuperation de l'url de la sauce puis split sur le nom du fichier      
      const filename = sauce.imageUrl.split('/images/')[1];
/// Avec ce nom de fichier, on appelle unlink pour supprimmer le fichier      
      fs.unlink(`images/${filename}`, () => {
/// On supprime le document correspondant de la base de données        
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


/// Recuperation d'une sauce dans la db mongo
exports.getOneSauce = (req, res, next) => {
/// FindOne id permet de recupere l'id d'une sauce  
  Sauce.findOne({ _id: req.params.id })  
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  
  };


/// Recuperation de toutes les sauces dans la db mongo
exports.getAllSauces =  (req, res, next) => {
/// Find obtien tout les sauces enregister dans la db   
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));

};


/// Like et Dislike d'un sauce
exports.likeDislike = (req, res) => {
  //On try catch cette partie pour être sûr que les éléments existe
  try {
 
    var like = req.body.like;
    var userId = req.body.userId;
    var sauceId = req.params.id;
  } catch (error) {
    res.status(400).json({ error: new Error(error) });
  }

  /// On fonction de la valeur de like
  switch (like) { 
    /// Si like vaut 1
    case 1:
      /// On récupère la sauce
      Sauce.findOne({ _id: sauceId })
          .then((sauce)=> {
            /// Si on ne la trouve pas
            if (!sauce) {
              res.status(404).json({ message: "Sauce inexistante" });
            } else if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) {
              res.status(403).json({message: "Sauce déjà liker ou disliker"});
            } else {
              // Sinon tout est bon, on peut la liker
              Sauce.updateOne({_id: sauceId}, {$push: {usersLiked: userId}, $inc: {likes: +1}})
                .then(() => res.status(200).json({message: 'Like ajouté'}))
                .catch((error) => res.status(400).json({ error: new Error(error) }));
            }
          })
          /// Erreur serveur
          .catch((error) => res.status(500).json({ error: new Error(error) }));
      break;
    /// Si like vaut 0
    case 0:
      /// On récupère la sauce
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          /// Si 'utilisateur est dans le tableau des likes
          if (sauce.usersLiked.includes(userId)) {
            /// On annule le like de la sauce
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: 'Like retiré' }))
              .catch((error) => res.status(400).json({ error }));
          }
          /// Sinon si il est dans le tableau des dislikes
          if (sauce.usersDisliked.includes(userId)) {
            /// On annule le dislike de la sauce
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: 'Dislike retiré' }))
              .catch((error) => res.status(400).json({ error: new Error(error) }));
          }
        })
        .catch((error) => res.status(404).json({ error: new Error(error) }));
      break;
    /// Si like vaut -1
    case -1:
      /// On récupère avant tout la sauce
      Sauce.findOne({ _id: sauceId })
        .then((sauce)=> {
          /// Si on ne la trouve pas
          if (!sauce) {
            /// Statut 404 et message disant que la sauce est inexistante 
            res.status(404).json({ message: "Sauce inexistante" });
            /// Sinon si l'utilisateur est déjà dans le tableau des likes ou des dislike
          } else if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) {
            /// On renvoi un statut 403 et un message disant que la sauce a déjà était liker ou disliker
            res.status(403).json({message: "Sauce déjà liker ou disliker"});
          }else {
            /// Sinon tout est bon, on peut la liker
            Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId}, $inc: {dislikes: +1}})
              .then(() => res.status(200).json({message: 'Dislike ajouté'}))
              .catch((error) => res.status(400).json({ error: new Error(error) }));
          }
        })
        /// Erreur serveur
          .catch((error) => res.status(500).json({ error: new Error(error) }));
      break;
    default:
      res.status(400).json({ error: 'invalid like value' });
      break
  }
}
