import { Task } from '@baseline/types/task';

export const taskMapper = (data: Task): Task => {
  const task: Task = {
    taskId: data?.taskId,
    content: data?.content,
    completed: data?.completed,
  };
  return task;
};
