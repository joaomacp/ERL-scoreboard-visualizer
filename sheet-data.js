const SheetsAPI = require('sheets-api');
const sheets = new SheetsAPI();

const SPREADSHEET_ID = '1P6biFVBGAzPrD3xW6OLu3qA3R5hmy29crQlIXrZzmIM';

async function getBenchmarks() {
  let response;

  try{
    const auth = await sheets.authorize();

    response = await sheets.values('get', auth, {
      spreadsheetId: SPREADSHEET_ID,
      range: 'B1:AZ1'
    });
  } catch(e) {
    console.log(e);
  }

  benchmarks = {};
  current_letter = 'B';
  for(let value of response.response.values[0]) {
    if(value != '') {
      benchmarks[value] = current_letter + '1';
    }

    // Only supporting columns until 'AZ' for simplicity. Should be enough assuming the scoresheet doesn't exceed 52 columns.
    
    if(current_letter == 'Z') {
      current_letter = 'AA';
    } 
    else if(current_letter.length > 1) {
      current_letter = 'A' + String.fromCharCode((current_letter.charCodeAt(1) + 1));
    }
    else {
      current_letter = String.fromCharCode((current_letter.charCodeAt(0) + 1));
    }

    if(value.toLowerCase() == 'overall') {
      break;
    }
  }

  //console.log('benchmarks: ' + JSON.stringify(benchmarks));
  return benchmarks;
}

async function getTeams() {
  let response;

  try{
    const auth = await sheets.authorize();

    response = await sheets.values('get', auth, {
      spreadsheetId: SPREADSHEET_ID,
      range: 'A3:A19'
    });
  } catch(e) {
    console.log(e);
  }

  teams = {};
  current_row = 3;
  for(let team of response.response.values) {
    team = team[0];
    if(team != '') {
      teams[team] = 'A' + current_row;
    }
    else {
      break;
    }
    
    current_row++;
  }

  //console.log('teams: ' + JSON.stringify(teams));
  return teams;
}

async function getScores() {
  const benchmarks = await getBenchmarks();
  const teams = await getTeams();

  last_team = teams[Object.keys(teams)[Object.keys(teams).length-1]];
  last_team_row = last_team[1];

  let response;

  try{
    const auth = await sheets.authorize();

    response = await sheets.values('get', auth, {
      spreadsheetId: SPREADSHEET_ID,
      range: 'B3:AZ' + last_team_row
    });
  } catch(e) {
    console.log(e);
  }

  let scores = {};
  let team_counter = 0;
  for(let team of Object.keys(teams)) {
    scores[team] = {}

    let column_counter = 0;
    for(let benchmark of Object.keys(benchmarks)) {
      scores[team][benchmark] = {
        'achievements': Number(response.response.values[team_counter][column_counter]),
        'penalties': Number(response.response.values[team_counter][column_counter+1]),
        'time': Number(response.response.values[team_counter][column_counter+2]),
        'trials_left': Number(response.response.values[team_counter][column_counter+3])
      };

      column_counter += 4;
    }

    team_counter++;
  }

  //console.log('scores: ' + JSON.stringify(scores));
  return scores;
}

async function getTitle() {
  let response;

  try{
    const auth = await sheets.authorize();

    response = await sheets.values('get', auth, {
      spreadsheetId: SPREADSHEET_ID,
      range: 'B20'
    });
  } catch(e) {
    console.log(e);
  }

  //console.log(response.response.values[0][0]);
  return response.response.values[0][0];
}

module.exports = {
  getScores,
  getTitle
}