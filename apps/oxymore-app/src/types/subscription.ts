export interface SubscriptionFeature {
  name: string;
  value: string;
  included: boolean;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  period: string;
  credits: SubscriptionFeature[];
  included: SubscriptionFeature[];
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly';
  features: SubscriptionFeature[];
  isPopular?: boolean;
  isCurrent?: boolean;
}
