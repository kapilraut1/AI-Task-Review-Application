const request = require('supertest');
const createApp = require('../src/app');
const { _reset } = require('../src/data/task.store');

const fixtures = [
  {
    id: 'task-doc-1',
    title: 'Request payslip',
    description: 'The customer needs to upload a missing payslip document.',
    priority: 'HIGH',
    status: 'NEW',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'task-gen-1',
    title: 'Plan sprint',
    description: 'Organize the next sprint backlog and assign owners.',
    priority: 'MEDIUM',
    status: 'NEW',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'task-ai-1',
    title: 'Investigate billing invoice',
    description: 'Review the invoice for a duplicate charge and issue the refund. FORCE_AI_FAILURE',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-01-03T00:00:00.000Z',
  },
];

beforeEach(() => {
  _reset(fixtures.map((fixture) => ({ ...fixture })));
});

describe('GET /tasks', () => {
  test('returns 200 and an array of tasks', async () => {
    const res = await request(createApp()).get('/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);
    expect(res.body.map((task) => task.id)).toEqual(
      expect.arrayContaining(['task-doc-1', 'task-gen-1', 'task-ai-1']),
    );
  });

  test('filters by ?status=NEW', async () => {
    const res = await request(createApp()).get('/tasks?status=NEW');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((task) => task.status === 'NEW')).toBe(true);
  });

  test('returns 400 with an error field for an invalid status filter', async () => {
    const res = await request(createApp()).get('/tasks?status=BOGUS');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('PATCH /tasks/:id/status', () => {
  test('accepts a valid status and updates the task', async () => {
    const app = createApp();

    const res = await request(app).patch('/tasks/task-gen-1/status').send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ id: 'task-gen-1', status: 'IN_PROGRESS' }));

    const refetched = await request(app).get('/tasks/task-gen-1');
    expect(refetched.body.status).toBe('IN_PROGRESS');
  });

  test('rejects an invalid status with 400 and does not modify the task', async () => {
    const app = createApp();

    const res = await request(app).patch('/tasks/task-gen-1/status').send({ status: 'DONE_DONE' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();

    const refetched = await request(app).get('/tasks/task-gen-1');
    expect(refetched.body.status).toBe('NEW');
  });

  test('returns 404 for a nonexistent task', async () => {
    const res = await request(createApp())
      .patch('/tasks/does-not-exist/status')
      .send({ status: 'NEW' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /tasks/:id/analyse', () => {
  test('classifies a document-related task as DOCUMENT_REQUEST', async () => {
    const res = await request(createApp()).post('/tasks/task-doc-1/analyse');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        category: 'DOCUMENT_REQUEST',
        priority: expect.any(String),
        summary: expect.any(String),
        recommendedAction: expect.any(String),
      }),
    );
  });

  test('returns 502 with an error field when the AI provider fails', async () => {
    const res = await request(createApp()).post('/tasks/task-ai-1/analyse');

    expect(res.status).toBe(502);
    expect(res.body.error).toBeDefined();
    expect(res.body.details).toBeDefined();
  });

  test('returns 404 for a nonexistent task', async () => {
    const res = await request(createApp()).post('/tasks/does-not-exist/analyse');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});