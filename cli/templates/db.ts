import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';

interface DbData {
  logs: Log[];
}

interface Log {
  id: number;
  logName: string;
  timestamp: string;
}

let GLOBAL_DB: Low<DbData> | null = null;

export const getDbHandle = async (): Promise<Low<DbData>> => {
  if (!GLOBAL_DB) {
    await setupDb();
  }
  return GLOBAL_DB!;
};

const getDefaultData = (): DbData => {
  return {
    logs: [],
  };
};

export const setupDb = async () => {
  if (!GLOBAL_DB) {
    const defaultData = getDefaultData();
    const dbPath = 'db.json';
    const db = await JSONFilePreset(dbPath, defaultData);
    // if path doesnt exist write default data
    if (!db.data) {
      await db.write();
    }
    GLOBAL_DB = db;
  } else {
    console.log('db instance exists...');
    return;
  }
};

export const pushLog = async (
  data: Log,
): Promise<number> => {
  const db = await getDbHandle();
  await db.read();
  data.id = getRandomInt(10000000, 100000000);
  await db.update((dbData: DbData) =>
    dbData.logs.push(data)
  );
  return data.id;
};

export const editLogInPlace = async (
  parentQueryId: number,
  fnToAppendId: (dbObject?: Log) => void,
): Promise<void> => {
  const db = await getDbHandle();
  await db.read();
  await db.update((dbData: DbData) => {
    const obj = dbData.logs.find(
      (x: Log) => x.id == parentQueryId,
    );
    if (!obj) {
      console.log('No data found for query id: ' + parentQueryId);
      return;
    }

    console.log('Found obj:', obj);
    fnToAppendId(
      dbData.logs.find(
        (x: Log) => x.id == parentQueryId,
      ),
    );
    console.log('done with fnToAppendId');
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

export const queryAll = async (): Promise<Log[] | null> => {
  const db = await getDbHandle();
  await db.read();
  const resp = db.data?.logs;
  if (!resp) {
    console.log('No data found...');
    return null;
  }
  return resp;
};

export const query = async (
  queryId: number,
): Promise<Log | null> => {
  const data = await queryAll();
  console.log('Returning data for query id:', queryId);
  const fetchedData = (data?.find((x) => x.id == queryId)) || null;
  if (!fetchedData) {
    console.log(
      'No data found for query id: '+ queryId,
    );
    throw Error(
      'No data found for query id:' + queryId,
    );
  }
  return fetchedData;
};