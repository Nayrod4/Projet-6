/// Protége les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

const jwt = require('jsonwebtoken');

/// Sécurisation des routes
module.exports = (req, res, next) => {
  try {
/// Récupèration du token dans le header de la requête autorisation
    const token = req.headers.authorization.split(' ')[1];
/// Vérification du token décodé avec la clé secrète initiéé
    const decodedToken = jwt.verify(token, process.env.SEC_TOKEN);
/// Vérification que le userId envoyé avec la requête correspond au userId encodé dans le token    
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valide !';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};