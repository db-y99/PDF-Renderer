import { chromium, Browser } from 'playwright';
import { existsSync } from 'fs';
import { join } from 'path';

// Helper function to find Chromium executable
function findChromiumExecutable(): string | undefined {
  const possiblePaths = [
    // Playwright default locations
    join(process.cwd(), 'node_modules', '@playwright', 'browser-chromium', 'chromium-headless_shell', 'chrome-headless-shell-linux64', 'chrome-headless-shell'),
    // System locations
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ];

  // Check environment variable
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    if (existsSync(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)) {
      return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    }
  }

  // Try to find in common locations
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return undefined;
}

export async function launchChromium(): Promise<Browser> {
  const executablePath = findChromiumExecutable();
  
  const launchOptions: any = {
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
    ],
  };

  // Add executable path if found
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  return await chromium.launch(launchOptions);
}

export function isBrowserInstallationError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage.includes('Executable doesn\'t exist') || 
         errorMessage.includes('browserType.launch') ||
         errorMessage.includes('Please run the following command');
}

