export function formatPrice(amount: number): string {
  if (isNaN(amount)) return "$0";
  return "$" + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
