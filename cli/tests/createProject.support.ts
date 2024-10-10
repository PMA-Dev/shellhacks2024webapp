import { expect } from '@playwright/test';
import { fillOutGalacticFormAndSubmit } from './createGalaxy.support';

export const checkNoProjectPage = async ({ page }: any, test: any) => {
    await fillOutGalacticFormAndSubmit({ page }, test);
    await test.step('Check for dashboard title and no projects', async () => {
        await page.goto('http://localhost:5173/dashboard');

        expect(await page.locator('text=Dashboard').isVisible()).toBe(true);

        expect(
            await page
                .locator("text=You don't have any projects yet.")
                .isVisible()
        ).toBe(true);

        expect(
            await page.locator('text=Create New Project').first().isVisible()
        ).toBe(true);
    });
};

export const createFirstProject = async ({ page }: any, test: any) => {
    await checkNoProjectPage({ page }, test);
    await test.step('Create first project', async () => {
        await page.goto('http://localhost:5173/dashboard');

        await page.click('text=Create New Project');

        expect(await page.locator('text=New Project').first().isVisible()).toBe(
            true
        );
        expect(
            await page
                .locator('text=Enter a name for your new project.')
                .first()
                .isVisible()
        ).toBe(true);

        await page.fill('#projectName', 'test-project');

        await page.click('text=Create Project');
        await page.waitForTimeout(500);

        const spinner = page.locator('#submit-project-spinner');
        await expect(spinner).toBeVisible({ timeout: 10000 });

        await expect(spinner).toBeHidden({ timeout: 10000 });

        await page.locator('text=test-project').isVisible({ timeout: 10000 });
        expect(
            await page
                .locator("text=You don't have any projects yet.")
                .isVisible()
        ).toBe(false);
    });
};