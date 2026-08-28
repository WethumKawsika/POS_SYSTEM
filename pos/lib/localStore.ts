import type { Product, Sale, ShopSettings, StockMovement } from "@/types";

const productsKey = "pos-local-products";
const salesKey = "pos-local-sales";
const settingsKey = "pos-local-settings";
const movementsKey = "pos-local-movements";

const defaultProducts: Product[] = [
  { id: "local-1", name: "Product A", category: "General", costPrice: 5, sellingPrice: 8, profitPerItem: 3, stockQuantity: 12, barcode: "100000000001", createdAt: new Date() },
  { id: "local-2", name: "Product B", category: "General", costPrice: 10, sellingPrice: 15, profitPerItem: 5, stockQuantity: 8, barcode: "100000000002", createdAt: new Date() },
];

const defaultSettings: ShopSettings = { id: "shop", shopName: "Smart Retail", address: "Local store", contactNumber: "", receiptFooter: "Thank you for shopping with us.", lowStockThreshold: 10, invoiceCounter: 1 };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

function write<T>(key: string, value: T) { window.localStorage.setItem(key, JSON.stringify(value)); }

export const isLocalUser = (uid?: string) => uid?.startsWith("local-") === true;
export const getLocalProducts = () => read(productsKey, defaultProducts);
export const saveLocalProducts = (products: Product[]) => write(productsKey, products);
export const getLocalSales = () => read<Sale[]>(salesKey, []);
export const saveLocalSales = (sales: Sale[]) => write(salesKey, sales);
export const getLocalSettings = () => read(settingsKey, defaultSettings);
export const saveLocalSettings = (settings: ShopSettings) => write(settingsKey, settings);
export const getLocalMovements = () => read<StockMovement[]>(movementsKey, []);
export const saveLocalMovements = (movements: StockMovement[]) => write(movementsKey, movements);
