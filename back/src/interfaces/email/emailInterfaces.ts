export type EmailType = 'support' | 'no-reply';

export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export type EmailTemplateName = 'contact' | 'welcome' | 'contact-confirmation';

export interface EmailTemplateMap {
  contact: ContactEmailData;
  welcome: WelcomeEmailData;
  'contact-confirmation': ContactEmailData;
}

export type EmailTemplateData<T extends EmailTemplateName = EmailTemplateName> = 
  T extends 'contact' ? ContactEmailData :
  T extends 'contact-confirmation' ? ContactEmailData :
  T extends 'welcome' ? WelcomeEmailData :
  never;

