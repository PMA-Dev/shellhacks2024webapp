import { expect, test } from '@playwright/test';
import { startServerAndOpenPage } from './checkGeneratedPage.support';

test('start server and check generated page', async ({ page }) => {
    await startServerAndOpenPage({ page }, test, expect);
});
