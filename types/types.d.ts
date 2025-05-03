import { Category, Product, User } from "@prisma/client"

export type ProductWithCategoryAndSeller = Product & {
  category: Category
  seller: User;
}