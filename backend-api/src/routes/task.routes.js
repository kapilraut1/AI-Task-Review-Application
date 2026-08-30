const express = require('express');

const controller = require('../controllers/task.controller');

const router = express.Router();

router.get('/', controller.listTasks);
router.get('/:id', controller.getTask);
router.patch('/:id/status', controller.updateTaskStatus);
router.post('/:id/analyse', controller.analyseTask);

module.exports = router;