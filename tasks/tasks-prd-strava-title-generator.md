## Relevant Files

- `src/app.js` - Main Express application setup for the frontend web service.
- `src/worker.js` - Entry point for the backend worker process that handles webhooks.
- `src/routes/authRoutes.js` - Express routes for handling the Strava OAuth 2.0 flow.
- `src/routes/dashboardRoutes.js` - Express routes for the user dashboard and prompt management.
- `src/routes/webhookRoutes.js` - Express routes for receiving Strava webhook events.
- `src/services/db.js` - Database connection setup and query functions for PostgreSQL.
- `src/db/schema.sql` - SQL statements to create the `users` and `processed_activities` tables.
- `src/services/stravaApi.js` - A dedicated module for all interactions with the Strava API.
- `src/services/aiGenerator.js` - A module to handle calls to the OpenAI-compatible service.
- `src/views/dashboard.ejs` - The EJS template for the main user dashboard.
- `src/views/login.ejs` - The EJS template for the login page.
- `package.json` - Defines project scripts and dependencies.
- `.env.example` - Template for required environment variables.
- `README.md` - Comprehensive documentation for setup, development, and deployment.
- `digitalocean.yml` - App Platform specification file for deployment.

### Notes

- This structure separates concerns between the web-facing app (`app.js`) and the background `worker.js`.
- Services are abstracted to keep API and DB logic out of route handlers.
- Test files should be created alongside the files they test (e.g., `stravaApi.test.js`).

## Tasks

- [x] 1.0 Project Setup & Initialization
  - [x] 1.1 Initialize a Git repository.
  - [x] 1.2 Create a `.gitignore` file suitable for a Node.js project.
  - [x] 1.3 Create the project directory structure (`src`, `src/routes`, `src/services`, `src/views`, `src/db`, `public`).
  - [x] 1.4 Run `npm init -y` and install core dependencies: `express`, `ejs`, `dotenv`, `pg`.
  - [x] 1.5 Install development dependencies: `nodemon`.
  - [x] 1.6 Set up Bootstrap for styling.
  - [x] 1.7 Create an `.env.example` file with placeholders for `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `DATABASE_URL`, `SESSION_SECRET`, `AI_API_KEY`, `AI_API_ENDPOINT`.

- [x] 2.0 Strava Authentication & User Management
  - [x] 2.1 Write the `schema.sql` to define the `users` and `processed_activities` tables.
  - [x] 2.2 Implement the PostgreSQL database connection in `src/services/db.js`.
  - [x] 2.3 Create the Strava OAuth routes (`/auth/strava`, `/auth/strava/callback`) in `src/routes/authRoutes.js`.
  - [x] 2.4 Implement the controller logic to exchange the Strava auth code for an access token.
  - [x] 2.5 Implement logic to create or update a user in the database with their tokens.
  - [x] 2.6 Set up basic session management to maintain user login state.

- [x] 3.0 Frontend Development: User Dashboard & Prompt Management
  - [x] 3.1 Create a route and controller to render the main dashboard page, visible only to logged-in users.
  - [x] 3.2 Design the `dashboard.ejs` view using Bootstrap, including a form for the AI prompt and a section for activity history.
  - [x] 3.3 Create a secure endpoint (`POST /prompt`) to receive and update the user's AI prompt in the database.
  - [x] 3.4 Implement the logic to fetch a user's recently processed activities from the database.
  - [x] 3.5 Display the activity history on the dashboard.

- [x] 4.0 Backend Worker: Activity Processing & Title Generation
  - [x] 4.1 In `worker.js`, set up an Express server to listen for webhook events.
  - [x] 4.2 Implement the webhook subscription validation endpoint (`GET /webhook`) to handle Strava's `hub.challenge`.
  - [x] 4.3 Implement the event receiver endpoint (`POST /webhook`) to accept new activity data.
  - [x] 4.4 In the handler, check the `processed_activities` table to ensure the activity has not been processed.
  - [x] 4.5 If the activity is new, fetch the user's prompt and call the AI service via `aiGenerator.js`.
  - [x] 4.6 Call the Strava API via `stravaApi.js` to update the activity's title with the generated text.
  - [x] 4.7 Insert the `activity_id` into the `processed_activities` table to prevent duplicates.
  - [x] 4.8 Implement robust error logging to the database for any failures in the process.

- [ ] 5.0 Deployment Preparation & Documentation
  - [ ] 5.1 Create the `digitalocean.yml` file, defining the frontend web service and the backend worker.
  - [ ] 5.2 Write the `README.md` with detailed sections for Initial Setup, Local Development (including running the webhook with `ngrok`), and Deployment to DigitalOcean App Platform.
  - [ ] 5.3 Thoroughly document all required environment variables in the `README.md`.
  - [ ] 5.4 Test the complete end-to-end flow locally before the first deployment. 