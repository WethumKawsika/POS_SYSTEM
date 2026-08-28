"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/types";

export interface ProductFormValues {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  specialPrice?: number;
  stockQuantity: number;
  barcode?: string;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: ProductFormValues, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const { register, handleSubmit, reset } = useForm<ProductFormValues>({
    defaultValues: { name: "", category: "General", costPrice: 0, sellingPrice: 0, specialPrice: undefined, stockQuantity: 0, barcode: "" },
  });

  useEffect(() => {
    reset(product ? {
      name: product.name,
      category: product.category,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      specialPrice: product.specialPrice,
      stockQuantity: product.stockQuantity,
      barcode: product.barcode ?? "",
    } : undefined);
  }, [product, reset]);

  const submit = async (values: ProductFormValues) => {
    const input = document.getElementById("product-image") as HTMLInputElement | null;
    await onSubmit(values, input?.files?.[0]);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Name<input {...register("name", { required: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium">Category<input {...register("category", { required: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium">Cost price<input type="number" step="0.01" min="0" {...register("costPrice", { required: true, valueAsNumber: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium">Selling price<input type="number" step="0.01" min="0" {...register("sellingPrice", { required: true, valueAsNumber: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium">Special price<input type="number" step="0.01" min="0" {...register("specialPrice", { valueAsNumber: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium">Stock quantity<input type="number" min="0" {...register("stockQuantity", { required: true, valueAsNumber: true })} className="input-field mt-1" /></label>
        <label className="text-sm font-medium sm:col-span-2">Barcode<input {...register("barcode")} className="input-field mt-1" /></label>
        <label className="text-sm font-medium sm:col-span-2">Product image<input id="product-image" type="file" accept="image/*" className="input-field mt-1 py-2" /></label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save product"}</button>
      </div>
    </form>
  );
}
