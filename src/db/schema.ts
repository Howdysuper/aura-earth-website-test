// Re-export Firestore types for backward compatibility with existing imports.
// Components that import `type Product` from "@/db/schema" will continue to work.
export type {
  Product,
  Subscriber,
  Order,
  OrderItem,
  User,
  Address,
  Review,
  Post,
  ContactMessage,
} from "@/lib/firestore";
