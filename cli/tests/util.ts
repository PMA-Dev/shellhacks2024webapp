import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export const createTempDir = (): string => {
    const tempDirectory = tmpdir();
    const tempDirPath = mkdtempSync(join(tempDirectory, 'playwright-temp-'));
    return tempDirPath;
};
