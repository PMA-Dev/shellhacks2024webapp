import { expect } from '@playwright/test';
import { createFirstProject } from './createProject.support';

export const checkDefaultProjectPage = async ({ page }: any, test: any) => {
    await createFirstProject({ page }, test);
    await test.step('Checks that default dashboard page renders', async () => {
        await page.goto('http://localhost:5173/dashboard');

        expect(await page.locator('text=Dashboard').isVisible()).toBe(true);
        const projectButton = page.locator('text=test-project');
        await projectButton.isVisible({ timeout: 10000 });
        await projectButton.click();

        expect(
            await page
                .locator('text=test-project')
                .isVisible({ timeout: 10000 })
        ).toBe(true);
        expect(await page.locator('text=Your Live Site').isVisible()).toBe(
            true
        );
    });
};
