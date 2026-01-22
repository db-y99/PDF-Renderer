import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET(request: NextRequest) {
  let browser;
  try {
    // Use request URL to construct proper base URL for production
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const targetUrl = `${baseUrl}/pdf`;

    // Khởi tạo trình duyệt với options tối ưu cho production
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-web-security', // Cho phép cross-origin trong production
        '--allow-running-insecure-content',
        '--memory-pressure-off', // Giảm memory usage
        '--max_old_space_size=4096' // Tăng memory limit
      ],
    });

    const page = await browser.newPage();

    // Navigate với timeout phù hợp cho production
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });

    // Đợi QR code load xong - phần quan trọng nhất
    try {
      await page.waitForSelector('img[alt="Mã QR chuyển khoản"]', {
        timeout: 30000,
      });
      
      // Đợi image QR code load hoàn toàn
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = resolve; // Resolve cả khi error để không block
              // Timeout sau 10s
              setTimeout(resolve, 10000);
            });
          })
        );
      });
      
      // Đợi thêm một chút để đảm bảo QR code render xong
      await page.waitForTimeout(1000);
    } catch (error) {
      console.warn('QR code may not be loaded:', error);
      // Đợi một chút rồi tiếp tục
      await page.waitForTimeout(1000);
    }

    // Xuất PDF với margin hợp lý - margin 2 bên nhỏ hơn
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });

    await browser.close();

    // Trả về file PDF với CORS headers
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="phieu-thu-tien-tat-toan.pdf"',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

