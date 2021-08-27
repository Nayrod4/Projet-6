/// multer gére les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

/// Définition du format des images, puis extension en fonction du type de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/// Précisoon a multer ou save le fichier et comment le nommé
const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
/// _ à la place de "" pour éviter les bugs    
    let name = file.originalname.split(' ').join('_');
    let extension = MIME_TYPES[file.mimetype];
    name = name.replace("." + extension, "_");
/// Génére le nouveau nom du fichier Nom+Date+extension    
    callback(null, name + Date.now() + '.' + extension);
  }
});
/// Méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({storage: storage}).single('image');