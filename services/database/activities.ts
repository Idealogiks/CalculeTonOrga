import { Activity } from './types';
import { openDatabase } from './init';

export const createActivity = async (payload: {
  title: string;
  duration: number;
  tagId: number;
  startTime: string;
  endTime: string;
  isManual: boolean;
}): Promise<number> => {
  const db = await openDatabase();
  const res = await db.runAsync(
    `INSERT INTO activities (title, startTime, endTime, duration, isManual, tagId)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      payload.startTime,
      payload.endTime,
      payload.duration,
      payload.isManual ? 1 : 0,
      payload.tagId
    ]
  );
  return res.lastInsertRowId;
};

export const getAllActivities = async (): Promise<Activity[]> => {
  const db = await openDatabase();
  const rows = await db.getAllAsync<Activity>(`
    SELECT a.*, t.name AS tagName, t.color AS tagColor
    FROM activities a
    LEFT JOIN tags t ON a.tagId = t.id
    ORDER BY a.startTime DESC
  `);
  return rows;
};

export const getActivitiesByDate = async (dateISO: string): Promise<Activity[]> => {
  const db = await openDatabase();
  const rows = await db.getAllAsync<Activity>(
    `SELECT a.*, t.name AS tagName, t.color AS tagColor
     FROM activities a
     LEFT JOIN tags t ON a.tagId = t.id
     WHERE DATE(a.startTime) = DATE(?)
     ORDER BY a.startTime DESC`,
    [dateISO]
  );
  return rows;
};

export const getActivityById = async (id: number): Promise<Activity | null> => {
  const db = await openDatabase();
  const query = `
    SELECT a.*, t.name as tagName, t.color as tagColor 
    FROM activities a
    LEFT JOIN tags t ON a.tagId = t.id
    WHERE a.id = ?
  `;
  return await db.getFirstAsync<Activity>(query, [id]);
};

export const updateActivity = async (id: number, title: string, tagId: number): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync(
    'UPDATE activities SET title = ?, tagId = ? WHERE id = ?',
    [title, tagId, id]
  );
};

