import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests', // Directory for test files
    use: {
        headless: true, // Run tests in headless mode
        baseURL: 'http://127.0.0.1:5173',
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
});
