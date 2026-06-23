// Importer Mongoose
// Bibliothèque qui permet connecter Node.js à MongoDB
// et créer modèles (User, Parking, Booking...)
import mongoose from 'mongoose';


// Définir fonction asynchrone de connexion à la base de données
// async = permet utiliser await
const connectDB = async () => {

  try {

    // Connexion à MongoDB
    // await = attendre fin connexion avant continuer
    // Si MONGO_URI existe dans .env on l’utilise
    // Sinon utiliser base locale mongodb://localhost:27017/parki
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/parki'
    );

    // Si connexion réussie
    // Afficher nom host MongoDB connecté
    // Exemple : cluster0.mongodb.net ou localhost
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    // Si erreur de connexion
    // afficher message erreur
    console.error(`Error: ${error.message}`);

    // Arrêter application avec code erreur
    // 1 = arrêt anormal
    process.exit(1);
  }

};


// Exporter fonction pour l’utiliser dans server.js
export default connectDB;