# PDF Renderer - Tạo Phiếu Thu Chuyên Nghiệp

Ứng dụng web tạo phiếu thu (receipt) chuyên nghiệp với khả năng xuất PDF và mã QR chuyển khoản tự động.

## ✨ Tính năng nổi bật

- 📄 **Tạo phiếu thu nhanh chóng**: Nhập thông tin khách hàng và tự động tạo phiếu thu chuyên nghiệp
- 📥 **Xuất PDF dễ dàng**: Export phiếu thu ra file PDF với chất lượng cao, sẵn sàng in ấn
- 📱 **QR Code tự động**: Tự động tạo mã QR chuyển khoản với đầy đủ thông tin thanh toán
- ✨ **Giao diện hiện đại**: Thiết kế đẹp mắt, dễ sử dụng, hỗ trợ dark mode
- 🔧 **Tùy chỉnh linh hoạt**: Hỗ trợ các loại phí khác nhau (gốc, lãi, phí quản lý, phí tất toán, phí chậm trả)

## 🚀 Cách sử dụng

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Chạy server phát triển

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem ứng dụng.

### Build cho production

```bash
npm run build
npm run start
```

## 🛠️ Công nghệ sử dụng

- **[Next.js 15](https://nextjs.org/)** - Framework React với App Router
- **[HeroUI v2](https://heroui.com/)** - Thư viện UI components hiện đại
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript với type safety
- **[Framer Motion](https://www.framer.com/motion/)** - Thư viện animation
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Quản lý dark/light mode
- **[Tailwind Variants](https://tailwind-variants.org)** - Utility cho styling variants

## 📁 Cấu trúc dự án

```
├── app/                    # Next.js App Router
│   ├── (app)/             # Route groups
│   ├── api/               # API routes
│   └── pdf/               # PDF generation pages
├── components/            # React components
│   ├── export-pdf-button.tsx  # PDF export component
│   ├── receipt-content.tsx    # Receipt template
│   └── navbar.tsx             # Navigation
├── config/                # Configuration files
├── styles/                # CSS styles
├── types/                 # TypeScript types
└── utils/                 # Utility functions
```

## 📋 Các bước tạo phiếu thu

1. **Nhập thông tin**: Điền đầy đủ thông tin khách hàng, số tiền và các khoản phí
2. **Xem trước**: Kiểm tra phiếu thu trước khi xuất PDF, đảm bảo thông tin chính xác
3. **Xuất PDF**: Tải xuống file PDF chất lượng cao, sẵn sàng in ấn hoặc gửi email

## 🔧 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra và sửa lỗi code

## 📄 License

Licensed under the [MIT license](LICENSE).
