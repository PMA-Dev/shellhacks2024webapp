import { expect, test } from '@playwright/test';
import { checkDefaultProjectPage } from './projectDashboard.support';

test('Dashboard for project renders', async ({ page }) => {
    await checkDefaultProjectPage({ page }, test, expect);
});
