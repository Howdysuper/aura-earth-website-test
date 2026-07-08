import "server-only";
import {
  getReviewsForProduct as fbGetReviewsForProduct,
  getReviewSummary as fbGetReviewSummary,
  getTopRatedProducts as fbGetTopRatedProducts,
  getAllReviews as fbGetAllReviews,
  userHasPurchased as fbUserHasPurchased,
  createReview as fbCreateReview,
  type Review,
  type Product,
} from "./firestore";
import { getCurrentUser } from "@/lib/auth";

export type ReviewWithUser = Review & { reviewerName: string };

export async function getReviewsForProduct(
  productId: string,
): Promise<ReviewWithUser[]> {
  return fbGetReviewsForProduct(productId);
}

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export async function getReviewSummary(
  productId: string,
): Promise<ReviewSummary> {
  return fbGetReviewSummary(productId);
}

export async function getTopRatedProducts(limit = 4) {
  return fbGetTopRatedProducts(limit);
}

export type GlobalReview = ReviewWithUser & {
  productName: string;
  productSlug: string;
  productImage: string;
};

export async function getAllReviews(
  limit = 30,
): Promise<{ reviews: GlobalReview[]; summary: ReviewSummary }> {
  return fbGetAllReviews(limit);
}

export async function userHasPurchased(
  userId: string,
  productId: string,
): Promise<boolean> {
  return fbUserHasPurchased(userId, productId);
}

export async function createReview(data: {
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
}) {
  return fbCreateReview(data);
}

export async function getCurrentUserForReview() {
  return getCurrentUser();
}
