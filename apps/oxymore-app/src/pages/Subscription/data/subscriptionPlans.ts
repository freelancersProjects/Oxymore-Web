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

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Free Plan",
    price: "$0",
    period: "/Monthly",
    credits: [
      { name: "Tournament Entries", value: "2/month", included: true },
      { name: "Team Slots", value: "1 Team", included: true },
      { name: "Video Uploads", value: "", included: false },
      { name: "Custom Badges", value: "", included: false },
      { name: "Elo Analytics Access", value: "", included: false }
    ],
    included: [
      { name: "Matchmaking Speed", value: "", included: false },
      { name: "Community Access", value: "", included: false },
      { name: "View Public Tournaments", value: "", included: false },
      { name: "Limited Chat Access", value: "", included: false }
    ]
  },
  {
    name: "Pro Plan",
    price: "$9.99",
    period: "/Monthly",
    credits: [
      { name: "Tournament Entries", value: "UNLIMITED", included: true },
      { name: "Team Slots", value: "3 Teams", included: true },
      { name: "Video Uploads", value: "10/month", included: true },
      { name: "Custom Badges", value: "", included: true },
      { name: "Elo Analytics Access", value: "", included: true }
    ],
    included: [
      { name: "Matchmaking Speed", value: "Fast", included: true },
      { name: "Stats Tracking", value: "Full Match Stats", included: true },
      { name: "Community Chat", value: "Full Access", included: true },
      { name: "Early Access to Events", value: "", included: true }
    ]
  },
  {
    name: "Team Plan",
    price: "$24.99",
    period: "/Monthly",
    credits: [
      { name: "Tournament Entries", value: "UNLIMITED", included: true },
      { name: "Team Slots", value: "UNLIMITED", included: true },
      { name: "Video Uploads", value: "50/month", included: true },
      { name: "Custom Badges", value: "", included: true },
      { name: "Elo Analytics Access", value: "", included: true }
    ],
    included: [
      { name: "Matchmaking Speed", value: "Priority Queue", included: true },
      { name: "Stats Tracking", value: "Advanced with Graphs", included: true },
      { name: "Community Chat", value: "Full + Team Chat", included: true },
      { name: "Private Match Access", value: "", included: true }
    ]
  }
];

