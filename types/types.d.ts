import { Category, Product, User } from "@prisma/client"
import { Prisma } from "@prisma/client";

export type ProductWithCategoryAndSeller = Product & {
  category: Category
  seller: User;
}

export type UserWithAddress = {
    name: string,
    email: string,
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        phone: string;
        id: string;
        userId: string;
    }
}

const userWithAllData = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    products: {
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    },
    orders: {
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    },
    notifications: {
      orderBy: {
        createdAt: "desc",
      },
    },
    address: true,
  },
});

export type FullUser = Prisma.UserGetPayload<typeof userWithAllData>;
