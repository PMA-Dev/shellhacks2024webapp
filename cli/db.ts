import { JSONFilePreset } from 'lowdb/node';
import { Config } from './config';
import {
    BaseDataRecord,
    GenericMetadata,
    MetadataType,
    type DbData,
    type DbType,
} from './models';

let GLOBAL_DB: DbType | null = null;

export const getDbHandle = async (): Promise<DbType> => {
    if (!GLOBAL_DB) {
        await setupDb();
    }
    return GLOBAL_DB!;
};

const getDefaultData = (): DbData => {
    return {
        metadatas: {
            [MetadataType.Galactic]: { metadata: [] },
            [MetadataType.Project]: { metadata: [] },
            [MetadataType.Page]: { metadata: [] },
            [MetadataType.Template]: { metadata: [] },
            [MetadataType.Component]: { metadata: [] },
        },
    };
};

export const setupDb = async () => {
    if (!!GLOBAL_DB) {
        console.log('db instance exists...');
        return;
    }

    const defaultData = getDefaultData();
    const dbPath = Config.DbFileName;
    console.log(
        `creating db instance with default data ${JSON.stringify(defaultData)} at ${dbPath}...`
    );
    const db = await JSONFilePreset(dbPath, defaultData);
    GLOBAL_DB = db;
};

export const pushMetadata = async (
    metadataType: MetadataType,
    data: GenericMetadata
) : Promise<number> => {
    console.log(
        `Going to enter data to table ${metadataType}, with data: ${JSON.stringify(
            data
        )}`
    );
    const db = await getDbHandle();
    await db.read();
    data.id = getRandomInt(100000000);
    await db.update((dbData: any) =>
        dbData.metadatas[metadataType].metadata.push(data as any)
    );
    return data.id;
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}


export const queryAll = async <T>(
    metadataType: MetadataType
): Promise<T[] | null> => {
    console.log(`Going to query for type: ${metadataType} and get all...`);
    const db = await getDbHandle();
    await db.read();
    const resp = db.data?.metadatas[metadataType]?.metadata;
    if (!resp) {
        console.log('No data found...');
        return null;
    }
    console.log('Returning data for type:', metadataType);
    return resp as T[];
};

export const query = async <T extends BaseDataRecord>(
    metadataType: MetadataType,
    queryId: number
): Promise<T | null> => {
    console.log(
        `Going to query for type: ${metadataType} with id: ${queryId}...`
    );
    const data = await queryAll<T>(metadataType);
    console.log('Returning data for query id:', queryId);
    return (data?.find((x) => x.id == queryId) as T) || null;
};
