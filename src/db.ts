import { openDB, DBSchema } from 'idb';

export type TodoPriority = 'urgent' | 'normal' | 'later';

export type TodoStatus = 'active' | 'completed' | 'deleted' | 'archived';

export type TodoActivity = {
  timestamp: number;
  action: 'created' | 'updated' | 'prioritized' | 'rescheduled' | 'deleted' | 'completed' | 'archived';
  oldValue?: string;
  newValue?: string;
}

export interface Todo {
  id: number;
  text: string;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  dueAt?: number;
  expiredAt?: number;
  createdAt: number;
  completedAt?: number;
  activity: TodoActivity[];
  parent?: number;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
  lastUsedAt?: number;
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
const DB_VERSION = 2;

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
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const addTodo = async (todo: Todo) => {
  const db = await getDB();

  // Add new tags to the tags database if they don't already exist
  const existingTags = await getTags();
  const existingTagNames = existingTags.map((tag) => tag.name.toLowerCase());
  for (const tag of todo.tags) {
    if (!existingTagNames.includes(tag.toLowerCase())) {
      await addTag({ id: Date.now(), name: tag, color: getRandomColor(), createdAt: Date.now() }); // Assign random color
    }
  }

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
