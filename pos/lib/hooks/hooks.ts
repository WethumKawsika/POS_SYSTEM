export const useProductAPI = () => {
  return {
    getProducts: async () => {
      return [
        { id: "1", name: "Product A", stockQuantity: 12, costPrice: 5 },
        { id: "2", name: "Product B", stockQuantity: 0, costPrice: 10 },
      ];
    },
    updateProduct: async (id: string, data: Partial<{ stockQuantity: number }>) => {
      console.log("updateProduct", id, data);
      return { id, ...data };
    },
  };
};

export const useStockAPI = () => {
  return {
    getStockMovements: async (limit: number) => {
      return [
        {
          id: "m1",
          productId: "1",
          productName: "Product A",
          type: "adjustment",
          quantityChange: 5,
          previousStock: 7,
          newStock: 12,
          createdAt: new Date(),
        },
      ].slice(0, limit);
    },
    recordStockMovement: async (movement: any) => {
      console.log("recordStockMovement", movement);
      return movement;
    },
  };
};

export const useSettingsAPI = () => {
  return {
    getSettings: async () => {
      return { lowStockThreshold: 10 };
    },
  };
};
