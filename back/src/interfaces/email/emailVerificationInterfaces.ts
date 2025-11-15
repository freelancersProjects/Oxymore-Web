export interface EmailVerification {
  id_verification: string;
  id_user: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface EmailVerificationInput {
  id_user: string;
  token: string;
  expires_at: string;
}

export interface EmailVerificationData {
  name: string;
  email: string;
  verificationLink: string;
}

