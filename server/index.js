import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import stripeRoutes from './routes/stripe.js';
import stripeWebhook from './webhooks/stripe.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// CONFIGURATION CORS DYNAMIQUE
// ============================================
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_URL, // URL de production
      'https://votre-domaine.com', // Remplacer par votre domaine
      'https://www.votre-domaine.com' // Avec www si nécessaire
    ].filter(Boolean) // Filtrer les valeurs undefined
  : [
      'http://localhost:5173',
      'http://localhost:5174', // Au cas où le port change
      'http://127.0.0.1:5173'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ Origine bloquée par CORS : ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true, // Autoriser les cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
};

// ============================================
// RATE LIMITING (Protection DDoS)
// ============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.',
  standardHeaders: true, // Retourner les infos de rate limit dans les headers
  legacyHeaders: false,
});

// ============================================
// MIDDLEWARE
// ============================================

// ⚠️ IMPORTANT : Webhook AVANT express.json()
// Stripe a besoin du raw body pour vérifier la signature
// 1️⃣ WEBHOOK STRIPE - DOIT ÊTRE EN PREMIER
app.post('/api/webhook', 
  express.raw({ type: 'application/json' }), 
  stripeWebhook
);

// 2️⃣ CORS
app.use(cors(corsOptions));

// 3️⃣ Rate limiting sur toutes les routes SAUF webhook
app.use((req, res, next) => {
  if (req.path === '/api/webhook') {
    return next();
  }
  limiter(req, res, next);
});

// 4️⃣ Parse JSON bodies (APRÈS le webhook)
app.use(express.json());

// Logger les requêtes en développement
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 Backend Doude fonctionne !',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROUTES API
// ============================================
app.use('/api/stripe', stripeRoutes);

// ============================================
// GESTION DES ERREURS
// ============================================

// 404 - Route non trouvée
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  
  // Ne pas exposer les détails en production
  const message = process.env.NODE_ENV === 'production'
    ? 'Une erreur est survenue'
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('=================================');
  console.log('🚀 Backend Doude démarré !');
  console.log('=================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS origins:`, allowedOrigins);
  console.log('=================================');
  console.log('');
  
  // Vérifier les variables d'environnement critiques
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('');
    console.warn('⚠️  ATTENTION : Variables d\'environnement manquantes :');
    missingVars.forEach(varName => {
      console.warn(`   ❌ ${varName}`);
    });
    console.warn('');
    console.warn('   Le backend peut ne pas fonctionner correctement.');
    console.warn('   Vérifiez votre fichier .env');
    console.warn('');
  } else {
    console.log('✅ Toutes les variables d\'environnement requises sont présentes');
    console.log('');
  }
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});