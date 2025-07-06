## Relevant Files

- `src/routes/activityRoutes.js` - To be created. Will contain the new API endpoints for regenerating and updating activity titles.
- `src/views/dashboard.ejs` - The main dashboard view where the "regenerate" button and confirmation modal will be added.
- `public/js/dashboard.js` - To be created. Will contain the client-side JavaScript to handle button clicks, API calls, and modal interactions.
- `public/css/style.css` - Existing stylesheet. Will need to be modified to add styles for the confirmation modal.
- `src/app.js` - The main application file, which will need to be updated to use the new `activityRoutes.js`.
- `src/services/aiGenerator.js` - Existing service to generate the new title.
- `src/services/stravaApi.js` - Existing service to update the title on Strava.
- `src/services/db.js` - Existing service to interact with the database.

### Notes

- Remember to link the new `public/js/dashboard.js` file in the `dashboard.ejs` template.
- Ensure all new API endpoints are protected and can only be accessed by authenticated users.

## Tasks

- [x] 1.0 Backend: Create an API endpoint to generate a title suggestion.
  - [x] 1.1 Create a new file: `src/routes/activityRoutes.js`.
  - [x] 1.2 In `activityRoutes.js`, define a new POST route, e.g., `/api/activities/:id/regenerate-title`.
  - [x] 1.3 The route handler should retrieve the activity data from the database using its ID.
  - [x] 1.4 Call the `aiGenerator.js` service with the activity data to generate a new title.
  - [x] 1.5 Return the new title suggestion as a JSON response.
  - [x] 1.6 In `app.js`, import and mount the new `activityRoutes.js` router.
- [x] 2.0 Frontend: Add "regenerate" button and confirmation modal to the UI.
  - [x] 2.1 In `src/views/dashboard.ejs`, add a "regenerate" icon/button next to each activity title. Assign a unique data attribute for the activity ID (e.g., `data-activity-id="<%= activity.id %>"`).
  - [x] 2.2 In `src/views/dashboard.ejs`, add the HTML structure for a hidden confirmation modal. The modal should include placeholders for the old and new titles, and "Accept" / "Cancel" buttons.
  - [x] 2.3 In `public/css/style.css`, add CSS to style the modal (e.g., center it, add a backdrop, style buttons).
- [x] 3.0 Frontend: Implement client-side logic for regeneration.
  - [x] 3.1 Create a new file: `public/js/dashboard.js`.
  - [x] 3.2 In `public/js/dashboard.js`, add an event listener for clicks on the "regenerate" buttons.
  - [x] 3.3 When a button is clicked, get the activity ID from the `data-activity-id` attribute.
  - [x] 3.4 Make a `POST` request to the `/api/activities/:id/regenerate-title` endpoint.
  - [x] 3.5 On success, populate the confirmation modal with the current and new titles and display it.
  - [x] 3.6 Implement the "Cancel" button logic to simply hide the modal.
- [ ] 4.0 Backend: Create an API endpoint to update the activity title.
  - [ ] 4.1 In `src/routes/activityRoutes.js`, define a new PUT route, e.g., `/api/activities/:id/title`.
  - [ ] 4.2 The route handler should take the new title from the request body.
  - [ ] 4.3 Call the `stravaApi.js` service to update the activity title on Strava's platform.
  - [ ] 4.4 Update the title in the local database.
  - [ ] 4.5 Return a success response.
- [ ] 5.0 Frontend: Implement client-side logic for accepting a new title.
  - [ ] 5.1 In `public/js/dashboard.js`, add an event listener to the "Accept" button in the modal.
  - [ ] 5.2 When clicked, make a `PUT` request to the `/api/activities/:id/title` endpoint, sending the new title in the request body.
  - [ ] 5.3 On success, update the activity title in the dashboard UI with the new title.
  - [ ] 5.4 Hide the confirmation modal.
  - [ ] 5.5 In `src/views/dashboard.ejs`, add a `<script>` tag to include `public/js/dashboard.js`. 