import { createTempDir } from './util';
export const checkGalacticHomepage = async ({ page }: any, test: any, expect: any) => {
    await test.step('has Galactic homepage data', async () => {
        await page.goto('http://localhost:5173');

        // expect text to contain galactic
        const textExists = await page
            .locator('text=Welcome to GALACTIC')
            .isVisible();
        expect(textExists).toBe(true);
    });
};

export const fillOutGalacticFormAndSubmit = async ( { page }: any, test: any, expect: any) => {
    await checkGalacticHomepage({ page }, test, expect);
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
