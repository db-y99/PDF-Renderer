'use client';

import { ExportPdfButton } from '@/components/export-pdf-button';
import { ReceiptContent } from '@/components/receipt-content';
import { Input, Textarea } from '@heroui/input';
import { DatePicker } from '@heroui/date-picker';
import { Checkbox } from '@heroui/checkbox';
import { useState } from 'react';
import { CalendarDate } from '@internationalized/date';
import { formatCurrency, parseCurrency } from '@/utils/functions';

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

// Default values for numeric fields (as formatted strings)
const INITIAL_VALUES = {
  date: null,
  customerName: '',
  customerCode: '',
  contractCode: '',
  address: '',
  totalAmount: '',
  principal: '',
  interest: '',
  managementFee: '',
  settlementFee: '',
  lateFee: '',
  description: '',
  isSettlement: true,
};

export default function PdfPage() {
  const [formData, setFormData] = useState<ReceiptData>(INITIAL_VALUES);

  const handleInputChange = (field: keyof ReceiptData, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Chỉ tự động tính tổng tiền nếu không phải là trường totalAmount
      // Nếu là totalAmount, giữ nguyên giá trị người dùng nhập
      if (field !== 'totalAmount') {
        const principal = parseCurrency(newData.principal || '0');
        const interest = parseCurrency(newData.interest || '0');
        const managementFee = parseCurrency(newData.managementFee || '0');
        const settlementFee = parseCurrency(newData.settlementFee || '0');
        const lateFee = parseCurrency(newData.lateFee || '0');

        const total = principal + interest + managementFee + settlementFee + lateFee;

        // Chỉ tự động tính nếu có ít nhất một khoản phí được nhập
        if (total > 0) {
          newData.totalAmount = formatCurrency(total);
        } else if (principal === 0 && interest === 0 && managementFee === 0 && settlementFee === 0 && lateFee === 0) {
          // Nếu tất cả các khoản phí đều = 0, giữ nguyên totalAmount (có thể người dùng đã nhập trực tiếp)
          // Chỉ xóa nếu totalAmount cũng rỗng
          if (!prev.totalAmount) {
            newData.totalAmount = '';
          }
        }
      }

      return newData;
    });
  };

  // Hàm format số khi người dùng nhập các khoản phí chi tiết
  const handleNumericInputChange = (field: keyof ReceiptData, value: string) => {
    // Chỉ cho phép số
    const numericValue = value.replace(/[^0-9]/g, '');

    // Nếu có giá trị số, format với dấu chấm
    const formattedValue = numericValue ? formatCurrency(parseInt(numericValue)) : '';

    // Cập nhật trực tiếp để tránh vòng lặp
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: formattedValue
      };

      // Tự động tính tổng tiền từ các khoản phí chi tiết
      const principal = parseCurrency(newData.principal || '0');
      const interest = parseCurrency(newData.interest || '0');
      const managementFee = parseCurrency(newData.managementFee || '0');
      const settlementFee = parseCurrency(newData.settlementFee || '0');
      const lateFee = parseCurrency(newData.lateFee || '0');

      const total = principal + interest + managementFee + settlementFee + lateFee;

      // Chỉ tự động tính nếu có ít nhất một khoản phí được nhập
      if (total > 0) {
        newData.totalAmount = formatCurrency(total);
      } else {
        // Nếu tất cả = 0, giữ nguyên totalAmount (có thể người dùng đã nhập trực tiếp)
        if (!prev.totalAmount) {
          newData.totalAmount = '';
        }
      }

      return newData;
    });
  };

  // Hàm xử lý khi nhập Tổng tiền trực tiếp (không tính từ các khoản phí)
  const handleTotalAmountChange = (value: string) => {
    // Chỉ cho phép số
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format với dấu chấm
    const formattedValue = numericValue ? formatCurrency(parseInt(numericValue)) : '';

    setFormData(prev => ({
      ...prev,
      totalAmount: formattedValue
    }));
  };

  const handleDateChange = (date: CalendarDate | null) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  // Format date to display format
  const formatDate = (date: CalendarDate | null) => {
    if (!date) return '';
    return `Ngày ${date.day} tháng ${date.month} năm ${date.year}`;
  };

  return (
    <div className='w-full max-w-[1600px] mx-auto py-4 px-4 md:px-6 lg:px-8'>
      {/* Button xuất PDF - ẩn khi in */}
      <div className="mb-4 md:mb-6 flex justify-end gap-2 print:hidden">
        <ExportPdfButton contentOnly={true} data={formData} />
      </div>
      <div className='flex flex-col lg:flex-row gap-4 lg:gap-6'>

        {/* Form nhập liệu */}
        <div className="w-full lg:w-2/5 xl:w-2/5 mb-6 lg:mb-0 p-4 md:p-6 bg-content1 border border-default-200 rounded-lg shadow-sm print:hidden">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">Thông tin phiếu thu</h3>
            <Checkbox
              isSelected={formData.isSettlement}
              onValueChange={(checked) => setFormData(prev => ({ ...prev, isSettlement: checked }))}
              size="sm"
            >
              <span className="text-sm">Phiếu tất toán</span>
            </Checkbox>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <DatePicker
              label="Thời hạn"
              value={formData.date}
              onChange={handleDateChange}
              className="w-full"
            />
            <Input
              label="Họ tên khách hàng"
              value={formData.customerName}
              onValueChange={(value) => handleInputChange('customerName', value)}
            />
            <Input
              label="Mã khách hàng"
              value={formData.customerCode}
              onValueChange={(value) => handleInputChange('customerCode', value)}
            />
            <Input
              label="Mã số hợp đồng"
              value={formData.contractCode}
              onValueChange={(value) => handleInputChange('contractCode', value)}
            />
            <Input
              label="Địa chỉ"
              value={formData.address}
              onValueChange={(value) => handleInputChange('address', value)}
              className="md:col-span-2"
            />
            <Input
              label="Gốc"
              value={formData.principal}
              onValueChange={(value) => handleNumericInputChange('principal', value)}
            />
            <Input
              label="Lãi"
              value={formData.interest}
              onValueChange={(value) => handleNumericInputChange('interest', value)}
            />
            <Input
              label="Phí QL"
              value={formData.managementFee}
              onValueChange={(value) => handleNumericInputChange('managementFee', value)}
            />
            <Input
              label="Phí tất toán"
              value={formData.settlementFee}
              onValueChange={(value) => handleNumericInputChange('settlementFee', value)}
            />
            <Input
              label="Phí phạt quá hạn"
              value={formData.lateFee}
              onValueChange={(value) => handleNumericInputChange('lateFee', value)}
            />
            <Input
              label="Tổng tiền cần thanh toán"
              value={formData.totalAmount}
              onValueChange={handleTotalAmountChange}
            />
            <Textarea
              label="Mô tả chuyển khoản"
              value={formData.description}
              onValueChange={(value) => handleInputChange('description', value)}
              placeholder="VD: Thanh toán hợp đồng AP0810251526"
              className="md:col-span-2"
            />

          </div>
        </div>

        {/* Nội dung phiếu thu */}
        <div className='w-full lg:w-3/5 xl:w-3/5 border-2 border-blue-600 rounded-lg p-4 md:p-6 overflow-x-auto'>
          <ReceiptContent data={{
            ...formData,
            date: formatDate(formData.date)
          }} />
        </div>
      </div>
    </div>
  );
}

