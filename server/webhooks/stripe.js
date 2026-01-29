import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin Client (initialisé à la demande)
let supabaseAdmin = null;
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Assure-toi d'avoir cette clé dans .env
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

export default async function stripeWebhook(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature invalide:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook reçu:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ Paiement réussi !');
      console.log('   Email:', session.customer_email);
      console.log('   Subscription:', session.subscription);

      // Récupérer les détails de la session avec les line_items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'subscription']
      });

      const priceId = fullSession.line_items?.data[0]?.price?.id;
      const tier = PRICE_TO_TIER[priceId] || 'gratuit';
      
      // ⚠️ CHANGÉ : Utiliser l'email au lieu de clerk_user_id
      const customerEmail = session.customer_email;

      console.log('   Price ID:', priceId, '-> Tier:', tier);
      console.log('   Email:', customerEmail);

      if (customerEmail) {
        const supabase = getSupabaseAdmin();
        
        // Mettre à jour users_roles avec les infos d'abonnement
        const { error: updateError } = await supabase
          .from('users_roles')
          .update({
            subscription_status: 'active',
            subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            subscription_start_date: new Date().toISOString(),
            tier: tier // Ajouter le tier si tu veux
          })
          .eq('email', customerEmail)
          .eq('role', 'prof'); // Seulement les profs ont des abonnements

        if (updateError) {
          console.error('❌ Erreur mise à jour users_roles:', updateError);
        } else {
          console.log('✅ Abonnement activé pour:', customerEmail, '-> Tier:', tier);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      console.log('🔄 Abonnement mis à jour');

      const priceId = subscription.items?.data[0]?.price?.id;
      const tier = PRICE_TO_TIER[priceId] || 'gratuit';
      const customerId = subscription.customer;

      console.log('   Customer ID:', customerId);
      console.log('   Nouveau tier:', tier);
      console.log('   Status:', subscription.status);

      const supabase = getSupabaseAdmin();

      // Trouver l'utilisateur par stripe_customer_id
      const { data: user, error: findError } = await supabase
        .from('users_roles')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .eq('role', 'prof')
        .single();

      if (findError || !user) {
        console.error('❌ Utilisateur non trouvé pour customer:', customerId);
        break;
      }

      // Mettre à jour le statut selon l'état Stripe
      let newStatus = 'active';
      if (subscription.status === 'canceled') {
        newStatus = 'canceled';
      } else if (subscription.status === 'past_due') {
        newStatus = 'past_due';
      } else if (subscription.status === 'unpaid') {
        newStatus = 'past_due';
      }

      const { error: updateError } = await supabase
        .from('users_roles')
        .update({
          subscription_status: newStatus,
          tier: tier,
          subscription_id: subscription.id
        })
        .eq('stripe_customer_id', customerId);

      if (updateError) {
        console.error('❌ Erreur mise à jour:', updateError);
      } else {
        console.log('✅ Tier mis à jour:', user.email, '->', tier, '| Status:', newStatus);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('🗑️ Abonnement annulé');

      const customerId = subscription.customer;
      const supabase = getSupabaseAdmin();

      // Trouver l'utilisateur
      const { data: user, error: findError } = await supabase
        .from('users_roles')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .eq('role', 'prof')
        .single();

      if (findError || !user) {
        console.error('❌ Utilisateur non trouvé pour customer:', customerId);
        break;
      }

      // Remettre à gratuit et marquer comme canceled
      const { error: updateError } = await supabase
        .from('users_roles')
        .update({
          subscription_status: 'canceled',
          subscription_end_date: new Date().toISOString(),
          tier: 'gratuit'
          // ⚠️ On garde subscription_id et stripe_customer_id pour l'historique
        })
        .eq('stripe_customer_id', customerId);

      if (updateError) {
        console.error('❌ Erreur mise à jour:', updateError);
      } else {
        console.log('✅ Abonnement annulé pour:', user.email, '-> Remis à gratuit');
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log('⚠️ Paiement échoué');

      const customerId = invoice.customer;
      const supabase = getSupabaseAdmin();

      // Marquer comme past_due
      const { error: updateError } = await supabase
        .from('users_roles')
        .update({
          subscription_status: 'past_due'
        })
        .eq('stripe_customer_id', customerId);

      if (updateError) {
        console.error('❌ Erreur mise à jour:', updateError);
      } else {
        console.log('⚠️ Abonnement marqué comme past_due');
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      console.log('✅ Paiement réussi (renouvellement)');

      const customerId = invoice.customer;
      const supabase = getSupabaseAdmin();

      // Remettre à active si c'était past_due
      const { error: updateError } = await supabase
        .from('users_roles')
        .update({
          subscription_status: 'active'
        })
        .eq('stripe_customer_id', customerId)
        .eq('role', 'prof');

      if (updateError) {
        console.error('❌ Erreur mise à jour:', updateError);
      } else {
        console.log('✅ Abonnement réactivé après paiement');
      }
      break;
    }

    default:
      console.log('ℹ️ Événement non géré:', event.type);
  }

  res.json({ received: true });
}