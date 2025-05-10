"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Search } from "lucide-react"
import Cart from "./cart"
import { ProductSearch } from "./product-search"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <div className="flex items-center">
          <Package className="h-8 w-8 text-slate-900" />
          <Link href="/">
            <span className="ml-2 text-xl font-semibold text-slate-900">Artisan</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" /> */}
            <ProductSearch />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost">Browse</Button>
          </Link>

          {session ? (
            <>
              <Link href="/seller">
                <Button variant="ghost">Seller</Button>
              </Link>
              <Link href="/my-profile">
                <Button variant="ghost">My Profile</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Link href="/my-profile">Profile</Link></DropdownMenuItem>
                  {/* <DropdownMenuItem><Link href="/my-profile">Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => signOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            </>
          )}
          <Cart />
        </div>
      </div>
    </nav>
  )
}