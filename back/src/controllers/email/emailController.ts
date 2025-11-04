import { Request, Response } from 'express';
import { sendContactEmail } from '../../services/email/emailService';

export const sendContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'name, email, and message are required'
      });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    await sendContactEmail({ name, email, message });

    res.status(200).json({
      message: 'Email sent successfully'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending contact email:', error);
    res.status(500).json({
      message: 'Failed to send email',
      error: errorMessage
    });
  }
};


