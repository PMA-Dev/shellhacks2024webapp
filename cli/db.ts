import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import { Config } from './config';
import {
    BaseDataRecord,
    GalacticMetadata,
    GenericMetadata,
    MetadataType,
    ProjectMetadata,
    type DbData,
} from './models';

let GLOBAL_DB: Low<DbData> | null = null;

export const getDbHandle = async (): Promise<Low<DbData>> => {
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
        `creating db instance with default data ${JSON.stringify(
            defaultData
        )} at ${dbPath}...`
    );
    const db = await JSONFilePreset(dbPath, defaultData);
    // if path doesnt exist write default data
    if (!db.data) {
        await db.write();
    }
    GLOBAL_DB = db;
};

export const pushMetadata = async (
    metadataType: MetadataType,
    data: GenericMetadata
): Promise<number> => {
    console.log(
        `Going to enter data to table ${metadataType}, with data: ${JSON.stringify(
            data
        )}`
    );
    const db = await getDbHandle();
    await db.read();
    data.id = getRandomInt(10000000, 100000000);
    await db.update((dbData: any) =>
        dbData.metadatas[metadataType].metadata.push(data as any)
    );
    return data.id;
};

export const editMetadataInPlace = async <T>(
    parentMetadataType: MetadataType,
    parentQueryId: number,
    fnToAppendId: (dbObject: T) => void
): Promise<void> => {
    console.log(
        `Going to append with fn to parent id: ${parentQueryId} in table ${parentMetadataType}`
    );
    const db = await getDbHandle();
    await db.read();
    await db.update((dbData: any) => {
        const obj = dbData.metadatas[parentMetadataType].metadata.find(
            (x: any) => x.id == parentQueryId
        );
        if (!obj) {
            console.log(`No data found for query id: ${parentQueryId}`);
            return;
        }

        console.log('Found obj:', obj);
        fnToAppendId(
            dbData.metadatas[parentMetadataType].metadata.find(
                (x: any) => x.id == parentQueryId
            )
        );
        console.log('done with fnToAppendId');
    });
};

export const patchMetadata = async (
    metadataType: MetadataType,
    data: GenericMetadata,
    queryId: number
): Promise<void> => {
    console.log(
        `Going to patch data to table ${metadataType}, with data: ${JSON.stringify(
            data
        )} using query: ${queryId}`
    );
    const db = await getDbHandle();
    await db.read();
    await db.update((dbData: any) => {
        const obj = dbData.metadatas[metadataType].metadata.find(
            (x: any) => x.id == queryId
        );
        if (!obj) {
            console.log(`No data found for query id: ${queryId}`);
            return;
        }
        const mergedObj = { ...obj, ...data };
        console.log('Merged obj:', mergedObj);
        console.log(
            `count before: ${dbData.metadatas[metadataType].metadata.length}`
        );
        dbData.metadatas[metadataType].metadata = dbData.metadatas[
            metadataType
        ].metadata.filter((x: any) => x.id != queryId);
        console.log(
            `count after: ${dbData.metadatas[metadataType].metadata.length}`
        );
        dbData.metadatas[metadataType].metadata.push(mergedObj);
        console.log(
            `count final: ${dbData.metadatas[metadataType].metadata.length}`
        );
    });
};

export const getRandomInt = (min: number, max: number) => {
    // Ensure min is less than max
    if (min > max) {
        throw new Error('Min value must be less than max value');
    }

    // Generate a random integer in the range [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
};

export const queryAll = async <T>(
    metadataType: MetadataType
): Promise<T[] | null> => {
    console.log(`Going to query for type: ${metadataType} and get all...`);
    const db = await getDbHandle();
    await db.read();
    const resp = db.data?.metadatas?.[metadataType]?.metadata;
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
    const fetchedData = (data?.find((x) => x.id == queryId) as T) || null;
    if (!fetchedData) {
        console.log(
            `No data found for query id: ${queryId} for type: ${metadataType}`
        );
        throw Error(
            `No data found for query id: ${queryId} for type: ${metadataType}`
        );
    }
    return fetchedData;
};

export const getDefaultGalacticId = async (): Promise<number> => {
    return (
        Number(
            (await queryAll<GalacticMetadata>(MetadataType.Galactic))?.[0]?.id
        ) || 0
    );
};

export const getProjectData = async (
    projectId: number
): Promise<ProjectMetadata> => {
    const project = await query<ProjectMetadata>(
        MetadataType.Project,
        projectId
    );
    if (!project)
        throw new Error('No project metadata found for id: ' + projectId);
    return project;
};
