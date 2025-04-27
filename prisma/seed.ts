import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    // Clean existing data
    await prisma.notification.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "Wooden Sculptures",
          description: "Hand-carved wooden sculptures and figurines",
          approved: true,
        },
      }),
      prisma.category.create({
        data: {
          name: "Wall Art",
          description: "Decorative pieces for wall display",
          approved: true,
        },
      }),
      prisma.category.create({
        data: {
          name: "Furniture",
          description: "Handcrafted wooden furniture pieces",
          approved: true,
        },
      }),
    ])

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 10)
    
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: "John Artist",
          email: "john@example.com",
          hashedPassword,
          address: {
            create: {
              street: "123 Art Street",
              city: "Craftville",
              state: "CA",
              postalCode: "12345",
              country: "USA",
              phone: "123-456-7890",
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          name: "Sarah Creator",
          email: "sarah@example.com",
          hashedPassword,
          address: {
            create: {
              street: "456 Craft Avenue",
              city: "Artiston",
              state: "NY",
              postalCode: "67890",
              country: "USA",
              phone: "098-765-4321",
            },
          },
        },
      }),
    ])

    // Create products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          title: "Handcrafted Wooden Bowl",
          description: "Beautiful hand-carved wooden bowl made from sustainable maple wood",
          price: 89.99,
          images: ["https://images.unsplash.com/photo-1635363638580-6c3c5e599343?w=800&q=80"],
          categoryId: categories[0].id,
          userId: users[0].id,
          keywords: ["bowl", "wooden", "handcrafted", "maple"],
        },
      }),
      prisma.product.create({
        data: {
          title: "Abstract Wall Art",
          description: "Modern abstract wall art piece carved from reclaimed wood",
          price: 199.99,
          images: ["https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=800&q=80"],
          categoryId: categories[1].id,
          userId: users[0].id,
          keywords: ["wall art", "abstract", "modern", "reclaimed"],
        },
      }),
      prisma.product.create({
        data: {
          title: "Wooden Sculpture",
          description: "Contemporary wooden sculpture perfect for home decoration",
          price: 299.99,
          images: ["https://images.unsplash.com/photo-1595856619767-ab951ca3b5c7?w=800&q=80"],
          categoryId: categories[0].id,
          userId: users[1].id,
          keywords: ["sculpture", "contemporary", "decoration"],
        },
      }),
    ])

    // Create orders
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          userId: users[1].id,
          total: 89.99,
          status: "COMPLETED",
          orderItems: {
            create: {
              productId: products[0].id,
              quantity: 1,
              price: 89.99,
            },
          },
          notification: {
            create: {
              userId: users[1].id,
              type: "ORDER_CREATED",
              message: "Your order has been placed successfully",
            },
          },
        },
      }),
      prisma.order.create({
        data: {
          userId: users[0].id,
          total: 299.99,
          status: "PENDING",
          orderItems: {
            create: {
              productId: products[2].id,
              quantity: 1,
              price: 299.99,
            },
          },
          notification: {
            create: {
              userId: users[0].id,
              type: "ORDER_CREATED",
              message: "Your order has been placed successfully",
            },
          },
        },
      }),
    ])

    console.log("Seed data created successfully")
  } catch (error) {
    console.error("Error seeding data:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()