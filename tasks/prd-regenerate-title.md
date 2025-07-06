# PRD: Regenerate Activity Title

## 1. Introduction/Overview

This document outlines the requirements for a "Regenerate Title" feature. Currently, users receive an AI-generated title for their Strava activities. If a user is not satisfied with the generated title, there is no way to get a new one without manually editing it. This feature provides a simple, one-click mechanism to generate a new title suggestion, which the user can then accept.

The primary goal is to improve user satisfaction by giving them more control over their activity titles, allowing them to easily request alternatives until they find one they like.

## 2. Goals

*   Allow users to trigger the regeneration of an activity title.
*   Present the newly generated title to the user for confirmation before updating.
*   Provide a seamless and intuitive user experience for title regeneration.
*   Ensure the feature is visually integrated into the existing dashboard design.

## 3. User Stories

*   As a user, I want to be able to regenerate the title for my activity so that I can get a title I'm happier with without having to manually think of one.
*   As a user, I want to see a preview of the new title before it replaces the old one, so I can decide if I prefer it.
*   As a user, I want the ability to keep regenerating the title if I don't like the new suggestion.

## 4. Functional Requirements

1.  A "regenerate" button/icon shall be placed next to each activity title on the dashboard.
2.  Clicking the "regenerate" button shall trigger a call to the AI service to generate a new title for that specific activity.
3.  Upon successful generation, the new title shall be displayed to the user, for example in a modal or a temporary inline view.
4.  The user must be presented with "Accept" and "Cancel" (or "Regenerate Again") options for the new title suggestion.
5.  If the user accepts the new title, the activity title on the dashboard and on Strava should be updated.
6.  If the user cancels, the suggested title should be dismissed, and the original title should remain unchanged.
7.  The user can click the "regenerate" button multiple times for the same activity if they are not satisfied with the suggestion.
8.  If the title regeneration process fails, a simple, non-intrusive error message (e.g., "Failed to generate new title, please try again.") should be displayed to the user.

## 5. Non-Goals (Out of Scope)

*   This feature will not store a history of previously generated titles. Overwriting the old title is sufficient.
*   This feature will not allow users to provide input or guidance (e.g., "make it funnier") for the new title. Regeneration will be based on the original activity data.
*   There will be no limit on the number of times a user can regenerate a title for an activity.

## 6. Design Considerations (Optional)

*   The regenerate button should use a common, recognizable icon for "regenerate" or "refresh" (e.g., a circular arrow).
*   The confirmation UI (modal/pop-up) should be clean and clearly display the old title, the new title, and the action buttons.

## 7. Technical Considerations (Optional)

*   The feature will reuse the existing `aiGenerator.js` service to create the new title.
*   The feature will reuse the existing `stravaApi.js` service to update the activity title on Strava.
*   Frontend JavaScript will be required to handle the button clicks, API calls, and UI updates for showing the suggestion.

## 8. Success Metrics

*   Feature adoption: Track the number of unique users who use the regenerate feature within a month of its release.
*   User engagement: Measure the average number of regenerations per activity. A moderate number suggests users are engaging with the feature to find a title they like.

## 9. Open Questions

*   None at this time. 