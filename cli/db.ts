import { JSONFilePreset } from 'lowdb/node';
import { Config } from './config';
import type { Low } from 'lowdb';
import type { BaseDataRecord, DbData, DbType } from './models';

let GLOBAL_DB: DbType | null = null;

export const getDbHandle = async (): Promise<DbType> => {
    if (!GLOBAL_DB) {
        await setupDb();
    }
    return GLOBAL_DB!;
};

const getDefaultData = (): DbData => {
    return { posts: [] };
};

export const setupDb = async () => {
    if (!!GLOBAL_DB) {
        console.log("db instance exists...")
        return;
    }

    const defaultData = getDefaultData();
    const dbPath = Config.DbFileName;
    console.log(`creating db instance with default data ${defaultData} at ${dbPath}...`)
    const db = await JSONFilePreset(dbPath, defaultData);
    GLOBAL_DB = db;
};

export const write = async (data: BaseDataRecord) => {
    const db = await getDbHandle();

    await db.update(({ posts }) => posts.push(data));
};
