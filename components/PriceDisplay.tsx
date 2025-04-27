import { calculatePrice, formatPrice } from '@/lib/price';
import React from 'react';

interface PriceDisplayProps {
    price: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
    const { current, original, discountPercentage } = calculatePrice(price);

    return (
        <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-semibold text-slate-900">
                {formatPrice(current)}
            </span>

            <span className="text-lg text-gray-500 line-through">
                {formatPrice(original)}
            </span>

            <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {discountPercentage}% OFF
            </span>
        </div>
    );
};

export default PriceDisplay;