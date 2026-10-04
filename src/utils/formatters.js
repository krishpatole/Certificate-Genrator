/**
 * Formats a number to Indian Rupee currency format (e.g. ₹85,00,000)
 * @param {number} amount 
 * @returns {string}
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
