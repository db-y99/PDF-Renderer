import { chromium, Browser } from 'playwright';

export async function launchChromium(): Promise<Browser> {
  return await chromium.launch({
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
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--memory-pressure-off',
      // Only use --single-process in serverless environments (not local)
      ...(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? ['--single-process'] : []),
    ],
  });
}

export function isBrowserInstallationError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage.includes('Executable doesn\'t exist') || 
         errorMessage.includes('browserType.launch') ||
         errorMessage.includes('Please run the following command');
}
