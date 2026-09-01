const store = require("../data/task.store");
const { STATUSES } = require("../models/task.model");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function listTasks(statusFilter) {
  if (statusFilter !== undefined && !STATUSES.includes(statusFilter)) {
    throw new ValidationError(
      `Invalid status filter "${statusFilter}". Valid values are: ${STATUSES.join(", ")}.`,
    );
  }

  const tasks = store.getAll();
  const filtered = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTask(id) {
  return store.getById(id) || null;
}

function updateTaskStatus(id, status) {
  if (typeof status !== "string" || status.trim() === "") {
    throw new ValidationError('A non-empty "status" string is required.');
  }

  if (!STATUSES.includes(status)) {
    throw new ValidationError(
      `Invalid status "${status}". Valid values are: ${STATUSES.join(", ")}.`,
    );
  }

  return store.update(id, { status });
}

module.exports = {
  ValidationError,
  listTasks,
  getTask,
  updateTaskStatus,
};
