import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onQuantityChange,
    min = 1,
    max = 99,
}) => {
    const decreaseQuantity = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= min && value <= max) {
            onQuantityChange(value);
        }
    };

    return (
        <div className="flex items-center h-11 border border-gray-300 rounded-md overflow-hidden">
            <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= min}
                className="flex items-center justify-center w-11 h-full text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>

            <input
                type="number"
                min={min}
                max={max}
                value={quantity}
                onChange={handleInputChange}
                className="w-12 h-full text-center text-gray-900 border-0 focus:outline-none focus:ring-0 bg-white"
                aria-label="Quantity"
            />

            <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= max}
                className="flex items-center justify-center w-11 h-full text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export default QuantitySelector;