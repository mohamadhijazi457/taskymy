# TaskManager

TaskyMy is a Task Manager platform where users can privately organize their tasks.
The project was generated using Angular CLI version 18.2.11.
Firebase, Google tasks and weather APIs are configured and used in this project.

## project structure

Components: where we have the reusable forms and to create multiple parts components,
for example the dashboard page will use weather-panel, user-info and task-component.

Pages: the main pages/components of the app which are Signup, login and dashboard.

services: This is where we interact with the external APIs to create methods (for example: login, signup)

environements: this is where the API connection is configured

utils: this is where secondary files like interfaces, auth-guard and external json are included

## Firebase authentication:

This project leverages Firebase for authentication, ensuring secure user login and session management. The Firebase configuration details, including API keys and other necessary credentials, are stored in firebase-configure under the environment folder to keep sensitive data separate from the main application logic.

Authentication Workflow

1. Login and Signup:

The project uses Firebase's signInWithEmailAndPassword and createUserWithEmailAndPassword methods to enable user login and signup.
Upon successful login or signup, the application generates an auth_token which is then stored in localStorage to maintain the user session.

2. Token Management:

The AuthService class manages the auth_token and the user’s authenticated state through Angular signals.
The token is refreshed on login and signup to ensure session security. If the application detects an existing token in localStorage upon startup, it will automatically set the user as authenticated.
AuthGuard:

The AuthGuard service is implemented to restrict access to certain routes for unauthenticated users.
The guard checks the isAuthenticated state from the AuthService. If a user is not authenticated, they will be redirected to the login page.
Token Refresh and Authentication Persistence:

AuthService includes a refreshAuthToken method, which can manually refresh the token if needed.
A listener, onAuthStateChanged, is provided to track changes in the user's authentication state, offering a reactive way to handle session expiration or logout across the app.

3. Environment Configuration:

Firebase credentials and configuration are stored in the environments file to isolate sensitive data and simplify environment-specific setups.


## Google Tasks service integration:

This project integrates Google Tasks API, allowing users to manage their tasks seamlessly within the application. The API is accessed through OAuth 2.0, ensuring secure authorization and interaction with Google services. The OAuth configuration, including googleClientId and redirectUri, is stored in the environment configuration file.


1. OAuth Initialization:The OAuthService initiates the OAuth flow using Google's authorization endpoint. When the user clicks to sign in, they are redirected to Google to grant permission to access their tasks.
Token Storage and Management:

After successful login, the application captures the access token from Google’s redirect response and stores it in localStorage for session persistence.
This token is accessed by the GoogleTasksService to authenticate API requests.
GoogleTasksService:

The GoogleTasksService utilizes the stored Google OAuth token to interact with the Google Tasks API. All methods include an authorization header with the token to securely access and modify the user's tasks.
Tasks Operations:

2. Fetching Tasks: Retrieve all tasks using getAllTasks, which returns a list of tasks from the user's default task list.
Viewing a Single Task: Use getTask(taskId) to fetch detailed information about a specific task, helpful for updates or viewing details.
Creating Tasks: createTask allows users to add new tasks by specifying the title, description, start date, and due date.

3. Updating Tasks: updateTask lets users modify existing tasks by specifying the taskId and updated task data.

4. Deleting Tasks: Users can delete tasks using deleteTask, which removes a task from the Google Tasks list.


5. Environment Configuration:

The Google API client ID and other related OAuth configurations are managed in a dedicated environment file (google-config).

## weather API integration:

1. This service will allow users to see weather updates in the weather panel by choosing their countries(Please check countries json under utils).

2. After selecting a country the lontitude and latitude to this specific country are going to be set in the weather services.

3. The background image of the weather panel updates on data change

4. The default country is set "Lebanon"


## Running the project

Open the terminal in the project directory.
Run the following command to start the development server: `ng serve`
    
## Generate a new module

Run the following command to generate a new module:
`ng generate module module-name`

Alternatively, you can use the shorthand:
`ng g m module-name`

## Generate a new component

Run the following command to generate a new component:
`ng generate component component-name`

You can also generate other Angular elements like directives, pipes, services, classes, guards, interfaces, enums, or modules by using the following command:
`ng generate directive|pipe|service|class|guard|interface|enum|module`

## Build

To build the project, run the following command:
`ng build`
