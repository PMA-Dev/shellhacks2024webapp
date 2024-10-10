// @ts-ignore: Binding element 'page' implicitly has an 'any' type
import { expect, test } from '@playwright/test';
import { fillOutGalacticFormAndSubmit } from './createGalaxy.test';

test('Project onboarding flow', async ({ page }) => {
    await checkNoProjectPage({ page });
});

export const checkNoProjectPage = async ({ page }: any) => {
    await fillOutGalacticFormAndSubmit({ page });
    await test.step('Check for dashboard title and no projects', async () => {
        await page.goto('http://localhost:5173/dashboard');

        expect(await page.locator('text=Dashboard').isVisible()).toBe(true);

        expect(
            await page
                .locator("text=You don't have any projects yet.")
                .isVisible()
        ).toBe(true);

        expect(
            await page.locator('text=Create Your First Project').isVisible()
        ).toBe(true);
    });
};

test('Create first project', async ({ page }) => {
    await createFirstProject({ page });
});

export const createFirstProject = async ({ page }: any) => {
    await checkNoProjectPage({ page });
    await test.step('Create first project', async () => {
        await page.goto('http://localhost:5173/dashboard');

        await page.click('text=Create Your First Project');

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
    });
};
