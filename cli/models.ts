import type { Low } from 'lowdb';

export type DbType = Low<DbData>;

export interface BaseDataRecord {
    id: number;
}

export interface DbData {
    posts: BaseDataRecord[];
}
