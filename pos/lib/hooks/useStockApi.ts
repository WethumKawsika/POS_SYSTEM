import { useAuth } from "@/contexts/AuthContext";
import type { StockMovement } from "@/types";
import { getLocalMovements, isLocalUser, saveLocalMovements } from "@/lib/localStore";

export interface StockMovementData {
  productId: string;
  productName: string;
  type: "sale" | "restock" | "adjustment";
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  note?: string;
}

/**
 * Hook for stock API operations
 */
export function useStockAPI() {
  const { user } = useAuth();

  const getToken = async (): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    return user.getIdToken();
  };

  const getStockMovements = async (limit = 100): Promise<StockMovement[]> => {
    if (isLocalUser(user?.uid)) return getLocalMovements().slice(0, limit);
    const response = await fetch(`/api/stock?limit=${limit}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch stock movements");
    }

    return response.json().then((res) => res.data);
  };

  const recordStockMovement = async (data: StockMovementData): Promise<void> => {
    if (isLocalUser(user?.uid)) {
      saveLocalMovements([{ ...data, id: `local-${Date.now()}`, createdAt: new Date(), createdBy: user?.uid || "local" }, ...getLocalMovements()]);
      return;
    }
    const token = await getToken();

    const response = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to record stock movement");
    }
  };

  return {
    getStockMovements,
    recordStockMovement,
  };
}
