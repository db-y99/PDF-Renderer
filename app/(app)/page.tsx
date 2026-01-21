import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";

export default function Home() {
    const features = [
        {
            title: "Tạo phiếu thu nhanh chóng",
            description: "Nhập thông tin khách hàng và tự động tạo phiếu thu chuyên nghiệp",
            icon: "📄",
        },
        {
            title: "Xuất PDF dễ dàng",
            description: "Export phiếu thu ra file PDF với chất lượng cao, sẵn sàng in ấn",
            icon: "📥",
        },
        {
            title: "QR Code tự động",
            description: "Tự động tạo mã QR chuyển khoản với đầy đủ thông tin thanh toán",
            icon: "📱",
        },
        {
            title: "Giao diện hiện đại",
            description: "Thiết kế đẹp mắt, dễ sử dụng, hỗ trợ dark mode",
            icon: "✨",
        },
    ];

    return (
        <div className="flex flex-col gap-12 py-8 md:py-12">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="inline-block max-w-4xl">
                    <h1 className={title({ size: "lg" })}>
                        {siteConfig.name}
                    </h1>
                </div>
                <p className={subtitle({ class: "mt-4" })}>
                    {siteConfig.description}
                </p>
                <div className="flex gap-4 mt-4">
                    <Button
                        as={NextLink}
                        href="/pdf"
                        color="primary"
                        size="lg"
                        className="text-lg px-8"
                    >
                        Bắt đầu ngay
                    </Button>
                    <Button
                        as={NextLink}
                        href="/sponsor"
                        variant="bordered"
                        size="lg"
                        className="text-lg px-8"
                    >
                        Ủng hộ dự án
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="flex flex-col gap-8">
                <div className="text-center">
                    <h2 className={title({ size: "md" })}>
                        Tính năng{" "}
                        <span className={title({ color: "violet", size: "md" })}>
                            nổi bật
                        </span>
                    </h2>
                    <p className={subtitle({ class: "mt-2" })}>
                        Tất cả những gì bạn cần để tạo phiếu thu chuyên nghiệp
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="h-full">
                            <CardBody className="flex flex-col items-center text-center gap-4 p-6">
                                <div className="text-5xl">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-default-600 text-sm">{feature.description}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How it works Section */}
            <section className="flex flex-col gap-8 bg-content1 rounded-2xl p-8 md:p-12">
                <div className="text-center">
                    <h2 className={title({ size: "md" })}>
                        Cách sử dụng{" "}
                        <span className={title({ color: "green", size: "md" })}>
                            đơn giản
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                            1
                        </div>
                        <h3 className="text-lg font-semibold">Nhập thông tin</h3>
                        <p className="text-default-600 text-sm">
                            Điền đầy đủ thông tin khách hàng, số tiền và các khoản phí
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                            2
                        </div>
                        <h3 className="text-lg font-semibold">Xem trước</h3>
                        <p className="text-default-600 text-sm">
                            Kiểm tra phiếu thu trước khi xuất PDF, đảm bảo thông tin chính xác
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                            3
                        </div>
                        <h3 className="text-lg font-semibold">Xuất PDF</h3>
                        <p className="text-default-600 text-sm">
                            Tải xuống file PDF chất lượng cao, sẵn sàng in ấn hoặc gửi email
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="flex flex-col items-center justify-center gap-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12">
                <h2 className={title({ size: "md" })}>
                    Sẵn sàng bắt đầu?
                </h2>
                <p className={subtitle({ class: "max-w-2xl" })}>
                    Tạo phiếu thu chuyên nghiệp ngay bây giờ, hoàn toàn miễn phí và không cần đăng ký
                </p>
                <Button
                    as={NextLink}
                    href="/pdf"
                    color="primary"
                    size="lg"
                    className="text-lg px-12"
                >
                    Tạo phiếu thu ngay
                </Button>
            </section>
        </div>
    );
}

