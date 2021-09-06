<h1>:boom:Projet So Peckocko API d'avis gastronomiques:boom:</h1>


### :bulb: Installation

Cloner ce projet depuis Github

<h2> :bulb: Faire tourner la base de données Mongo DB et configurer le .env : </h2>

Crée un fichier `.env` à la racine du dossier backend.

Aprés avoir créé un compte sur MongoDB, créé un cluster, un compte de connexion a se fameux cluster. 

Puis relevez votre méthode de conexion en remplissant le .env de cette facons :

`MONGO_URI = 'mongodb+srv://NomDuCompte:MotDePasse@NomDuCluster.vsi3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'`
    
Pour que cookie session fonctionne,
vous aurez besoin d'entrer une clef dans le fichier `.env` sous ce format :

`SEC_SES="VotreClef"`
nb: la clef peut etre n'importe qu'elle valeur.

Enfin pour que le secret token de jwt fonctionne rajouter dans le `.env` ceci :

`SEC_TOKEN="Votre clef"`
nb: la clef peut aussi etre n'importe qu'elle valeur.

    
    
<h2> :bulb: Faire tourner le Frontend : </h2>

Ouvrir le terminal sur le dossier frontend et exécuter `npm install` pour installer les dépendances.
    
Exécuter `npm install node-sass` pour installer sass.
    
Démarrer `npm run start` pour avoir accès au serveur de développement.
    
Rendez-vous sur http://localhost:4200.
    
### :bulb: Faire tourner le Backend :

Ouvrir le terminal sur le dossier backend et exécuter `npm install` pour installer les dépendances.
    
Puis lancez le serveur: `nodemon server`.
