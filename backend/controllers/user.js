/// Bcrypt pour hasher le mdp des users
const bcrypt = require('bcrypt');
/// Jsonwebtoken attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken');
/// Recuperation du model User
const User = require('../models/User');


/// Création d'un nouvelle utilisateur
exports.signup = (req, res, next) => {
/// hashage du mdp de l'user  
    bcrypt.hash(req.body.password, 10)
/// Enregistrement du mdp hasher dans la MongoDB    
      .then(hash => {
/// Création de l'user
        const user = new User({
/// Email de la requête          
          email: req.body.email,
/// Mdp Hasher de la requête           
          password: hash
        });
/// Pour finir enregistrement de l'user        
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


/// Connectino de l'user  
exports.login = (req, res, next) => {
/// Cherche dans la DB l'email entré par l'user  
  User.findOne({ email: req.body.email })
    .then(user => {
/// User non trouvé = Code 401
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
/// Comparaison des hashages par bcrypt du mdp entré par l'user a la création puis à la conection     
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
/// Si incorrect code d'erreur          
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
/// Si correspondance envoi un objJson avec userId+ token d'identification JWT          
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
/// Clé d'encodage du token stocker dans le fichier .env
                process.env.SEC_TOKEN,
                { expiresIn: '24h'}
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};