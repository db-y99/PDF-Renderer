import { NextRequest, NextResponse } from 'next/server';
import { launchChromium, isBrowserInstallationError } from '@/utils/playwright-config';

// Helper function to get receipt data from request
async function getReceiptData(request: NextRequest): Promise<string | null> {
  // Try to get from POST body first (preferred method)
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      if (body && typeof body === 'object') {
        return JSON.stringify(body);
      }
    } catch (error) {
      // If body parsing fails, fall back to query params
      console.warn('Failed to parse POST body, falling back to query params:', error);
    }
  }

  // Fall back to query params for GET requests or if POST body parsing fails
  const searchParams = request.nextUrl.searchParams;
  return searchParams.get('data');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  let browser;
  let page;
  try {
    // Use request URL to construct proper base URL for production
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const targetUrl = `${baseUrl}/pdf/content`;

    // Khởi tạo trình duyệt với options tối ưu cho production
    browser = await launchChromium();
    page = await browser.newPage();

    // Lấy dữ liệu từ request (POST body hoặc query params)
    const receiptData = await getReceiptData(request);

    // Navigate đến trang trước
    await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });

    // Nếu có data, set vào localStorage sau khi page đã load
    if (receiptData) {
      try {
        // Xử lý data: nếu từ query params thì cần decode, nếu từ POST body thì đã là JSON string
        let dataToStore = receiptData;
        
        // Thử parse JSON để kiểm tra xem có phải là JSON string hợp lệ không
        try {
          JSON.parse(receiptData);
          // Nếu parse được, có nghĩa là đã là JSON string (từ POST body)
          dataToStore = receiptData;
        } catch {
          // Nếu parse không được, có thể là từ query params (đã được encode)
          try {
            dataToStore = decodeURIComponent(receiptData);
            // Kiểm tra lại xem sau khi decode có phải là JSON hợp lệ không
            JSON.parse(dataToStore);
          } catch {
            // Nếu vẫn không được, giữ nguyên
            dataToStore = receiptData;
          }
        }
        
        await page.evaluate((data) => {
          localStorage.setItem('receiptData', data);
        }, dataToStore);
        
        // Reload page để React đọc lại localStorage
        await page.reload({
          waitUntil: 'networkidle',
          timeout: 45000,
        });
        
        // Đợi React render xong - đợi một element trong ReceiptContent xuất hiện
        await page.waitForTimeout(500);
      } catch (error) {
        console.warn('Failed to set receipt data:', error);
        // Continue even if setting data fails
      }
    }

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

    // Ẩn navbar và các element không cần thiết trước khi export PDF
    await page.evaluate(() => {
      // Ẩn navbar
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = 'none';
      }
      
      // Ẩn tất cả element có class print:hidden
      const hiddenElements = document.querySelectorAll('[class*="print:hidden"]');
      hiddenElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    });

    // Xuất PDF chỉ với ReceiptContent - margin nhỏ hơn
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '5mm',
        right: '5mm',
        bottom: '5mm',
        left: '5mm',
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
    // Clean up resources
    try {
      if (page) {
        await page.close().catch(() => {});
      }
    } catch (pageError) {
      // Ignore cleanup errors
    }
    
    try {
      if (browser) {
        await browser.close().catch(() => {});
      }
    } catch (browserError) {
      // Ignore cleanup errors
    }
    
    console.error('Error generating PDF:', error);
    
    // Check if it's a browser installation error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (isBrowserInstallationError(error)) {
      return NextResponse.json(
        { 
          error: 'Playwright browsers not installed',
          details: 'Please ensure Playwright browsers are installed. Run: npx playwright install chromium',
          message: errorMessage
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMessage },
      { status: 500 }
    );
  }
}
