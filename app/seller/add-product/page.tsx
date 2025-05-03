"use client";

import ProductForm from "@/components/seller/product-form";

export default function AddProduct() {
    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
            <ProductForm />
        </div>
    );
}
