export type Product = {
  id: string;
  name: string;
  stockQuantity: number;
  costPrice: number;
};

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  createdAt: Date | { toDate?: () => Date };
};
