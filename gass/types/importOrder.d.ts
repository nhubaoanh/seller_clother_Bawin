export interface IImportOrder {
  importId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  purchasePrice: number;
  supplier: string;
  notes: string;
  createdAt: string;
  // Backward compatibility
  import_order_id?: string;
  import_code?: string;
}

export interface IStockReport {
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  totalImported: number;
  totalSold: number;
  currentStock: number;
}

export interface IImportOrderSearch {
  pageIndex: number;
  pageSize: number;
  search_content?: string;
}
