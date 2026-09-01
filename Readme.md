# AI-Assisted Task Review Application

A small full-stack application that allows users to view incoming tasks, update their status, and receive an AI-generated analysis with a recommended next action.

## How to run

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # optional — only needed for a real AI_API_KEY or different PORT
npm run dev
```

Runs on http://localhost:3000. No API key needed — falls back to a mock AI service.

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env   # optional — only needed if backend isn't on localhost:3000
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

**Tests**

```bash
cd backend
npm test
```

## Technologies used

- **Backend:** Node.js, Express, JavaScript
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query
- **Storage:** In-memory (seeded on boot)
- **AI:** Mock rule-based service by default; real OpenAI (`gpt-4o-mini`) if `AI_API_KEY` is set
- **Testing:** Jest + Supertest

## Approach

Backend follows a layered structure: model → store → service → controller
→ route, so validation and business logic stay separate from HTTP handling
and data access. AI analysis sits behind one function that returns the same
shape whether it's the mock or a real LLM call, so the rest of the app
doesn't need to know which one ran — failures are caught and turned into a
`502` instead of crashing. Frontend uses React Query hooks for all data
fetching, with each task's AI analysis tracked independently so one card's
loading/error state never affects another.

## Testing

9 Jest + Supertest tests covering: valid status update accepted, invalid
status rejected (400), status update on a missing task (404), status
filtering, successful AI analysis shape, and AI failure handled without
crashing (502). To confirm the tests were actually meaningful, I temporarily
broke the status-validation logic and confirmed the relevant test failed,
then restored it and confirmed all tests passed again.

## What I'd improve with more time

- Persist to SQLite instead of in-memory storage
- Add retry/timeout handling around the real LLM call
- Add frontend tests
- Cache AI analysis results instead of re-running on every click

## AI coding tools used

Claude

## How I checked AI-generated code was correct

- Read through each generated file before running it, rather than just copying
  it.
- Manually tested valid and invalid inputs (bad status values, missing
  task IDs, empty requests) to confirm behaviour matched the requirement.
- Ran the automated tests, then broke the status-validation
  logic to confirm the relevant test actually failed — then restored it
  and confirmed all tests passed again. This proved the tests were
  meaningful.
- Checked properly if the mock AI data was similar to the required output.
- Tested the AI failure path against a real error (an actual OpenAI 429),
  confirming the app returned a clean error instead of crashing — not just
  the simulated test case.
