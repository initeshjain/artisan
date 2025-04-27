import React, { useState } from 'react';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { CartItem, useCart } from '@/lib/cart';
import { Button } from './ui/button';

const AddToCartForm = ({ cartItem }: { cartItem: CartItem }) => {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    const handleAddToCart = () => {

        addItem(cartItem);
    };

    const handleBuyNow = () => {
        addItem(cartItem);
        // navigateToCheckout();
    };

    return (
        <div className="space-y-6">
            {/* <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                </label>
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                />
            </div> */}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart}>
                    Add to Cart
                </Button>

                <Button variant="secondary" onClick={handleBuyNow}>
                    Buy Now
                </Button>
            </div>
        </div>
    );
};

export default AddToCartForm;