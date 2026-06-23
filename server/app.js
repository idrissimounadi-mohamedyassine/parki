// Importer le framework Express
// Il sert à créer le serveur backend et les routes API
import express from 'express';

// Importer CORS
// Autorise le frontend à communiquer avec le backend
import cors from 'cors';

// Importer Helmet
// Ajoute plusieurs protections via les headers HTTP
import helmet from 'helmet';

// Importer Morgan
// Affiche les logs des requêtes HTTP dans le terminal
import morgan from 'morgan';

// Importer protection contre injections MongoDB
import mongoSanitize from 'express-mongo-sanitize';

// Importer limitation de requêtes
// Protection contre spam / brute force
import rateLimit from 'express-rate-limit';

// Importer middlewares personnalisés de gestion d’erreurs
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Importer fichiers routes du projet
import authRoutes from './routes/authRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cameraRoutes from './routes/cameraRoutes.js';

// Importer fonction Stripe webhook
// utilisée pour recevoir confirmations de paiement
import { stripeWebhook } from './controllers/paymentController.js';


// Créer application Express
// app représente le serveur principal
const app = express();


// --------------------------------------------------
// Stripe Webhook needs raw body
// --------------------------------------------------

// Route spéciale Stripe
// Stripe exige body brut (raw) et non JSON parsé
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);


// --------------------------------------------------
// Security Middleware
// --------------------------------------------------

// Helmet protège le serveur avec headers sécurité
app.use(helmet());

// Autoriser frontend à accéder backend
app.use(
  cors({
    // Autoriser URL frontend
    origin: process.env.CLIENT_URL || 'http://localhost:5173',

    // Autoriser cookies / credentials
    credentials: true
  })
);

// Convertir body JSON reçu en objet JavaScript
// Exemple POST login
app.use(express.json());

// Nettoyer données contre injections MongoDB
app.use(mongoSanitize());


// Si environnement n'est pas production
if (process.env.NODE_ENV !== 'production') {

  // Afficher logs requêtes en mode dev
  app.use(morgan('dev'));
}


// --------------------------------------------------
// Rate Limiter
// --------------------------------------------------

// Créer limiteur de requêtes
const limiter = rateLimit({

  // Fenêtre temps = 15 minutes
  windowMs: 15 * 60 * 1000,

  // Maximum 100 requêtes par IP
  max: 100
});

// Appliquer protection sur toutes routes /api
app.use('/api', limiter);


// --------------------------------------------------
// Routes principales API
// --------------------------------------------------

// Routes authentification
// login, register, profile...
app.use('/api/auth', authRoutes);

// Routes parkings
// liste parkings, détails...
app.use('/api/parkings', parkingRoutes);

// Routes réservations
app.use('/api/bookings', bookingRoutes);

// Routes paiements
app.use('/api/payments', paymentRoutes);

// Routes statistiques dashboard
app.use('/api/stats', statsRoutes);

// Routes avis clients
app.use('/api/reviews', reviewRoutes);

// Routes caméra / scan / sécurité
app.use('/api/camera', cameraRoutes);


// --------------------------------------------------
// Route test accueil
// --------------------------------------------------

// Quand utilisateur visite /
app.get('/', (req, res) => {

  // Retourner JSON message serveur actif
  res.json({
    message: 'Parki API is running...'
  });

});


// --------------------------------------------------
// Error Handling
// --------------------------------------------------

// Si route non trouvée
app.use(notFound);

// Si erreur serveur existe
app.use(errorHandler);


// Exporter app vers server.js
export default app;