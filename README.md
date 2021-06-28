Installation

Cloner ce projet depuis Github

Faire tourner la base de donnée Mongo DB et configurer le .env:

    Crée un fichier .env à la racine du dossier backend.

    Aprés avoir crée un compte sur MongoDB, crée un cluster, un compte de connection a se fameu cluster. 
    
    Puis relevez votre méthode de conection en remplissant le .env de cette facons :

    MONGO_URI = 'mongodb+srv://NomDuCompte:MotDePasse@NomDuCluster.vsi3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    
    Enfin pour que cookie session fonctionne, vous aurez besoin d'entrer une clef dans le fichier .env sous ce format :

    SEC_SES="VotreClef"
    nb: la clef peut etre n'importe qu'elle valeur.

    
    
Faire tourner le Frontend :

    Ouvrir le terminal sur le dossier frontend et exécuter "npm install" pour installer les dépendances.
    
    Exécuter "npm install node-sass" pour installer sass.
    
    Démarrer "npm run start" pour avoir accès au serveur de développement.
    
    Rendez-vous sur http://localhost:4200.
    
Faire tourner le Backend :

    Ouvrir le terminal sur le dossier backend et exécuter "npm install" pour installer les dépendances.
    
    Puis lancez le serveur: "nodemon server".


Compte admin : admin@admin.fr
</br>
</br>
Psw admin : admin15
</br>
</br>

