import { useAuth } from "@/contexts/AuthContext";
import type { StockMovement } from "@/types";

export interface StockMovementData {
  productId: string;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  note?: string;
}