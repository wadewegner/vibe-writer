# Strava Title Generator

A web application that automatically generates creative and personalized titles for your Strava activities using an AI service.

## Features

-   **Strava Integration**: Securely connect your Strava account using OAuth 2.0.
-   **Custom AI Prompts**: Configure a personalized prompt to guide the AI in generating titles that match your style.
-   **Automated Title Generation**: A background worker automatically processes new Strava activities, generates a new title, and updates it on Strava.
-   **Activity Dashboard**: View a history of your processed activities and the generated titles.
-   **Easy Deployment**: Deploy the application seamlessly to DigitalOcean's App Platform.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Frontend**: EJS (Embedded JavaScript templates), Bootstrap
-   **Database**: PostgreSQL
-   **Authentication**: Strava OAuth 2.0, Express Sessions
-   **Deployment**: DigitalOcean App Platform

## Initial Setup

Follow these steps to set up the project for local development.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/strava-title-generator.git
    cd strava-title-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    -   Make sure you have PostgreSQL installed and running.
    -   Create a new database for this project.
    -   Connect to your database and run the schema setup script to create the necessary tables:
        ```sql
        -- Execute the contents of `src/db/schema.sql`
        ```
        You can use a tool like `psql` to run the script:
        ```bash
        psql -d your_database_name -a -f src/db/schema.sql
        ```

4.  **Create a `.env` file:**
    -   Create a file named `.env` in the root of the project.
    -   Copy the contents of `.env.example` (we will create this next) into `.env` and fill in the required values.

## Environment Variables

You need to set up the following environment variables in a `.env` file in the project root.

| Variable              | Description                                                                                             | Example                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`        | The connection string for your PostgreSQL database.                                                     | `postgresql://user:password@host:port/database`          |
| `SESSION_SECRET`      | A random string used to sign the session ID cookie.                                                     | `your-super-secret-session-key`                          |
| `STRAVA_CLIENT_ID`    | Your Strava application's Client ID.                                                                    | `12345`                                                  |
| `STRAVA_CLIENT_SECRET`| Your Strava application's Client Secret.                                                                | `your-strava-client-secret`                              |
| `STRAVA_REDIRECT_URI` | The callback URL for Strava OAuth. For local dev, this will be an `ngrok` URL.                          | `http://localhost:3000/strava/callback`                  |
| `VERIFY_TOKEN`        | A token used to verify webhook requests from Strava. Can be any string.                                 | `a-random-verify-token`                                  |
| `AI_API_KEY`          | Your API key for the AI service (e.g., DigitalOcean Serverless Functions).                               | `your-ai-api-key`                                        |
| `AI_MODEL_NAME`       | The name or identifier of the AI model you are using.                                                   | `do-functions/my-ai-model`                               |

## Local Development

1.  **Run the application:**
    To run both the web server and the background worker concurrently in development mode (with auto-reloading), use:
    ```bash
    npm run dev
    ```
    -   The web server will be available at `http://localhost:3000`.
    -   The worker will be running in the background, ready to process webhook events.

2.  **Using `ngrok` for Webhook Testing:**
    Strava webhooks need a publicly accessible URL to send events. `ngrok` is a great tool to expose your local server to the internet.

    -   **Install `ngrok`**: Follow the instructions on the [ngrok website](https://ngrok.com/download).

    -   **Run `ngrok`**:
        ```bash
        ngrok http 3000
        ```
    -   `ngrok` will provide you with a public URL (e.g., `https://random-string.ngrok.io`).

    -   **Update Strava Settings**:
        -   Go to your Strava API Application settings.
        -   Set the **Authorization Callback Domain** to the `ngrok` domain (e.g., `random-string.ngrok.io`).
        -   Update the `STRAVA_REDIRECT_URI` in your `.env` file to use the `ngrok` URL:
            `STRAVA_REDIRECT_URI=https://random-string.ngrok.io/strava/callback`

    -   **Create a Webhook Subscription**:
        You will need to make a `POST` request to the Strava API to subscribe to activity events. Use a tool like `curl` or Postman.
        ```bash
        curl -X POST https://www.strava.com/api/v3/push_subscriptions \
        -F client_id=YOUR_CLIENT_ID \
        -F client_secret=YOUR_CLIENT_SECRET \
        -F "callback_url=https://your-ngrok-url.io/strava/webhook" \
        -F "verify_token=YOUR_VERIFY_TOKEN"
        ```
        Replace the placeholders with your actual credentials and the `ngrok` URL.

## Deployment

This application is configured for deployment to **DigitalOcean App Platform**.

1.  **Push to a Git Repository**:
    Make sure your project is a Git repository and pushed to a provider like GitHub, GitLab, or Bitbucket.

2.  **Create a New App on DigitalOcean**:
    -   In your DigitalOcean dashboard, go to **Apps** and click **Create App**.
    -   Choose your Git provider and select the repository for this project.
    -   DigitalOcean will automatically detect the `digitalocean.yml` file and configure the services.

3.  **Configure Environment Variables**:
    -   In the app's settings, go to the **Settings** tab for both the `web` and `worker` components.
    -   Add the environment variables listed above as **App-Level Environment Variables**. Make sure to mark sensitive values like secrets and API keys as **ENCRYPTED**.

4.  **Deploy**:
    -   Trigger a deployment. DigitalOcean will build the application and deploy the `web` and `worker` services.
    -   Once deployed, you will get a public URL for your application. Remember to update your Strava API settings with this new production URL. 