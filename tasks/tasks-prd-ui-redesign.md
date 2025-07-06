## Relevant Files

- `src/views/login.ejs` - This is the main landing page that will be redesigned to implement the new UI.
- `public/css/style.css` - All new CSS for the redesign will be added here, including colors, fonts, layout, and responsive media queries.
- `src/views/partials/header.ejs` - May require minor modifications to fit the new design, such as changing the title or removing navigation elements.
- `src/views/partials/footer.ejs` - Will be updated to match the simplified footer design outlined in the PRD.
- `src/routes/authRoutes.js` - Contains the route for the "Login with Strava" button; no changes are expected, but it's relevant to the main CTA.

### Notes

- The primary focus is on overhauling the EJS and CSS files. The backend routes should not require changes.
- Remember to make the design fully responsive by testing on various screen sizes.

## Tasks

- [x] 1.0 Setup and Styling Foundation
  - [x] 1.1 Clear out existing styles in `public/css/style.css` that are specific to the old login page design.
  - [x] 1.2 Define a new color palette (modern, playful) and typography settings (sans-serif font) as CSS variables.
  - [x] 1.3 Add global styles for the body, including background color and font settings.
- [x] 2.0 Implement Hero Section
  - [x] 2.1 Modify `src/views/login.ejs` to add the HTML structure for the new hero section.
  - [x] 2.2 Add the catchy headline and concise tagline to the hero section.
  - [x] 2.3 Style the "Login with Strava and have fun" button to be the main call-to-action, ensuring it is visually prominent.
- [x] 3.0 Implement Features Section
  - [x] 3.1 Add the HTML structure for the features section in `login.ejs`, creating containers for each feature.
  - [x] 3.2 Add icons, titles, and brief descriptions for the key features (AI generation, custom prompts, regeneration).
  - [x] 3.3 Implement the animated text transformation effect to show an example title change.
  - [x] 3.4 Add a styled placeholder image for the dashboard mockup.
  - [x] 3.5 Use Flexbox or CSS Grid to create a clean, modern layout for the features.
- [x] 4.0 Implement Simplicity and Security Section
  - [x] 4.1 Add the HTML structure for the "Simplicity and Security" section to `login.ejs`.
  - [x] 4.2 Add content that emphasizes the "set it and forget it" nature of the tool and its commitment to data security.
- [ ] 5.0 Implement Footer
  - [x] 5.1 Update `src/views/partials/footer.ejs` to include a link to the project's source code and a brief disclaimer.
  - [x] 5.2 Style the footer to be simple and unobtrusive.
- [ ] 6.0 Final Review and Responsive Polish
  - [ ] 6.1 Add media queries to `public/css/style.css` to ensure the layout is responsive and looks great on mobile, tablet, and desktop devices.
  - [ ] 6.2 Test the page across different browser widths and fix any layout or styling issues.
  - [ ] 6.3 Perform a final design review to ensure it matches the modern, playful, and clean aesthetic. 