import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  expect: { timeout: 5000 },
  reporter: 'list',
  webServer: {
    command: 'PORT=3002 npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:3002' },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
