import { test } from '@playwright/test';
import { createPageForProject } from './createPageForProject.support';

test('Create page for project', async ({ page }) => {
    await createPageForProject({ page }, test);
});
