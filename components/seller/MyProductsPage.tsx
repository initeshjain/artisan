"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import EditProductForm from "./edit-product";

export default function MyProductsPage() {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([])
    const [editingProductId, setEditingProductId] = useState<string | null>(null)

    const openEditModal = (id: string) => {
        setEditingProductId(id)
    }

    const closeEditModal = () => {
        setEditingProductId(null)
        fetchProducts()
    }

    useEffect(() => {
        if (status === "loading") return;
        if (!session) return;

        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/seller/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to fetch products: " + error)
        }
    };

    const toggleActive = async (id: string, isActive: boolean) => {
        try {
            await fetch(`/api/seller/products/toggle/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !isActive }),
            });
            toast.success("Product visibility changed")
            fetchProducts(); // Refetch to sync state
        } catch (error) {
            toast.error("Failed to toggle active status: " + error)
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted")
        } catch (error) {
            toast.error("Failed to delete product: " + error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {editingProductId && (
                <EditProductForm id={editingProductId} onClose={closeEditModal} />
            )}
            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between bg-white p-4 rounded shadow"
                    >
                        <div>
                            <h2 className="text-lg font-medium">{product.title}</h2>
                            <p className="text-sm text-gray-500">
                                Status:{" "}
                                <span
                                    className={
                                        product.isActive ? "text-green-600" : "text-red-500"
                                    }
                                >
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => openEditModal(product.id)}
                                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => toggleActive(product.id, product.isActive)}
                                className={`px-3 py-1 rounded ${product.isActive
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-green-600 hover:bg-green-700"
                                    } text-white`}
                            >
                                {product.isActive ? "Deactivate" : "Activate"}
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
