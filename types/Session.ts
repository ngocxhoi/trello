export type Session = {
  user: {
    name: string | null;
    email: string | null;
    sub: string | null;
    subscription: {
      id: string | null;
      status: string | null;
      priceId: string | null;
    };
    id: string | null;
    password: string | null;
    stripeCustomerId: string | null;
    hasActiveSubscription: boolean | null;
    coverImage: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    lat: string | null;
    exp: string | null;
    jti: string | null;
  };
  expiresAt: string | null;
};
