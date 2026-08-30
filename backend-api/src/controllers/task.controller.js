const service = require('../services/task.service');
const aiService = require('../services/ai.service');

function sendServiceError(res, err) {
  if (err instanceof service.ValidationError) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal server error' });
}

function listTasks(req, res) {
  try {
    const tasks = service.listTasks(req.query.status);
    return res.json(tasks);
  } catch (err) {
    return sendServiceError(res, err);
  }
}

function getTask(req, res) {
  const task = service.getTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: `Task with id "${req.params.id}" not found.` });
  }

  return res.json(task);
}

function updateTaskStatus(req, res) {
  try {
    const status = req.body && req.body.status;
    const task = service.updateTaskStatus(req.params.id, status);

    if (!task) {
      return res.status(404).json({ error: `Task with id "${req.params.id}" not found.` });
    }

    return res.json(task);
  } catch (err) {
    return sendServiceError(res, err);
  }
}

async function analyseTask(req, res) {
  const task = service.getTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: `Task with id "${req.params.id}" not found.` });
  }

  try {
    const result = await aiService.analyseTask({
      title: task.title,
      description: task.description,
    });
    return res.json(result);
  } catch (err) {
    console.error(err.message);
    return res.status(502).json({
      error: 'AI analysis is temporarily unavailable. Please try again.',
      details: err.message,
    });
  }
}

module.exports = {
  listTasks,
  getTask,
  updateTaskStatus,
  analyseTask,
};