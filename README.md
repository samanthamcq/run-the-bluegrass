# Run The Bluegrass - Running App
The running club of Run The Bluegrass. 

The runners of Run The Bluegrass can use this app to join the running club and track their miles. They also can check their rank in the leaderboard.

This app is using Angular 8 and the backend is AWS. I use Amplify framework to register and authenticate users in the Amazon Cognito user pool. I also use AWS API Gateway so the app does not need to know where the data is stored and fetch from.

## Installation
npm install

### Initialize Amplify related configuration files/folders:
amplify init

## Development server
ng serve --open

## Build
ng build

## Screenshots
![Alt text](/src/assets/images/logMyRun.png?raw=true "Screen for logging miles run")
![Alt text](/src/assets/images/History.png?raw=true "Screen showing history of your runnings")
![Alt text](/src/assets/images/LeaderBoard.png?raw=true "Screen showing leader board of the challenge")
