import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  EmailConfig,
  EmailType,
  EmailTemplateName,
  EmailTemplateMap,
  ContactEmailData,
  WelcomeEmailData,
} from '../../interfaces/email/emailInterfaces';

dotenv.config();

const getSmtpConfig = () => {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  console.log('SMTP Config Debug:', {
    hasUser: !!user,
    userLength: user?.length || 0,
    hasPassword: !!password,
    passwordLength: password?.length || 0,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
  });

  if (!user || !password) {
    throw new Error('SMTP credentials are missing. Please configure SMTP_USER and SMTP_PASSWORD in your .env file.');
  }

  const config = {
    host: process.env.SMTP_HOST || 'smtp-mathis.alwaysdata.net',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    requireTLS: true,
    auth: {
      user: user.trim(),
      pass: password.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  console.log('SMTP Config (final):', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    hasPassword: !!config.auth.pass,
  });

  return config;
};

const getEmailAddress = (type: EmailType): string => {
  if (type === 'support') {
    return process.env.EMAIL_SUPPORT || 'support@oxymore.gg';
  }
  return process.env.EMAIL_NO_REPLY || 'no-reply@oxymore.gg';
};

const getTemplatePath = (templateName: string): string => {
  const templatePath = path.join(__dirname, '../../../../apps/templates/email', `${templateName}.html`);
  return templatePath;
};

export const renderTemplate = <T extends EmailTemplateName>(
  templateName: T,
  data: EmailTemplateMap[T]
): string => {
  const templatePath = getTemplatePath(templateName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templateName}`);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  if (templateName === 'contact') {
    const contactData = data as ContactEmailData;
    html = html.replace(/{{name}}/g, contactData.name);
    html = html.replace(/{{email}}/g, contactData.email);
    html = html.replace(/{{message}}/g, contactData.message.replace(/\n/g, '<br>'));
  } else if (templateName === 'contact-confirmation') {
    const contactData = data as ContactEmailData;
    html = html.replace(/{{name}}/g, contactData.name);
    html = html.replace(/{{email}}/g, contactData.email);
    html = html.replace(/{{message}}/g, contactData.message.replace(/\n/g, '<br>'));
  } else if (templateName === 'welcome') {
    const welcomeData = data as WelcomeEmailData;
    html = html.replace(/{{name}}/g, welcomeData.name);
    html = html.replace(/{{email}}/g, welcomeData.email);
  }

  return html;
};

export const createTransporter = () => {
  return nodemailer.createTransport(getSmtpConfig());
};

export const sendEmail = async (
  config: EmailConfig,
  emailType: EmailType = 'support'
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions: nodemailer.SendMailOptions = {
    from: `${config.from} <${getEmailAddress(emailType)}>`,
    to: config.to,
    subject: config.subject,
    text: config.text,
    html: config.html,
    replyTo: config.replyTo,
  };

  try {
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasReplyTo: !!mailOptions.replyTo,
      replyTo: mailOptions.replyTo,
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  console.log('sendContactEmail called with data:', {
    name: data.name,
    email: data.email,
    messageLength: data.message.length,
  });

  const html = renderTemplate('contact', data);
  const supportEmail = getEmailAddress('support');

  console.log('Contact email will be sent to:', supportEmail);

  const text = `
New contact message
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
  `;

  await sendEmail(
    {
      from: data.name,
      to: supportEmail,
      subject: `New contact message - ${data.name}`,
      text,
      html,
      replyTo: data.email,
    },
    'support'
  );

  const confirmationHtml = renderTemplate('contact-confirmation', data);
  const confirmationText = `
Hello ${data.name},

We have received your message and thank you for contacting us.

Our team will review your request and get back to you as soon as possible, typically within 24 to 48 business hours.

In the meantime, feel free to check out our website or documentation to find answers to your questions.

Best regards,
The Oxymore Team

---
This is an automatic acknowledgment. Please do not reply directly to this message.
If you have urgent questions, contact us at support@oxymore.gg
  `;

  await sendEmail(
    {
      from: 'Oxymore',
      to: data.email,
      subject: 'Your message has been received - Oxymore',
      text: confirmationText,
      html: confirmationHtml,
    },
    'no-reply'
  );

  console.log('Confirmation email sent to:', data.email);
};

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<void> => {
  const html = renderTemplate('welcome', data);

  const text = `
Welcome to Oxymore!

Hello ${data.name},

We are thrilled to welcome you to Oxymore, the competitive esports platform that allows you to create, join, and manage your video game tournaments with ease.

Your account has been successfully created. You can now:
- Participate in competitive tournaments
- Create or join teams
- Track your statistics and performance
- Climb the rankings and leagues
- Connect your Steam or Discord accounts

We invite you to explore the platform and personalize your profile to begin your esports adventure.

Access your platform: https://app.oxymore.gg

If you have any questions or need help, feel free to check out our documentation or contact us at support@oxymore.gg.

Thank you again for joining us, and good luck in your upcoming tournaments!

Best regards,
The Oxymore Team

---
You are receiving this email because you signed up for Oxymore with the address ${data.email}.
  `;

  await sendEmail(
    {
      from: 'Oxymore',
      to: data.email,
      subject: 'Welcome to Oxymore!',
      text,
      html,
    },
    'no-reply'
  );
};

