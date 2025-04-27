"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Product = {
    id: number;
    name: string;
    active: boolean;
};

export default function MyProductsPage() {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: "Product A", active: true },
        { id: 2, name: "Product B", active: false },
    ]);

    const toggleActive = (id: number) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, active: !p.active } : p
            )
        );
    };

    const deleteProduct = (id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const editProduct = (id: number) => {
        alert(`Edit product ${id}`); // Replace with modal/navigation
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Products List */}
            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between bg-white p-4 rounded shadow"
                    >
                        <div>
                            <h2 className="text-lg font-medium">{product.name}</h2>
                            <p className="text-sm text-gray-500">
                                Status:{" "}
                                <span className={product.active ? "text-green-600" : "text-red-500"}>
                                    {product.active ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => editProduct(product.id)}
                                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => toggleActive(product.id)}
                                className={`px-3 py-1 rounded ${product.active
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-green-600 hover:bg-green-700"
                                    } text-white`}
                            >
                                {product.active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                                onClick={() => deleteProduct(product.id)}
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
