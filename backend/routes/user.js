const express = require('express');
const router = express.Router();
/// Association des fonctions aux différentes routes, import du controller
const userCtrl = require('../controllers/user');
/// Vérification du password
const verifyPassword = require('../middleware/verifyPassword');;

/// Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/signup', verifyPassword, userCtrl.signup);
// Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis
/// la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)
router.post('/login', userCtrl.login);

module.exports = router;