const { createTask } = require('../models/task.model');

const tasks = [
  createTask({
    title: 'Write project proposal',
    description: 'Draft the initial proposal and share it with the team for review.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
  }),
  createTask({
    title: 'Design the task review flow',
    description: 'Sketch the approve / reject workflow and data model.',
    priority: 'MEDIUM',
  }),
  createTask({
    title: 'Set up CI pipeline',
    description: 'Add lint, test, and build steps to the repository.',
    priority: 'LOW',
  }),
  createTask({
    title: 'Onboard new developers',
    description: 'Document setup steps and review guidelines for the team.',
    priority: 'MEDIUM',
    status: 'COMPLETED',
  }),
  createTask({
    title: 'Request payslip from customer',
    description: 'Customer has not uploaded the missing payslip document for review.',
    priority: 'LOW',
  }),
  createTask({
    title: 'Investigate billing invoice',
    description: 'Review the invoice for a duplicate charge and issue the refund. FORCE_AI_FAILURE',
    priority: 'MEDIUM',
  }),
];

function getAll() {
  return [...tasks];
}

function getById(id) {
  return tasks.find((task) => task.id === id);
}

function update(id, updates) {
  const task = getById(id);
  if (!task) {
    return null;
  }
  Object.assign(task, updates);
  return task;
}

module.exports = {
  getAll,
  getById,
  update,
};