import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase Admin Client
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
  // ✅ PRODUCTION (LIVE)
  'price_1SwNdsFSyMXEe0X7Wd46Qrok': 'gratuit',  // gratuit_monthly
  'price_1SwNeGFSyMXEe0X72bi92I0F': 'gratuit',  // gratuit_yearly
  'price_1SwNecFSyMXEe0X7DgtMYDSs': 'pro',      // pro_monthly
  'price_1SwNf9FSyMXEe0X7IEmQgSBp': 'pro',      // pro_yearly
  'price_1SwNfQFSyMXEe0X7BvRNgApe': 'premium',  // premium_monthly
  'price_1SwNfdFSyMXEe0X74z6DNY0b': 'premium',  // premium_yearly
  
  // TEST (pour garder la compatibilité)
  'price_1SuACOFEu2lrL216y4C6PbuP': 'gratuit',
  'price_1SuADVFEu2lrL216SQm5agHc': 'gratuit',
  'price_1SuACnFEu2lrL216xouwXPm0': 'pro',
  'price_1SuADhFEu2lrL21638mz6Oij': 'pro',
  'price_1SuAD4FEu2lrL2160uwZdxG4': 'premium',
  'price_1SuAEWFEu2lrL216eLG8DOiB': 'premium'
};

// ✅ FORMAT EXPRESS (pas Next.js)
export default async function stripeWebhook(req, res) {
  console.log('🎯 === DÉBUT WEBHOOK ===');
  
  try {
    // ✅ Express.raw() a déjà mis le buffer dans req.body
    const sig = req.headers['stripe-signature'];
    
    console.log('📦 Buffer reçu:', req.body?.length || 0, 'bytes');
console.log('🔑 Signature:', sig ? 'présente' : 'MANQUANTE');
console.log('🔐 Secret existe?', !!process.env.STRIPE_WEBHOOK_SECRET);
console.log('🔐 Secret commence par whsec_?', process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'));
console.log('📝 Body type:', typeof req.body, 'Buffer?', Buffer.isBuffer(req.body));

let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,  // ✅ Déjà un Buffer grâce à express.raw()
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('✅ Signature valide');
    } catch (err) {
      console.error('❌ Webhook signature invalide:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('📨 Webhook reçu:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('✅ Paiement réussi !');
        console.log('   Email:', session.customer_email);
        console.log('   Subscription:', session.subscription);

        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'subscription']
        });

        const priceId = fullSession.line_items?.data[0]?.price?.id;
        const tier = PRICE_TO_TIER[priceId] || 'gratuit';
        const customerEmail = session.customer_email;

        console.log('   Price ID:', priceId, '-> Tier:', tier);

        if (customerEmail) {
          const supabase = getSupabaseAdmin();
          
          const { error: updateError } = await supabase
            .from('users_roles')
            .update({
              subscription_status: 'active',
              subscription_id: session.subscription,
              stripe_customer_id: session.customer,
              subscription_start_date: new Date().toISOString(),
              tier: tier
            })
            .eq('email', customerEmail)
            .eq('role', 'prof');

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

        const { error: updateError } = await supabase
          .from('users_roles')
          .update({
            subscription_status: 'canceled',
            subscription_end_date: new Date().toISOString(),
            tier: 'gratuit'
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

    console.log('🎯 === FIN WEBHOOK (SUCCESS) ===');
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('❌ Erreur globale webhook:', error);
    console.error('Stack:', error.stack);
    return res.status(400).json({ error: error.message });
  }
}