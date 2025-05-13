"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import EditProductForm from "./edit-product";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function MyProductsPage() {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([])
    const [editingProductId, setEditingProductId] = useState<string | null>(null)

    const openEditModal = (id: string) => setEditingProductId(id);
    const closeEditModal = () => {
        setEditingProductId(null)
        fetchProducts()
    }

    useEffect(() => {
        if (status === "loading" || !session) return;
        fetchProducts();
    }, [status, session]);

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
            toast.success("Product visibility changed");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to toggle active status: " + error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await fetch(`/api/seller/products/${id}`, { method: "DELETE" });
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Failed to delete product: " + error);
        }
    };

    return (
        <div className="w-full px-0 py-4">
            {editingProductId && (
                <EditProductForm id={editingProductId} onClose={closeEditModal} />
            )}

            <ScrollArea className="space-y-4">
                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No products found.</p>
                ) : (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Status:{" "}
                                    <span className={product.isActive ? "text-green-600" : "text-red-500"}>
                                        {product.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <Button
                                    onClick={() => openEditModal(product.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                >
                                    Edit
                                </Button>

                                <Button
                                    onClick={() => toggleActive(product.id, product.isActive)}
                                    className={`text-white ${product.isActive
                                        ? "bg-gray-500 hover:bg-gray-600"
                                        : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {product.isActive ? "Deactivate" : "Activate"}
                                </Button>

                                <Button
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
}
