import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Palette, Brush, ShoppingBag } from "lucide-react"
import Link from "next/link"
import FeaturedProducts from "@/components/featured-products"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2400')] bg-cover bg-center opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Unique Handmade Art</h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Connect with talented artisans and find one-of-a-kind pieces that tell a story
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse Art</Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild>
              <Link href="/sell">Start Selling</Link>
            </Button> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Marketplace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Unique Artwork</h3>
              <p className="text-muted-foreground">
                Discover handcrafted pieces that you won't find anywhere else
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Brush className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Support Artists</h3>
              <p className="text-muted-foreground">
                Connect directly with artists and support their creative journey
              </p>
            </Card>
            <Card className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-muted-foreground">
                Shop with confidence with our secure payment system
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Artworks</h2>
          <FeaturedProducts />
        </div>
      </section>
    </main>
  )
}