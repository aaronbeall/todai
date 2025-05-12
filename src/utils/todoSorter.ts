import { Todo } from '../db';

export const sortAndCategorizeTodos = (todos: Todo[]) => {
  const now: Todo[] = [];
  const next: Todo[] = [];
  const later: Todo[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const sortedTodos = todos.sort((a, b) => {
    // Primary ranking
    const rankA = getTodoRank(a, today);
    const rankB = getTodoRank(b, today);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // Secondary sort by updatedAt/createdAt
    return (b.completedAt || b.createdAt) - (a.completedAt || a.createdAt);
  });

  for (const todo of sortedTodos) {
    const rank = getTodoRank(todo, today);

    if (rank === 1 || rank === 2) {
      now.push(todo);
    } else if (rank === 3) {
      next.push(todo);
    } else {
      later.push(todo);
    }
  }

  return { now, next, later };
};

const getTodoRank = (todo: Todo, today: Date): number => {
  if (todo.priority === 'urgent') {
    return 1;
  }

  if (todo.startedAt) {
    return 2;
  }

  if (todo.date) {
    const todoDate = new Date(todo.date);
    todoDate.setHours(0, 0, 0, 0); // Normalize to start of day

    if (todoDate.getTime() <= today.getTime()) {
      return 3;
    }

    return 4;
  }

  if (todo.priority === 'later') {
    return 6;
  }

  return 5; // No date and not "later"
};
