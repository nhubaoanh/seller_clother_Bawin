'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { dowExcelTemple } from '@/service/product.service';
export function ExcelTemplateButton() {
    const downloadTemplate = async () => {
        try {
            const blob = await dowExcelTemple();

            if (!blob) {
                throw new Error('Không thể tải file mẫu. Vui lòng thử lại sau.');
            }

            // Tạo URL tạm thời cho file
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Mau_nhap_du_lieu_thanh_vien.xlsx');
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Lỗi khi tải file mẫu:', error);
            alert('Có lỗi xảy ra khi tải file mẫu');
        }
    };

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-[#276749] text-white rounded shadow hover:bg-[#22543d] transition-all text-sm font-bold relative overflow-hidden"
            onClick={downloadTemplate}
        >
            <Download className="h-4 w-4" />
            Tải file mẫu
        </Button>
    );
}