import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validation des champs
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Mapper le sujet
    const subjectMap = {
      'general': 'Question générale',
      'support': 'Support technique',
      'billing': 'Facturation & abonnement',
      'feature': 'Suggestion de fonctionnalité',
      'partnership': 'Partenariat',
      'other': 'Autre'
    };
    const subjectLabel = subjectMap[subject] || subject;

    // Vérifier si l'API key est configurée
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY non configurée');
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 [DEV] Email simulé:');
        console.log(`   De: ${firstName} ${lastName} <${email}>`);
        console.log(`   Sujet: ${subjectLabel}`);
        console.log(`   Message: ${message}`);
        return res.json({ success: true, message: 'Email simulé en développement' });
      }
      return res.status(500).json({ error: 'Service email non configuré' });
    }

    // Envoyer l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Doude Contact <contact@doude.app>',
      to: ['contact@doude.app'],
      replyTo: email,
      subject: `[Doude] ${subjectLabel} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A3728;">Nouveau message de contact</h2>

          <div style="background-color: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>De:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Sujet:</strong> ${subjectLabel}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #B8860B; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4A3728;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #888; font-size: 12px;">
            Ce message a été envoyé depuis le formulaire de contact de doude.app
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
    }

    console.log('✅ Email envoyé avec succès:', data.id);
    res.json({ success: true, message: 'Message envoyé avec succès' });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

export default router;
