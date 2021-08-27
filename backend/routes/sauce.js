/// Plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
/// Routeur avec la méthode mise à disposition par Express
const router = express.Router();
/// Sécurisation des routes
const auth = require('../middleware/auth');
/// Gestion des images
const multer = require('../middleware/multer-config');
/// Association des fonctions aux différentes routes, import du controller
const sauceCtrl = require('../controllers/sauce');


/// Route création sauce, 
/// Capture et save l'image, valide les caractéres utilisé, définit le nopm de l'image et remet les like-dislike a zéro
router.post('/', auth, multer, sauceCtrl.createSauce);
/// Route modification sauce,
/// MAJ sauce avec l'id fournit, modif si neccesaire de l'image avec new URL
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
/// Route suppression sauce
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
/// Route selection une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
/// Route pour afficher toutes les sauces disponible
router.get('/', auth, sauceCtrl.getAllSauces);
/// Route de gestion des likes
router.post('/:id/like', auth, sauceCtrl.likeDislike);


module.exports = router;