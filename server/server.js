// Importation automatique des variables d’environnement depuis le fichier .env
// Grâce à dotenv, on peut utiliser : process.env.PORT, process.env.MONGO_URI...
import 'dotenv/config';

// Importer l'application Express depuis app.js
// app contient la configuration du serveur : middlewares, routes...
import app from './app.js';

// Importer la fonction de connexion à MongoDB
// Cette fonction se trouve dans config/db.js
import connectDB from './config/db.js';

// Exécuter la connexion à la base de données MongoDB
// Avant de démarrer le serveur, on connecte d'abord la base
connectDB();

// Définir le port du serveur
// Si PORT existe dans .env on l’utilise
// Sinon utiliser 5000 par défaut
const PORT = process.env.PORT || 5000;

// Démarrer le serveur Express
// app.listen() met le serveur en écoute des requêtes HTTP
// Exemple : GET /api/users , POST /login ...
app.listen(PORT, () => {

  // Callback exécutée après démarrage réussi du serveur
  // Affiche environnement actuel + numéro du port
  // NODE_ENV peut être : development / production
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );

});