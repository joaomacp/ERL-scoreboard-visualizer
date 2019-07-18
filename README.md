# Scoreboard visualizer for ERL competitions

Node.js express server using Sheets API to get contents from a Google Sheet (currently [this one](https://docs.google.com/spreadsheets/d/1P6biFVBGAzPrD3xW6OLu3qA3R5hmy29crQlIXrZzmIM/edit?usp=sharing)), and display them in a webpage.

Displays a scoreboard for a European Robotics League competition

### Installing
- Install node.js and npm
- From anywhere: `npm install -g http-server`
- In the project's root directory: `npm install`

### Running
From the project's root directory:
- Run the server: `node viz-server.js`
- Run the client: `http-server frontend`
- Open localhost:8081 in your browser

### Google credentials
Credentials are needed to use the Google Sheets API. You only need a `credentials.json` file in the project's root directory ([Step 1 of this guide](https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the)).