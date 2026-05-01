"use client";

import React, { useRef } from "react";
import { FileText, Download, Printer, X } from "lucide-react";
import { IInvoice, InvoiceDetail } from "@/types/order";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface InvoiceExportProps {
  order: IInvoice;
  onClose: () => void;
}

// Format tiền VND
const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN").format(num || 0) + "đ";
};

// Format ngày
const formatDate = (date: Date | string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Map payment method
const getPaymentMethodText = (method: string) => {
  const map: Record<string, string> = {
    CASH: "Tiền mặt",
    BANK_TRANSFER: "Chuyển khoản ngân hàng",
    COD: "Thanh toán khi nhận hàng (COD)",
  };
  return map[method?.toUpperCase()] || method;
};

export const InvoiceExport: React.FC<InvoiceExportProps> = ({ order, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Parse invoice details
  const details: InvoiceDetail[] =
    typeof order.invoice_details === "string"
      ? JSON.parse(order.invoice_details)
      : order.invoice_details || [];

  // Xuất PDF
  const handleExportPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      // Create a clone of the invoice element
      const clone = invoiceRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.backgroundColor = "#ffffff";
      document.body.appendChild(clone);

      // Function to convert any color to hex
      const toHex = (color: string): string => {
        if (!color) return '';
        if (color.startsWith('#')) return color;
        if (color.startsWith('rgb') || color.startsWith('hsl') || color.startsWith('lab')) {
          const tempDiv = document.createElement('div');
          tempDiv.style.color = color;
          document.body.appendChild(tempDiv);
          const computedColor = window.getComputedStyle(tempDiv).color;
          document.body.removeChild(tempDiv);
          
          // Convert RGB to HEX
          const rgb = computedColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
            const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
            const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
          }
        }
        return color;
      };

      // Process all elements and convert colors to hex
      const processElement = (element: Element) => {
        const el = element as HTMLElement;
        const style = window.getComputedStyle(el);

        // Convert background color
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          el.style.backgroundColor = toHex(style.backgroundColor);
        }

        // Convert text color
        if (style.color) {
          el.style.color = toHex(style.color);
        }

        // Convert border color
        if (style.borderColor) {
          el.style.borderColor = toHex(style.borderColor);
        }

        // Process child elements
        Array.from(element.children).forEach(processElement);
      };

      // Process the cloned element
      processElement(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
        onclone: (document, element) => {
          // Ensure all styles are properly applied in the cloned document
          const style = document.createElement('style');
          style.textContent = `
            * {
              color: #000000 !important;
              background-color: #ffffff !important;
              border-color: #e5e7eb !important;
            }
          `;
          document.head.appendChild(style);
        }
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HoaDon_${order.invoice_code || order.invoice_id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("Lỗi xuất PDF:", error);
      alert("Có lỗi khi xuất PDF. Vui lòng thử lại.");
    }
  };

  // In hóa đơn
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${order.invoice_code || order.invoice_id.slice(0, 8)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            @media print { body { print-color-adjust: exact; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileText size={24} />
            <div>
              <h3 className="text-xl font-bold">Xuất Hóa Đơn</h3>
              <p className="text-green-100 text-sm">#{order.invoice_code || order.invoice_id.slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-100">
          <div ref={invoiceRef} className="bg-white p-8 shadow-lg max-w-2xl mx-auto">
            {/* Invoice Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">EYE PLUS KING</h1>
              <p className="text-gray-600 text-sm">Cửa hàng kính mắt cao cấp GrowBa</p>
              <p className="text-gray-500 text-xs mt-1">
                Địa chỉ: 392, Thanh Tùng, Thanh Miện, Hải Dương | Hotline: 0985848254
              </p>
            </div>

            {/* Invoice Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">HÓA ĐƠN BÁN HÀNG</h2>
              <p className="text-gray-600">
                Số: <span className="font-semibold">{order.invoice_code || order.invoice_id.slice(0, 8)}</span>
              </p>
              <p className="text-gray-500 text-sm">Ngày: {formatDate(order.created_date)}</p>
            </div>

            {/* Customer Info */}
            <div className="mb-6 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin khách hàng:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{order.customer_name}</span></p>
                <p><span className="text-gray-500">SĐT:</span> <span className="font-medium">{order.customer_phone}</span></p>
                <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.customer_email || "-"}</span></p>
                <p><span className="text-gray-500">Địa chỉ:</span> <span className="font-medium">{order.delivery_address || "-"}</span></p>
              </div>
            </div>

            {/* Products Table */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2 text-left w-10">STT</th>
                  <th className="p-2 text-left">Sản phẩm</th>
                  <th className="p-2 text-center w-16">SL</th>
                  <th className="p-2 text-right w-28">Đơn giá</th>
                  <th className="p-2 text-right w-28">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2">{item.product_name || item.product_id?.slice(0, 8)}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="p-2 text-right font-medium">
                      {formatCurrency(item.total_price || item.quantity * item.unit_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-gray-800 pt-4">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>0đ</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold text-lg">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 text-sm">
              <p><span className="text-gray-500">Phương thức thanh toán:</span> <span className="font-medium">{getPaymentMethodText(order.payment_method)}</span></p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-gray-500 text-xs">
              <p>Cảm ơn quý khách đã mua hàng tại Eye Plus!</p>
              <p>Mọi thắc mắc xin liên hệ: nhubaoanh111@gmail.com | Hotline: 0966469703</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 font-medium flex items-center gap-2"
          >
            <X size={18} /> Đóng
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Printer size={18} /> In
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Download size={18} /> Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
};
