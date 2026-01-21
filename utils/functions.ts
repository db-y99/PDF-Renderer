/**
 * Format số tiền theo định dạng Việt Nam (VD: 1000000 -> 1.000.000)
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Parse chuỗi số có dấu chấm thành số (VD: "1.000.000" -> 1000000)
 */
export function parseCurrency(value: string): number {
  // Loại bỏ tất cả dấu chấm và parse thành số
  const cleanValue = value.replace(/\./g, '');
  return parseFloat(cleanValue) || 0;
}
