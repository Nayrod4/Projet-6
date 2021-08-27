// Récupération du modèle 'sauce' grâce à la fonction schéma de mongoose
const Sauce = require('../models/Sauce');

// Récupération du module 'file system' permettant de gérer les téléchargements et modifications d'images
const fs = require('fs');


/// Création d'une sauce
exports.createSauce = (req, res, next) => {
///  Stockage des données envoyées par le front-end en objet js
  const sauceObject = JSON.parse(req.body.sauce);
/// Suppression de l'id crée par le frontend pour une nouvelle sauce, mongoDB le fait si bien tout seul
  delete sauceObject._id;
// Création du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
/// Modification de l'URL de l'image pour la trouver plus facilement
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
// Sauvegarde de la sauce crée
  sauce.save()
// On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête  
    .then(() => res.status(201).json({ message: 'Sauce crée !'}))
// Code d'erreur en cas de problème    
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
exports.likeDislike = (req, res, next) => {

  const like = req.body.like

  const userId = req.body.userId

  const sauceId = req.params.id

  if (like === 1) { 
    Sauce.updateOne(
      {
        _id: sauceId
      }, {

        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, 
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( 
        {
          _id: sauceId
        },
         {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, 
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { 
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              },
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}