/// Framework basé sur Node.js
const express = require('express');
/// Gere la demande POST du front
const bodyParser = require('body-parser');
/// Utilisation du fichier .env
require('dotenv').config();
/// Notre chère base de donné
const mongoose = require('mongoose');
/// Accés au chemin de notre système de fichier
const path = require('path');
/// Sécurisation requete HTTP, en tetes, cross-site scripting, sniffing, clickjacking, prélécture du DNS, reniflement MIME
const helmet = require('helmet');
/// Securisation des cookies
const session = require('cookie-session');
/// Securisation des caches
const nocache = require('nocache');

/// Connection a la base de donner mongo en utilisant le fichier .env
mongoose.connect(process.env.MONGO_URI, {  useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/// Route dédiée aux sauces  
const sauceRoutes = require('./routes/sauce')
/// Route dédiée aux utilisateurs
const userRoutes = require('./routes/user');
/// Création d'une application express   
const app = express();

/// Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, 
/// afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
/// Sécurisation des coockies avec date d'expiration du token
  const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
  app.use(session({
    name: 'session',
    secret: process.env.SEC_SES,
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'http://localhost:3000',
      expires: expiryDate
    }
  }));
/// Permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({extended: true}));
/// Transformation des POST en ObjJSON
app.use(bodyParser.json());
/// Charge les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

/// Routes dédiées aux sauces
app.use('/api/sauces', sauceRoutes);
/// Routes dédiées aux utilisateurs
app.use('/api/auth', userRoutes);

app.use(helmet());
app.use(nocache());

module.exports = app;