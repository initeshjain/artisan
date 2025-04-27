/**
 * Calculate discount price based on original price
 * @param price - The current price
 * @returns Object with original and current price
 */
export function calculatePrice(price: number) {
    // Calculate the "original" price (20% higher than the current price)
    const originalPrice = price * 1.2;

    return {
        current: price,
        original: originalPrice,
        discountPercentage: 20,
    };
}

/**
 * Format price to currency string
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
}