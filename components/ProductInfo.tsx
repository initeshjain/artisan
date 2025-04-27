import React from 'react';

interface ProductInfoProps {
    title: string;
    category: string;
    description: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, category, description }) => {
    return (
        <div className="space-y-3">
            <div>
                <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
                    {category}
                </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>

            <div className="mt-4 prose prose-slate prose-p:text-gray-600 max-w-none">
                <p>{description}</p>
            </div>
        </div>
    );
};

export default ProductInfo;