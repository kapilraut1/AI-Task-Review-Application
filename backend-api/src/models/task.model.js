const { randomUUID } = require('node:crypto');

const STATUSES = ['NEW', 'IN_PROGRESS', 'COMPLETED'];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

function createTask({ title, description = '', priority = 'MEDIUM', status = 'NEW' }) {
  return {
    id: randomUUID(),
    title,
    description,
    priority,
    status,
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  STATUSES,
  PRIORITIES,
  createTask,
};