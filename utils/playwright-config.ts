import { chromium, Browser } from 'playwright';
import { existsSync } from 'fs';
import { join } from 'path';

// Helper function to find Chromium executable
function findChromiumExecutable(): string | undefined {
  // Check environment variable first
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    if (existsSync(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)) {
      return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    }
  }

  // Playwright default locations (Vercel/serverless)
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  const possiblePaths: string[] = [];

  if (homeDir) {
    // Try common Playwright cache locations
    const cacheDir = join(homeDir, '.cache', 'ms-playwright');
    if (existsSync(cacheDir)) {
      // Try to find chromium_headless_shell directories
      try {
        const { readdirSync } = require('fs');
        const dirs = readdirSync(cacheDir);
        for (const dir of dirs) {
          if (dir.startsWith('chromium_headless_shell-')) {
            const shellPath = join(cacheDir, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
            if (existsSync(shellPath)) {
              return shellPath;
            }
          }
          if (dir.startsWith('chromium-')) {
            const chromePath = join(cacheDir, dir, 'chrome-linux', 'chrome');
            if (existsSync(chromePath)) {
              return chromePath;
            }
          }
        }
      } catch {
        // If readdir fails, continue
      }
    }
  }

  // Playwright in node_modules (local development)
  const nodeModulesPath = join(process.cwd(), 'node_modules', 'playwright', '.local-browsers');
  if (existsSync(nodeModulesPath)) {
    try {
      const { readdirSync } = require('fs');
      const dirs = readdirSync(nodeModulesPath);
      for (const dir of dirs) {
        if (dir.startsWith('chromium_headless_shell-')) {
          const shellPath = join(nodeModulesPath, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
          if (existsSync(shellPath)) {
            return shellPath;
          }
        }
        if (dir.startsWith('chromium-')) {
          const chromePath = join(nodeModulesPath, dir, 'chrome-linux', 'chrome');
          if (existsSync(chromePath)) {
            return chromePath;
          }
        }
      }
    } catch {
      // If readdir fails, continue
    }
  }

  // Try @playwright/browser-chromium package
  const browserChromiumPath = join(process.cwd(), 'node_modules', '@playwright', 'browser-chromium', 'chromium-headless_shell', 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  if (existsSync(browserChromiumPath)) {
    return browserChromiumPath;
  }

  // System locations (fallback)
  const systemPaths = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ];

  for (const path of systemPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return undefined;
}

export async function launchChromium(): Promise<Browser> {
  // Try to find executable path, but let Playwright auto-detect if not found
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
      // Only use --single-process in serverless environments (not local)
      ...(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? ['--single-process'] : []),
    ],
  };

  // Only add executable path if explicitly found
  // Otherwise, let Playwright use its default detection
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  try {
    return await chromium.launch(launchOptions);
  } catch (error) {
    // If launch fails and we didn't specify executablePath, try without it
    // Playwright might have it in a different location
    if (!executablePath) {
      throw error;
    }
    
    console.warn('Browser launch with explicit path failed, retrying with auto-detect');
    
    // Retry without explicit executablePath to let Playwright auto-detect
    delete launchOptions.executablePath;
    return await chromium.launch(launchOptions);
  }
}

export function isBrowserInstallationError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage.includes('Executable doesn\'t exist') || 
         errorMessage.includes('browserType.launch') ||
         errorMessage.includes('Please run the following command');
}

