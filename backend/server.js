const http = require('http');
const app = require('./app');

/// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
/// Cela configure le port de connection en fonction de l'environnement

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
/// Deploie le server sur le port 3000 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/// Gere les erreurs pour ensuite les save dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/// Création du server avec express qui utilise l'app
const server = http.createServer(app);

server.on('error', errorHandler);
/// Enregistre le port nommé sur lequel le serveur s'exécute dans la console et écoute les evenements
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

/// Le serveur écoute le port définit plus haut
server.listen(port);
