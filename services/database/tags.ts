import { Tag } from './types';
import { openDatabase } from './init';

export const getAllTags = async (): Promise<Tag[]> => {
  const db = await openDatabase();
  const rows = await db.getAllAsync<Tag>('SELECT id, name, color FROM tags ORDER BY name');
  return rows || [];
};
