import { formatCurrency, parseCurrency } from "@/utils/functions";

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

interface ReceiptContentProps {
  data?: ReceiptData;
}

export function ReceiptContent({ data }: ReceiptContentProps) {
  return (
    <div className="p-10 print:px-2 print:py-5 bg-white text-black" style={{ fontFamily: 'Times New Roman' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2 text-black">DOANH NGHIỆP TƯ NHÂN Y99</h1>
          <p className="text-base font-semibold text-black">99B Nguyễn Trãi, phường Ninh Kiều, Cần Thơ</p>
        </div>
        <div>
          <img src="/logo.png" alt="logo" className="w-full h-16" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-4 text-black">
        {data?.isSettlement !== false ? 'PHIẾU THU TIỀN TẤT TOÁN' : 'PHIẾU THU TIỀN'}
      </h2>
      <p className="text-center text-base mb-8 text-black">Thời hạn: {data?.date}</p>

      {/* Thông tin khách hàng */}
      <div className="mb-4 flex flex-col gap-4">
        <div>
          <span className="text-black">Họ tên khách hàng: </span>
          <span className="font-medium text-black">{data?.customerName}</span>
        </div>
        <div>
          <span className="text-black">Mã khách hàng: </span>
          <span className="font-medium text-black">{data?.customerCode}</span>
        </div>
        <div>
          <span className="text-black">Mã số hợp đồng: </span>
          <span className="font-medium text-black">{data?.contractCode}</span>
        </div>
        <div>
          <span className="text-black">Địa chỉ: </span>
          <span className="font-medium text-black">{data?.address}</span>
        </div>
      </div>

      {/* Chi tiết thanh toán */}
      <div className="mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold text-black">
            <span className="text-red-500 ">Tổng tiền cần thanh toán:</span>
            <span>{data?.totalAmount} VND</span>
          </div>
          {
            data?.principal && (
              <div className="flex items-center gap-2 text-black">
                <span className="mx-4">-</span>
                <span>Gốc:</span>
                <span className="font-medium">{formatCurrency(parseCurrency(data?.principal || '0'))} VNĐ</span>
              </div>
            )
          }
          {
            data?.interest && (
              <div className="flex items-center gap-2 text-black">
                <span className="mx-4">-</span>
                <span>Lãi:</span>
                <span className="font-medium">{formatCurrency(parseCurrency(data?.interest || '0'))} VNĐ</span>
              </div>
            )
          }

          {
            data?.managementFee && (
              <div className="flex items-center gap-2 text-black">
                <span className="mx-4">-</span>
                <span>Phí QL:</span>
                <span className="font-medium">{formatCurrency(parseCurrency(data?.managementFee || '0'))} VNĐ</span>
              </div>
            )
          }

          {
            data?.settlementFee && (
              <div className="flex items-center gap-2 text-black">
                <span className="mx-4">-</span>
                <span>Phí tất toán:</span>
                <span className="font-medium">{formatCurrency(parseCurrency(data?.settlementFee || '0'))} VNĐ</span>
              </div>
            )
          }
          {
            data?.lateFee && (
              <div className="flex items-center gap-2 text-black">
                <span className="mx-4">-</span>
                <span>Phí phạt quá hạn:</span>
                <span className="font-medium">{formatCurrency(parseCurrency(data?.lateFee || '0'))} VNĐ</span>
              </div>
            )
          }

        </div>
      </div>

      {/* Thông tin tài khoản */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-4 text-black">Nộp tiền vào tài khoản sau:</h3>
        <div className="space-y-2">
          <div className="text-black font-bold">
            <span className="mx-4">-</span>
            <span>Tên ngân hàng: </span>
            <span>Vietcombank</span>
          </div>
          <div className="text-black font-bold">
            <span className="mx-4">-</span>
            <span>Tên chủ tài khoản: </span>
            <span>DOANH NGHIEP TU NHAN Y99</span>
          </div>
          <div className="text-black font-bold">
            <span className="mx-4">-</span>
            <span>Số tài khoản: </span>
            <span>1058526128</span>
          </div>
        </div>
      </div>

      {/* Lưu ý */}
      <div className="space-y-2 mb-4">
        <div className="space-y-1 text-black">
          <div>Quý khách hàng khi chuyển khoản vui lòng chuyển khoản theo mã QR phía dưới và không chỉnh sửa số tiền và nội dung!</div>
          <div>Y99 sẽ không hoàn lại khoản tiền đã đóng với bất kỳ lý do gì. Quý khách vui lòng kiểm tra đầy đủ thông tin số tiền và nội dung chuyển khoản. Mọi chi tiết xin liên hệ Bộ phận Chăm sóc khách hàng giải đáp thắc mắc</div>
        </div>
        <div className="pt-2">
          <p className="text-black">
            <span className="font-semibold">Hotline:</span> 1900575792 | +84 292 38 999 33 (Nước ngoài)
          </p>

        </div>
      </div>

      {/* QR Code - Customized */}
      <div className="flex justify-center items-center my-2">
        {/* QR Code Image */}
        <div className="flex justify-center mb-4 border-2 border-blue-600 rounded-lg p-6">
          <img
            src={`https://qr.sepay.vn/img?acc=1058526128&bank=VCB&amount=${parseCurrency(data?.totalAmount || '0')}&des=${encodeURIComponent(data?.description || '')}&template=compact&download=0`}
            alt="Mã QR chuyển khoản"
            className="w-64 h-64 print:w-56 print:h-56"
          />
        </div>

      </div>
    </div>
  );
}

