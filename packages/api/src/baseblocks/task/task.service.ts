import { Task } from '@baseline/types/task';
import { getDynamodbConnection } from '@baselinejs/dynamodb';
import { ServiceObject } from '../../util/service-object';

const dynamoDb = getDynamodbConnection({
  region: `${process.env.API_REGION}`,
});

export const taskService = new ServiceObject<Task>({
  dynamoDb: dynamoDb,
  objectName: 'Task',
  table: `${process.env.APP_NAME}-${process.env.NODE_ENV}-task`,
  primaryKey: 'taskId',
});
