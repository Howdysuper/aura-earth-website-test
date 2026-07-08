import "server-only";
import {
  getUserOrders as fbGetUserOrders,
  getUserAddresses as fbGetUserAddresses,
  type Address,
  type Order,
} from "./firestore";

export type OrderWithItems = Order & {
  items: { id: string; productName: string; quantity: number; unitPriceCents: number }[];
};

export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  return fbGetUserOrders(userId);
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  return fbGetUserAddresses(userId);
}
