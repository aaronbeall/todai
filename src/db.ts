import { openDB, DBSchema } from 'idb';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  tags: number[]; // List of Tag IDs
}

interface Tag {
  id: number;
  name: string;
}

interface TodoDBSchema extends DBSchema {
  todos: {
    key: number; // Todo ID
    value: Todo;
  };
  tags: {
    key: number; // Tag ID
    value: Tag;
  };
}

const DB_NAME = 'TodoDB';
const DB_VERSION = 1;

export const getDB = async () => {
  return openDB<TodoDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Utility functions for Todos
export const addTodo = async (todo: Todo) => {
  const db = await getDB();
  await db.put('todos', todo);
};

export const getTodos = async (): Promise<Todo[]> => {
  const db = await getDB();
  return db.getAll('todos');
};

export const getTodo = async (id: number): Promise<Todo | undefined> => {
  const db = await getDB();
  return db.get('todos', id);
};

export const deleteTodo = async (id: number) => {
  const db = await getDB();
  await db.delete('todos', id);
};

// Utility functions for Tags
export const addTag = async (tag: Tag) => {
  const db = await getDB();
  await db.put('tags', tag);
};

export const getTags = async (): Promise<Tag[]> => {
  const db = await getDB();
  return db.getAll('tags');
};

export const getTag = async (id: number): Promise<Tag | undefined> => {
  const db = await getDB();
  return db.get('tags', id);
};

export const deleteTag = async (id: number) => {
  const db = await getDB();
  await db.delete('tags', id);
};
