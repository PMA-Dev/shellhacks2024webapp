import { createPageForProject } from './createPageForProject.support';

export const startServerAndOpenPage = async (
    { page }: any,
    test: any,
    expect: any
) => {
    await createPageForProject({ page }, test, expect);
    await test.step('start server for generated page', async () => {
        // click button to go back to dashboard via getLabel 'General'
        const generalButton = await page.locator('text=General');
        expect(await generalButton.isVisible()).toBe(true);
        await generalButton.click();

        expect(
            await page
                .locator('text=test-project')
                .isVisible({ timeout: 10000 })
        ).toBe(true);
        expect(await page.locator('text=Your Live Site').isVisible()).toBe(
            true
        );

        await page.click('#start-server');
        await page.waitForTimeout(3500);
        await expect(page.locator('#stop-server')).toBeVisible();
        await page.reload();
        const iframeEl = page.frameLocator('#main-iframe');
        await expect(iframeEl.getByText('Hackathon Project')).toBeVisible();

        const iframeList = page.locator('#iframe-list').locator('>*');
        await expect(iframeList).toHaveCount(3);
    });

    await test.step('open page and check that home works', async () => {
        const sitePath = await page.locator('input').inputValue();
        await page.goto(sitePath);

        await expect(page.locator('h1')).toHaveText('Hackathon Project');
        await expect(
            page.locator('text=Building the future, one hack at a time')
        ).toBeVisible();
        await expect(page.locator('canvas#gradient-canvas')).toBeVisible();
        await expect(
            page.locator('button', { hasText: 'Learn More' })
        ).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toHaveText(
            'Notify Me'
        );
    });
    await test.step('Navigate to Home and verify', async () => {
        await page.click('text=Home');
        await expect(page.locator('h1')).toHaveText('Hackathon Project');
    });

    await test.step('Navigate to TestTable and verify', async () => {
        await page.click('text=TestTable');
        await expect(page.locator('h1')).toHaveText('Log Data');
    });

    await test.step('Navigate to TestDataEntry and verify', async () => {
        await page.click('text=TestDataEntry');
        await expect(page.locator('h3')).toHaveText('Submit New Log');
    });

    await test.step('Navigate to TestBlog and verify', async () => {
        await page.click('text=TestBlog');
        await expect(page.locator('h1')).toHaveText('My Simple Blog');
    });

    await test.step('Perform data entry and submit', async () => {
        await page.click('text=TestDataEntry');
        await expect(page.locator('h3')).toHaveText('Submit New Log');

        await page.fill('#logName', 'Test Log Entry');
        await page.fill('#timestamp', '2023-10-10T10:00');

        await page.click('button[type="submit"]');
    });

    await test.step('Verify data in TestTable after submission', async () => {
        await page.click('text=TestTable');
        await expect(page.locator('text=Test Log Entry')).toBeVisible();
        await expect(page.locator('text=2023-10-10T10:00')).toBeVisible();
    });
};
