import { Tag } from './types';
import { openDatabase } from './init';

export const getAllTags = async (): Promise<Tag[]> => {
  const db = await openDatabase();
  const rows = await db.getAllAsync<Tag>('SELECT id, name, color FROM tags ORDER BY name', []);
  return rows || [];
};

export const createTag = async (name: string, color: string): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO tags (name, color) VALUES (?, ?)',
    [name, color]
  );
};

export const deleteTag = async (id: number): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM tags WHERE id = ?', [id]);
};