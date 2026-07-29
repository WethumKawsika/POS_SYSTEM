"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Modal } from "@/components/ui/Modal";
import { ProductForm, ProductFormValues } from "@/components/products/ProductForm";
import { useProductAPI } from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const productAPI = useProductAPI();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | undefined>();
    const [saving, setSaving] = useState(false);
}

const load = useCallback(async () => {
    try {
        setProducts(await productAPI.getProducts());
    } catch {
        toast.error("Failed to load products");
    } finally {
        setLoading(false);
    }
}, [productAPI]);

useEffect(() => {
    load();
}, [load]);

const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.barcode?.includes(q)
    );
}, [products, search]);

const handleSubmit = async (values: ProductFormValues, imageFile?: File) => {
    setSaving(true);
    try {
        if (editing) {
            // Update existing product
            await productAPI.updateProduct(editing.id, values);
            if (imageFile) {
                await productAPI.uploadProductImage(editing.id, imageFile);
            }
            toast.success("Product updated");
        } else {
            // Create new product
            const result = await productAPI.createProduct(values, imageFile);
            toast.success("Product added");
        }
        setModalOpen(false);
        setEditing(undefined);
        await load();
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
        setSaving(false);
    }
};

const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
        await productAPI.deleteProduct(product.id);
        toast.success("Deleted");
        await load();
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Delete failed");
    }
};

