import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Supabase Admin Client (initialisé à la demande)
let supabaseAdmin = null;
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseAdmin;
}

// Mapping des price IDs vers les tiers
const PRICE_TO_TIER = {
  'price_1SuACOFEu2lrL216y4C6PbuP': 'gratuit',
  'price_1SuADVFEu2lrL216SQm5agHc': 'gratuit',
  'price_1SuACnFEu2lrL216xouwXPm0': 'pro',
  'price_1SuADhFEu2lrL21638mz6Oij': 'pro',
  'price_1SuAD4FEu2lrL2160uwZdxG4': 'premium',
  'price_1SuAEWFEu2lrL216eLG8DOiB': 'premium'
};

// Créer une session de paiement
// Créer une session de paiement
router.post('/create-checkout-session', async (req, res) => {
  console.log('🎯 === DÉBUT CREATE-CHECKOUT-SESSION ===');
  console.log('📦 Body reçu:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('1️⃣ Initialisation Stripe...');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialisé');
    
    const { priceId, userId, userEmail } = req.body;
    console.log('2️⃣ Données extraites:', { priceId, userId, userEmail });

    // Validation des paramètres
    if (!priceId || !userId || !userEmail) {
      console.error('❌ Paramètres manquants:', { priceId, userId, userEmail });
      return res.status(400).json({ 
        error: 'Paramètres manquants',
        received: { priceId, userId, userEmail }
      });
    }

    console.log('3️⃣ Récupération Supabase Admin...');
    const supabase = getSupabaseAdmin();
    console.log('✅ Supabase initialisé');

    console.log('4️⃣ Recherche utilisateur dans users_roles...');
    const { data: user, error: userError } = await supabase
      .from('users_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'prof')
      .single();

    console.log('Résultat recherche user:', { user, userError });

    if (userError || !user) {
      console.error('❌ Utilisateur non trouvé:', userId, userError);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    console.log('✅ Utilisateur trouvé:', user.user_id);

    // Créer ou récupérer le customer Stripe
    let customer;
    
    console.log('5️⃣ Gestion customer Stripe...');
    if (user.stripe_customer_id) {
      try {
        console.log('   Récupération customer existant:', user.stripe_customer_id);
        customer = await stripe.customers.retrieve(user.stripe_customer_id);
        console.log('   ✅ Customer récupéré:', customer.id);
      } catch (err) {
        console.log('   ⚠️ Customer introuvable:', err.message);
        customer = null;
      }
    }

    if (!customer) {
      console.log('   Recherche par email:', userEmail);
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      });

      if (customers.data.length > 0) {
        customer = customers.data[0];
        console.log('   ✅ Customer trouvé par email:', customer.id);
        
        await supabase
          .from('users_roles')
          .update({ stripe_customer_id: customer.id })
          .eq('user_id', userId);
      } else {
        console.log('   Création nouveau customer...');
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: { 
            user_id: userId,
            name: `${user.first_name || ''} ${user.last_name || ''}`
          }
        });
        console.log('   ✅ Customer créé:', customer.id);
        
        await supabase
          .from('users_roles')
          .update({ stripe_customer_id: customer.id })
          .eq('user_id', userId);
      }
    }

    console.log('6️⃣ Création session checkout...');
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
    trial_period_days: 14,
  },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tarifs`,
      locale: 'fr',
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto'
      },
      metadata: {
        user_id: userId,
        user_email: userEmail
      },
    });

    console.log('✅ Session créée avec succès:', session.id);
    console.log('🎯 === FIN CREATE-CHECKOUT-SESSION (SUCCESS) ===');
    
    res.json({ url: session.url });

  } catch (error) {
    console.error('💥 === ERREUR DANS CREATE-CHECKOUT-SESSION ===');
    console.error('Type:', error.constructor.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('==============================================');
    
    res.status(500).json({ 
      error: error.message,
      type: error.constructor.name
    });
  }
});

// Vérifier le statut de l'abonnement
router.get('/subscription-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('🔍 Vérification abonnement pour:', userId);

    const supabase = getSupabaseAdmin();
    
    // Récupérer le tier depuis users_roles
    const { data: user, error } = await supabase
      .from('users_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'prof')
      .single();

    if (error || !user) {
      console.log('❌ Utilisateur non trouvé');
      return res.json({ 
        status: 'gratuit', 
        tier: 'gratuit',
        inTrial: false,
        trialEnded: false
      });
    }

    // Vérifier si l'essai est actif
    const now = new Date();
    const trialEndDate = user.trial_end_date ? new Date(user.trial_end_date) : null;
    const inTrial = trialEndDate && trialEndDate > now && !user.subscription_status;
    const trialEnded = trialEndDate && trialEndDate <= now && !user.subscription_status;

    const tier = user.tier || 'gratuit';
    const status = user.subscription_status || (inTrial ? 'trial' : 'gratuit');

    res.json({
      status: status,
      tier: tier,
      inTrial: inTrial,
      trialEnded: trialEnded,
      trialEndDate: trialEndDate,
      subscriptionId: user.subscription_id
    });

  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vérifier une session de paiement et mettre à jour le tier
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { sessionId } = req.params;

    console.log('🔍 Vérification session:', sessionId);

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'subscription']
    });

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.json({ success: false, error: 'Paiement non complété' });
    }

    // Récupérer le price ID pour déterminer le tier
    const priceId = session.line_items?.data[0]?.price?.id;
    const tier = PRICE_TO_TIER[priceId] || 'gratuit';

    console.log('💰 Price ID:', priceId, '→ Tier:', tier);

    // Récupérer l'ID utilisateur depuis les métadonnées
    const userId = session.metadata?.user_id;
    const userEmail = session.metadata?.user_email || session.customer_details?.email;

    if (userId) {
      const supabase = getSupabaseAdmin();
      
      // Mettre à jour users_roles avec les infos d'abonnement
      const { error: updateError } = await supabase
        .from('users_roles')
        .update({
          tier: tier,
          stripe_customer_id: session.customer,
          subscription_id: session.subscription,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('role', 'prof');

      if (updateError) {
        console.error('❌ Erreur mise à jour users_roles:', updateError);
      } else {
        console.log('✅ Tier mis à jour pour user:', userId, '→', tier);
      }
    }

    res.json({
      success: true,
      tier: tier,
      email: userEmail
    });

  } catch (error) {
    console.error('❌ Erreur vérification session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Nouveau : Gérer le portail client Stripe (pour annuler l'abonnement)
router.post('/create-portal-session', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { userId } = req.body;

    console.log('🔍 Création portal session pour:', userId);

    const supabase = getSupabaseAdmin();
    
    // Récupérer le stripe_customer_id
    const { data: user, error } = await supabase
      .from('users_roles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('role', 'prof')
      .single();

    if (error || !user || !user.stripe_customer_id) {
      return res.status(404).json({ error: 'Aucun abonnement trouvé' });
    }

    // Créer la session du portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/abonnement`,
    });

    console.log('✅ Portal session créée');
    res.json({ url: portalSession.url });

  } catch (error) {
    console.error('❌ Erreur création portal:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;