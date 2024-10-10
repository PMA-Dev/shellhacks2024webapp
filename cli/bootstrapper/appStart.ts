import { GalacticMetadata } from '../models';
import { runCmd } from '../shellProxy';

export const bootGalaxy = async (galaxy: GalacticMetadata) => {
    runCmd('mkdir', ['-p', galaxy.workingDir]);
};
