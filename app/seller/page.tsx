import SellerTabs from "@/components/seller/seller-tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProductsPage() {

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Top Right Create Button */}
            <div className="flex justify-end mb-6">
                <Button className="hover:bg-gray-400 text-white px-4 py-2 rounded">
                    <Link href={"/seller/add-product"}>
                        + Create Product
                    </Link>
                </Button>
            </div>

            <SellerTabs />
        </div>
    );
}
