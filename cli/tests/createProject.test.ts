import { test } from '@playwright/test';
import {
    checkNoProjectPage,
    createFirstProject,
} from './createProject.support';

test('Project onboarding flow', async ({ page }) => {
    await checkNoProjectPage({ page }, test);
});

test('Create first project', async ({ page }) => {
    await createFirstProject({ page }, test);
});
