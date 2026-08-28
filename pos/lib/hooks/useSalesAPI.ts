import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Sale, CartItem, BillDiscount, PriceType } from "@/types";
import { getLocalSales, isLocalUser, saveLocalSales } from "@/lib/localStore";

export interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  discount: BillDiscount;
  discountAmount: number;
  grandTotal: number;
  amountReceived: number;
  balance: number;
  totalCost: number;
  totalProfit: number;
}

/**
 * Hook for sales API operations
 */
export function useSalesAPI() {
  const { user, signOut } = useAuth();

  return useMemo(() => {
    const getToken = async (forceRefresh = false): Promise<string> => {
      if (!user) throw new Error("User not authenticated");
      return user.getIdToken(forceRefresh);
    };

    const requestWithTokenRetry = async <T>(input: RequestInfo, init: RequestInit, retried = false): Promise<T> => {
      const response = await fetch(input, init);
      if (response.ok) {
        return response.json().then((res) => res.data);
      }
      const errorBody = await response.json().catch(() => ({}));
      const apiError = errorBody.error || response.statusText;

      if (!retried && apiError === "Invalid token") {
        const token = await getToken(true);
        const retryResponse = await fetch(input, {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
          },
        });
        if (retryResponse.ok) {
          return retryResponse.json().then((res) => res.data);
        }
        try {
          await signOut();
        } catch (signOutError) {
          console.warn("Failed to sign out after invalid token:", signOutError);
        }
        throw new Error("Session expired. Please sign out and sign in again.");
      }

      throw new Error(apiError || "Failed request");
    };

    const getSales = async (): Promise<Sale[]> => {
      if (isLocalUser(user?.uid)) return getLocalSales();
      const token = await getToken();
      return requestWithTokenRetry<Sale[]>("/api/sales", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    const getSalesInRange = async (start: Date, end: Date): Promise<Sale[]> => {
      if (isLocalUser(user?.uid)) return getLocalSales().filter((sale) => {
        const created = sale.createdAt instanceof Date ? sale.createdAt : sale.createdAt.toDate();
        return created >= start && created <= end;
      });
      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      const token = await getToken();
      return requestWithTokenRetry<Sale[]>(`/api/sales/range?start=${startStr}&end=${endStr}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    const checkout = async (data: CheckoutData): Promise<{ saleId: string; invoiceNumber: string }> => {
      if (isLocalUser(user?.uid)) {
        const settings = JSON.parse(window.localStorage.getItem("pos-local-settings") || '{"invoiceCounter":1}');
        const invoiceNumber = `LOCAL-${String(settings.invoiceCounter || 1).padStart(5, "0")}`;
        const saleId = `local-sale-${Date.now()}`;
        const sale: Sale = { id: saleId, invoiceNumber, items: data.items.map((item) => ({ productId: item.productId, productName: item.name, quantity: item.quantity, unitPrice: item.unitPrice, costPrice: item.costPrice, priceType: item.priceType, lineTotal: item.lineTotal, lineProfit: item.lineProfit })), subtotal: data.subtotal, discountType: data.discount.type, discountValue: data.discount.value, discountAmount: data.discountAmount, grandTotal: data.grandTotal, amountReceived: data.amountReceived, balance: data.balance, totalCost: data.totalCost, totalProfit: data.totalProfit, createdAt: new Date(), createdBy: user?.uid || "local" };
        saveLocalSales([sale, ...getLocalSales()]);
        window.localStorage.setItem("pos-local-settings", JSON.stringify({ ...settings, invoiceCounter: (settings.invoiceCounter || 1) + 1 }));
        return { saleId, invoiceNumber };
      }
      const token = await getToken();

      return requestWithTokenRetry<{ saleId: string; invoiceNumber: string }>("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    };

    const createReturn = async (
      payload: {
        originalSaleId: string;
        originalInvoiceNumber: string;
        customerName?: string | null;
        refundAmount?: number;
        customerOwes?: number;
        items: Array<{
          productId: string;
          productName: string;
          quantity: number;
          unitPrice: number;
          costPrice: number;
          priceType: PriceType;
          lineTotal: number;
          lineProfit: number;
        }>;
      }
    ): Promise<{ saleId: string; invoiceNumber: string }> => {
      if (isLocalUser(user?.uid)) {
        const saleId = `local-return-${Date.now()}`;
        const invoiceNumber = `LOCAL-RET-${Date.now().toString().slice(-5)}`;
        const amount = payload.items.reduce((sum, item) => sum + item.lineTotal, 0);
        const returned: Sale = { id: saleId, invoiceNumber, type: "return", originalSaleId: payload.originalSaleId, originalInvoiceNumber: payload.originalInvoiceNumber, customerName: payload.customerName || undefined, refundAmount: payload.refundAmount, customerOwes: payload.customerOwes, items: payload.items, subtotal: amount, discountType: "none", discountValue: 0, discountAmount: 0, grandTotal: amount, amountReceived: 0, balance: 0, totalCost: payload.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0), totalProfit: payload.items.reduce((sum, item) => sum + item.lineProfit, 0), createdAt: new Date(), createdBy: user?.uid || "local" };
        saveLocalSales([returned, ...getLocalSales()]);
        return { saleId, invoiceNumber };
      }
      const token = await getToken();

      return requestWithTokenRetry<{ saleId: string; invoiceNumber: string }>("/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    };

    return {
      getSales,
      getSalesInRange,
      checkout,
      createReturn,
    };
  }, [user]);
}
