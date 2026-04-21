import { defineConfig, devices } from '@playwright/test'

const isWatch = process.env.HEADED === '1'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: isWatch ? 'list' : 'html',

  use: {
    baseURL: 'http://localhost:5174',
    headless: !isWatch,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo: isWatch ? 700 : 0,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm run e2e:frontend',
      url: 'http://localhost:5174',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run e2e:backend',
      url: 'http://localhost:3002/api/folders',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
