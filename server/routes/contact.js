import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuration du transporteur SMTP (Zimbra)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'ssl0.ovh.net',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

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

    // Vérifier si SMTP est configuré
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP_USER ou SMTP_PASS non configuré');
      // En mode dév sans config, on simule l'envoi
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 [DEV] Email simulé:');
        console.log(`   De: ${firstName} ${lastName} <${email}>`);
        console.log(`   Sujet: ${subjectLabel}`);
        console.log(`   Message: ${message}`);
        return res.json({ success: true, message: 'Email simulé en développement' });
      }
      return res.status(500).json({ error: 'Service email non configuré' });
    }

    const transporter = createTransporter();

    // Envoyer l'email
    const mailOptions = {
      from: `"Doude Contact" <${process.env.SMTP_USER}>`,
      to: 'contact@doude.app',
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
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès à contact@doude.app');

    res.json({ success: true, message: 'Message envoyé avec succès' });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

export default router;
