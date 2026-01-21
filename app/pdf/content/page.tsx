'use client';

import { ReceiptContent } from '@/components/receipt-content';
import { useState, useEffect } from 'react';

interface ReceiptData {
  date?: string;
  customerName?: string;
  customerCode?: string;
  contractCode?: string;
  address?: string;
  totalAmount?: string;
  principal?: string;
  interest?: string;
  managementFee?: string;
  settlementFee?: string;
  lateFee?: string;
  description?: string;
  isSettlement?: boolean;
}

export default function PdfContentPage() {
  const [data, setData] = useState<ReceiptData | undefined>(undefined);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage sau khi component mount
    const stored = localStorage.getItem('receiptData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } catch (error) {
        console.error('Failed to parse receipt data:', error);
      }
    }
  }, []);

  return <ReceiptContent data={data} />;
}
