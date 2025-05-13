import SellerTabs from "@/components/seller/seller-tabs";
import StatsCard from "@/components/seller/stats";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProductsPage() {

    return (
        <div className="min-h-screen max-w-screen md:mx-28 p-6">

            <StatsCard />

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
