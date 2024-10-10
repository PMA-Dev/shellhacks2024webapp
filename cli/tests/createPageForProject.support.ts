import { checkDefaultProjectPage } from './projectDashboard.support';

export const createPageForProject = async ({ page }: any, test: any, expect: any) => {
    await checkDefaultProjectPage({ page }, test, expect);

    await test.step('Checks that create page modal renders', async () => {
        expect(
            await page
                .locator('text=test-project')
                .isVisible({ timeout: 10000 })
        ).toBe(true);
        expect(await page.locator('text=Your Live Site').isVisible()).toBe(
            true
        );

        const pagesNav = page.getByRole('link', { name: 'Pages' });
        expect(await pagesNav.isVisible()).toBe(true);
        await pagesNav.click();

        expect(
            await page.locator('text=No pages created yet.').isVisible()
        ).toBe(true);

        const createPageButton = page.locator('text=Add New Page');
        expect(await createPageButton.isVisible()).toBe(true);
        await createPageButton.click();

        expect(await page.locator('text=Create New Page').isVisible()).toBe(
            true
        );
    });

    await test.step('Fill in new page details and create the page', async () => {
        await page.fill('#pageName', 'TestPage');

        await page.fill('#pageRoute', '/TestPage');

        await expect(page.locator('input[name="template"]')).toHaveCount(3);

        const templateRadio = page.locator('input[name="template"]').first();
        await templateRadio.click();

        const createPageButton = page.locator('text=Create Page');
        await expect(createPageButton).toBeEnabled();

        await createPageButton.click();

        await page.waitForTimeout(500);
        await expect(
            page.getByRole('heading', { name: 'TestPage' })
        ).toBeVisible();
    });

    await test.step('Verify new page appears in the list of pages', async () => {
        expect(
            await page.locator('text=No pages created yet.').isVisible()
        ).toBe(false);
        await expect(
            page.getByRole('heading', { name: 'TestPage' })
        ).toBeVisible();
    });

    await test.step('Create data entry page', async () => {
        const createPageButton = page.locator('text=Add New Page');
        expect(await createPageButton.isVisible()).toBe(true);
        await createPageButton.click();

        expect(await page.locator('text=Create New Page').isVisible()).toBe(
            true
        );
        await page.fill('#pageName', 'TestDataEntry');

        await page.fill('#pageRoute', '/TestDataEntry');

        const templateRadio = page.getByLabel('DataEntry');
        await templateRadio.click();

        const createPageButtonSubmit = page.locator('text=Create Page');
        await expect(createPageButtonSubmit).toBeEnabled();

        await createPageButtonSubmit.click();

        await page.waitForTimeout(500);
        await expect(
            page.getByRole('heading', { name: 'TestDataEntry' })
        ).toBeVisible();
    });

    await test.step('Verify new page appears in the list of pages', async () => {
        expect(
            await page.locator('text=No pages created yet.').isVisible()
        ).toBe(false);
        await expect(
            page.getByRole('heading', { name: 'TestDataEntry' })
        ).toBeVisible();
    });

    await test.step('Create blog page', async () => {
        const createPageButton = page.locator('text=Add New Page');
        expect(await createPageButton.isVisible()).toBe(true);
        await createPageButton.click();

        expect(await page.locator('text=Create New Page').isVisible()).toBe(
            true
        );
        await page.fill('#pageName', 'TestBlog');

        await page.fill('#pageRoute', '/TestBlog');

        const templateRadio = page.getByLabel('Blog');
        await templateRadio.click();

        const createPageButtonSubmit = page.locator('text=Create Page');
        await expect(createPageButtonSubmit).toBeEnabled();

        await createPageButtonSubmit.click();

        await page.waitForTimeout(500);
        await expect(
            page.getByRole('heading', { name: 'TestBlog' })
        ).toBeVisible();
    });

    await test.step('Verify new page appears in the list of pages', async () => {
        expect(
            await page.locator('text=No pages created yet.').isVisible()
        ).toBe(false);
        await expect(
            page.getByRole('heading', { name: 'TestBlog' })
        ).toBeVisible();
    });
};
