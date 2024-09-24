import type { Response } from 'express';

import { taskMapper } from './task';
import { isAdmin } from '../../middleware/is-admin';
import type { RequestContext } from '../../util/request-context.type';
import type { Task } from '@baseline/types/task';
import { getErrorMessage } from '../../util/error-message';
import createApp from '../../util/express-app';
import createAuthenticatedHandler from '../../util/create-authenticated-handler';
import { taskService } from './task.service';

const app = createApp();
// app.use(isAdmin); // All private endpoints require the user to be an admin
export const handler = createAuthenticatedHandler(app);

app.post('/task', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { content, completed } = req.body as Task;
      const taskData: Partial<Task> = {
        content, completed,
      };
      const task = await taskService.create(taskData);
      res.json(taskMapper(task));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to create task ${message}`);
      res.status(400).json({ error: 'Failed to create task' });
    }
  },
]);

app.patch('/task', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const { taskId, content, completed } = req.body as Task;
      const taskData: Partial<Task> = {
        taskId, content, completed
      };
      const task = await taskService.update(taskData);
      res.json(taskMapper(task));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to update task: ${message}`);
      res.status(400).json({
        error: 'Failed to update task',
      });
    }
  },
]);

app.delete('/task/:taskId', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const taskId = req.params.taskId;
      await taskService.delete(taskId);
      res.status(200);
      res.send();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to delete task: ${message}`);
      res.status(400).json({
        error: 'Failed to delete task',
      });
    }
  },
]);

app.get('/task/list', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const tasks = await taskService.getAll();
      const formattedTasks = tasks.map(taskMapper);
      res.json(formattedTasks);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get tasks: ${message}`);
      res.status(400).json({
        error: 'Failed to get tasks',
      });
    }
  },
]);

app.get('/task/:taskId', [
  isAdmin,
  async (req: RequestContext, res: Response) => {
    try {
      const task = await taskService.get(req.params.taskId);
      res.json(taskMapper(task));
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to get task: ${message}`);
      res.status(400).json({
        error: 'Failed to get task',
      });
    }
  },
]);
