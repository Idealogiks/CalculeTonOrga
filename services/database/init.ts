import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('activities.db');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  try {
    const database = await openDatabase();

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        startTime DATETIME NOT NULL,
        endTime DATETIME NOT NULL,
        duration INTEGER NOT NULL,
        isManual INTEGER NOT NULL DEFAULT 0,
        tagId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE RESTRICT
      );
    `);

    const defaultTags = [
      { name: 'Repos', color: '#E8E5FF' },
      { name: 'Ménage', color: '#FFE5E5' },
      { name: 'Travail', color: '#E5F0FF' },
      { name: 'Lecture', color: '#E5FFE5' },
      { name: 'Sport', color: '#FFF5E5' },
      { name: 'Dodo', color: '#F5E5FF' }
    ];

    for (const t of defaultTags) {
      await database.runAsync(
        'INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)',
        [t.name, t.color]
      );
    }

    console.log('Database fonctionne');
  } catch (error) {
    console.error('Database fonctionne pas:', error);
    throw error;
  }
};