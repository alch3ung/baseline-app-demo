import type { Task } from '@baseline/types/task';
import type { RequestHandler } from './request-handler';

export const getTask = async (requestHandler: RequestHandler, taskId: string): Promise<Task> => {
  const response = await requestHandler.request<Task>({
    method: 'GET',
    url: `task/${taskId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const getAllTasks = async (requestHandler: RequestHandler): Promise<Task[]> => {
  const response = await requestHandler.request<Task[]>({
    method: 'GET',
    url: 'task/list',
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const deleteTask = async (requestHandler: RequestHandler, taskId: string): Promise<boolean> => {
  const response = await requestHandler.request<boolean>({
    method: 'DELETE',
    url: `task/${taskId}`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const createTask = async (
  requestHandler: RequestHandler,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await requestHandler.request<Task>({
    method: 'POST',
    url: 'task',
    hasAuthentication: true,
    data: task,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};

export const updateTask = async (
  requestHandler: RequestHandler,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await requestHandler.request<Task>({
    method: 'PATCH',
    url: 'task',
    hasAuthentication: true,
    data: task,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};
