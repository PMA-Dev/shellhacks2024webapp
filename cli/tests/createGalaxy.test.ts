import { expect, test } from '@playwright/test';
import { createTempDir } from './util';

test('has Galactic title', async ({ page }) => {
    await checkGalacticHomepage({ page });
});

export const checkGalacticHomepage = async ({ page }: any) => {
    await test.step('has Galactic homepage data', async () => {
        await page.goto('http://localhost:5173');

        // expect text to contain galactic
        const textExists = await page
            .locator('text=Welcome to GALACTIC')
            .isVisible();
        expect(textExists).toBe(true);
    });
};

test('fills out the form and clicks Get Started', async ({ page }) => {
    await fillOutGalacticFormAndSubmit({ page });
});

export const fillOutGalacticFormAndSubmit = async ({ page }: any) => {
    await checkGalacticHomepage({ page });
    await test.step('Fill out the form and submit', async () => {
        await page.goto('http://localhost:5173');
        await page.fill('#githubPat', 'your-github-pat-here');

        const tempPath = createTempDir();
        console.log(`tempPath: ${tempPath}`);
        await page.fill('#workingDir', tempPath);

        await page.click('text=Get Started');

        await expect(page).toHaveURL(/dashboard/);
    });
};
