import { defineConfig, devices } from '@playwright/test'

const isHeaded = process.env.HEADED === '1'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: isHeaded ? 'list' : 'html',

  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isHeaded ? 'off' : 'retain-on-failure',
    launchOptions: {
      slowMo: isHeaded ? 600 : 0,
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
      timeout: 60_000,
    },
    {
      command: 'npm run e2e:backend',
      url: 'http://localhost:3002/api',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
})
