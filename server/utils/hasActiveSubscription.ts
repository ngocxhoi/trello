export function hasActiveSubscription(action: string): boolean {
  if (action == "active" || action == "trialing") return true;
  return false;
}
