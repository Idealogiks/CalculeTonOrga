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
        tagId INTEGER, 
        location TEXT, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE RESTRICT
      );
    `);

    const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM tags');
    if (result && result.count === 0) {
      const defaultTags = [
        { name: 'Sommeil', color: '#6464B3' },  
        { name: 'Travail', color: '#E09F95' },   
        { name: 'Loisirs', color: '#95B8A6' },   
        { name: 'Transport', color: '#8FB8DE' }, 
      ];

      for (const t of defaultTags) {
        await database.runAsync(
          'INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)',
          [t.name, t.color]
        );
      }
    }
    console.log('Database initialisée avec succès');
  } catch (error) {
    console.error('Erreur init database:', error);
    throw error;
  }
};

export const resetDatabase = async (): Promise<void> => {
  const db = await openDatabase();
  try {
    console.log("⏳ Début de la réinitialisation...");
    await db.execAsync('DROP TABLE IF EXISTS activities');
    await db.execAsync('DROP TABLE IF EXISTS tags');
    await initDatabase(); 
    console.log("✅ Base de données remise à neuf");
  } catch (error) {
    console.error("❌ Erreur lors du reset:", error);
    throw error;
  }
};