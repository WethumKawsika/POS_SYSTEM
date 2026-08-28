"use client";

import { Printer, Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { printReceipt, downloadReceiptPdf } from "@/lib/receipt";
import type { Sale, ShopSettings } from "@/types";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale;
  settings: ShopSettings;
}

export function ReceiptModal({ open, onClose, sale, settings }: ReceiptModalProps) {
  const date = sale.createdAt instanceof Date
    ? sale.createdAt
    : sale.createdAt.toDate?.() ?? new Date();

  return (
    <Modal open={open} onClose={onClose} title={sale.type === "return" ? "Return Invoice" : "Receipt"} size="sm">
      <div className="space-y-4 font-mono text-sm">
        <div className="text-center">
          <p className="text-base font-bold">{settings.shopName}</p>
          <p className="text-xs text-slate-500">{settings.address}</p>
          <p className="text-xs text-slate-500">{settings.contactNumber}</p>
        </div>
        <div className="border-t border-dashed border-slate-300 pt-3 dark:border-slate-700">
          <p>Invoice: {sale.invoiceNumber}</p>
          <p className="text-xs text-slate-500">{date.toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          {sale.items.map((item) => (
            <div key={`${item.productId}-${item.quantity}`} className="flex justify-between gap-2">
              <span className="flex-1 truncate">{item.productName} x{item.quantity}</span>
              <span>{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 border-t border-dashed border-slate-300 pt-3 dark:border-slate-700">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
          {sale.discountAmount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>-{formatCurrency(sale.discountAmount)}</span></div>}
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCurrency(sale.grandTotal)}</span></div>
          <div className="flex justify-between"><span>Received</span><span>{formatCurrency(sale.amountReceived)}</span></div>
          <div className="flex justify-between"><span>Balance</span><span>{formatCurrency(sale.balance)}</span></div>
        </div>
        <p className="text-center text-xs text-slate-500">{settings.receiptFooter}</p>
        <div className="flex gap-2 pt-2">
          <button type="button" className="btn-primary flex flex-1 items-center justify-center gap-2" onClick={() => printReceipt({ settings, sale })}>
            <Printer className="h-4 w-4" />Print
          </button>
          <button type="button" className="btn-secondary flex flex-1 items-center justify-center gap-2" onClick={() => downloadReceiptPdf({ settings, sale })}>
            <Download className="h-4 w-4" />PDF
          </button>
        </div>
        <button type="button" onClick={onClose} className="btn-secondary w-full">Close</button>
      </div>
    </Modal>
  );
}
