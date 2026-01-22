'use client';

import { Button } from '@heroui/button';
import { useState } from 'react';
import { CalendarDate } from '@internationalized/date';

interface ReceiptData {
  date: CalendarDate | null;
  customerName: string;
  customerCode: string;
  contractCode: string;
  address: string;
  totalAmount: string;
  principal: string;
  interest: string;
  managementFee: string;
  settlementFee: string;
  lateFee: string;
  description: string;
  isSettlement: boolean;
}

interface ExportPdfButtonProps {
  contentOnly?: boolean;
  data?: ReceiptData;
}

export function ExportPdfButton({ contentOnly = false, data }: ExportPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPdf = async () => {
    setIsLoading(true);
    try {
      // Chọn API endpoint dựa trên contentOnly
      const apiEndpoint = contentOnly ? '/api/pdf/content' : '/api/pdf';

      // Format data để gửi
      const formatDate = (date: CalendarDate | null) => {
        if (!date) return '';
        return `Ngày ${date.day} tháng ${date.month} năm ${date.year}`;
      };

      const dataToSend = {
        ...data,
        date: formatDate(data?.date || null),
        isSettlement: data?.isSettlement !== undefined ? data.isSettlement : true
      };

      // Gọi API để xuất PDF - sử dụng POST với JSON body (tiện lợi hơn query params)
      const response = await fetch(apiEndpoint, {
        method: contentOnly ? 'POST' : 'GET', // POST cho content, GET cho full page
        headers: {
          'Content-Type': 'application/json',
        },
        body: contentOnly ? JSON.stringify(dataToSend) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Tạo blob từ response
      const blob = await response.blob();

      // Tạo URL tạm thời và download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phieu-thu-tien-tat-toan.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(`Có lỗi xảy ra khi xuất PDF: ${error instanceof Error ? error.message : 'Vui lòng thử lại.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color="primary"
      onPress={handleExportPdf}
      isLoading={isLoading}
      className="print:hidden"
    >
      {isLoading ? 'Đang xuất PDF...' : contentOnly ? 'Xuất PDF (Nội dung)' : 'Xuất PDF (Toàn trang)'}
    </Button>
  );
}

