import { expect, test } from '@playwright/test';
import {
  checkGalacticHomepage,
  fillOutGalacticFormAndSubmit,
} from './createGalaxy.support';

test('has Galactic title', async ({ page }) => {
    await checkGalacticHomepage({ page }, test, expect);
});

test('fills out the form and clicks Get Started', async ({ page }) => {
    await fillOutGalacticFormAndSubmit({ page }, test, expect);
});
