# Product Requirements Document: Website UI Redesign

## 1. Introduction/Overview

This document outlines the requirements for a user interface (UI) redesign of the public-facing website. The current website is functional but lacks visual appeal and does not effectively communicate the application's value proposition. The goal of this redesign is to create a modern, playful, and visually compelling landing page that clearly highlights the key features, emphasizes simplicity and security, and encourages new users to sign up.

## 2. Goals

*   **Improve Visual Appeal:** Redesign the website to be modern, clean, and playful to create a strong first impression.
*   **Clarify Value Proposition:** Effectively communicate the core features: automatic AI-powered title generation, simple prompt-based customization, and on-demand title regeneration.
*   **Highlight Simplicity and Security:** Assure users that the service is easy to use and that their data is handled securely.
*   **Increase Conversion:** Drive more visitors to connect their Strava account with a clear and compelling call-to-action.
*   **Ensure Responsiveness:** The new design must be fully responsive and provide an excellent experience on both desktop and mobile devices.

## 3. User Stories

*   **As a new visitor,** I want to immediately understand what the application does and how it can make my Strava experience better.
*   **As a new visitor,** I want to see examples of the creative titles the tool can generate to get excited about its potential.
*   **As a new visitor,** I want to feel confident that the application is secure before I connect my Strava account.
*   **As a new visitor,** I want a single, clear call-to-action that guides me on how to get started.

## 4. Functional Requirements

1.  **Hero Section:**
    *   The top of the page must feature a prominent hero section.
    *   It must contain a clear, catchy headline (e.g., "Stop Writing Boring Strava Titles").
    *   A concise tagline will explain the core benefit (e.g., "Let AI craft creative and personalized titles for your activities, automatically.").
    *   A primary call-to-action (CTA) button with the text "Login with Strava and have fun" must be featured prominently. This button will initiate the Strava OAuth flow.

2.  **Features Section:**
    *   A dedicated section must showcase the application's key features.
    *   Each feature should be presented with an icon, a short title, and a brief description.
    *   **Visuals:** This section should include:
        *   An animated text element showing a default title like "Morning Run" transforming into an exciting, generated title like "Conquered 5k in the city fog."
        *   A stylized screenshot or mockup of the user dashboard to give users a preview of the application's interface.

3.  **Simplicity and Security Section:**
    *   A section must be included to reassure users.
    *   It should emphasize how easy the tool is to set up ("set it and forget it").
    *   It should state the commitment to security (e.g., "We only request the permissions needed to update your titles and never access other data.").

4.  **Footer:**
    *   A simple footer should be present at the bottom of the page.
    *   It should include a link to the project's source code (e.g., on GitHub) and a brief disclaimer (e.g., "Not affiliated with Strava, Inc.").

## 5. Non-Goals (Out of Scope)

*   The redesign will **only** apply to the public-facing landing page. The authenticated user dashboard is not included in this scope.
*   No new backend functionality will be developed.
*   The project will not involve creating a new logo or brand identity.

## 6. Design and Technical Considerations

*   **Theme:** The overall aesthetic should be modern, clean, and playful, using a bright color palette and generous whitespace to feel energetic and approachable.
*   **Visual Elements:**
    *   Use lightweight, clean icons for the features section.
    *   The animated title transformation should be simple and text-based to ensure fast loading times.
    *   The dashboard mockup should be a static image (not a live view) to illustrate the user experience.
*   **Call to Action (CTA):** The "Login with Strava and have fun" button should be the most visually prominent element in the hero section, potentially using a color that stands out from the rest of the palette.
*   **Typography:** A modern, readable sans-serif font should be used for all text.
*   **Technology:** The redesign will be implemented using the existing technical stack (Node.js, Express, EJS). All new styling must be in an external CSS file (`public/css/style.css`).

## 7. Success Metrics

*   **Conversion Rate:** An increase in the percentage of visitors who click the "Login with Strava" button.
*   **Bounce Rate:** A decrease in the percentage of visitors who leave the site after viewing only one page.
*   **User Feedback:** Positive qualitative feedback from users regarding the new design.

## 8. Open Questions

*   None at this time. 