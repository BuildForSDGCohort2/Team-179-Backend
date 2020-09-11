[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2b6c54d9481f4dbb86b5cf0b5ec7cdcf)](https://app.codacy.com/gh/BuildForSDGCohort2/Team-179-Backend?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDGCohort2/Team-179-Backend&utm_campaign=Badge_Grade_Settings) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Team-179-Backend farmers crowdfunding app codebase
Agri-vesty is a PostgreSQL database-backed website for crowdfunding. The aim of Agri-vesty is  help farmers to raise farming capital. In this platform, a user can either create clowdfunding farming projects or invest money towards their favourite farming projects.

In addition, the platform provides a social features where a users can leave their comment and discuss projects and like a project. Moverover, based on users activity logs and project tags. Our recommendation algorithm will recommend relevant farming projects that users might be interested in.

**General functionality:**

-   Authenticate users (Login & Logout)
-   Create, Read, Update and Delete users (sign up, settings/updating & deleting profile )
-   Create, Read, Update and Delete farm and location.
-   Create, Update and Delete farming projects, comments, favourites.
-   GET and display paginated lists of crowdfunding farming project (individual & other requests)
-   Users can favorite and comment on clowdfunding farming project.

## Data Flow Diagram
![Screenshot](Information_Flow.jpg)

**SETUP**
-   Click on Fork at the top right corner
-   Clone your forked repository to our local machine
-   cd into the cloned folder | cd Team-179-Backend
-   Create a new git branch for each new feature. This is a good practice because in the future your will further update the branch after some discussions. e.g git checkout -b feature/user-login
-   Git push changes into your remote repository. Make sure you are on the branch you created for the new feature
-   In your forked repository Github page, change to the branch with the new feature and then hit the "Pull Request" button

**Running the project locally**
-   npm install
-   Copy env-example to .env and fill all the fields with your credentials
-   npm run dev
-   Go to http://localhost:4000

## Documentation Translations
Find the api documentation on https://api_url_production/api-docs or on you local machine at http://localhost:4000/api-docs.

<br />
