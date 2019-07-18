var data = {};
var tables = [];
var currentTable = 0;

// Every 10 seconds, fetch data from the google sheet and display it
function refreshData() {
  fetch('http://localhost:8080/scores')
  .then(response => response.json())
  .then(function (sheetData) {
    console.log(sheetData);

    data = sheetData;
    let teams = Object.keys(data.scores);
    tables = Object.keys(data.scores[teams[0]]);
    fillTable(currentTable);
  });
}

refreshData();
window.setInterval(refreshData, 10000);

// Keyboard controls to change table
document.onkeydown = function(e) {
  switch (e.keyCode) {
      case 37: // Left arrow
        currentTable = ((currentTable - 1) % tables.length + tables.length) % tables.length;
        fillTable(currentTable);
        resetAnimation();
        break;
      case 39: // Right arrow
        currentTable = (currentTable + 1) % tables.length;
        fillTable(currentTable);
        resetAnimation();
        break;
      case 48: // Number 0
        currentTable = tables.length - 1; // Last table: Overall
        fillTable(currentTable);
        resetAnimation();
        break;
  }
};

// Slideshow: if active, change table every 10 seconds
var changeTableTimeout = setTimeout(cycleTable, 10000);

function cycleTable() {
  currentTable = (currentTable + 1) % tables.length;
  fillTable(currentTable);
  resetAnimation();
}

function resetAnimation() {
  clearTimeout(changeTableTimeout);
  changeTableTimeout = setTimeout(cycleTable, 10000);
}

function fillTable(tableIndex) {
  tableName = tables[tableIndex];
  document.getElementById('title').innerHTML = data.title;
  document.getElementById('subtitle').innerHTML = tableName;

  var teams = Object.keys(data.scores);
  teams = sortTeams(tableName);
  var columns = ['achievements', 'penalties', 'time', 'trials_left'];
  var columnNames = ['Achievements', 'Penalties', 'Time', 'Trials left'];

  var table = document.getElementById('scores-table');
  table.innerHTML = '';

  var tr = table.insertRow(-1);
  tr.appendChild(document.createElement('th'));
  for(let column of columnNames) {
    var th = document.createElement('th');
    th.className = 'centered';
    th.innerHTML = column;
    tr.appendChild(th);
  }

  for(let team of teams) {
    var tr = table.insertRow(-1);
    var th = document.createElement('th');
    th.innerHTML = team;
    tr.appendChild(th);

    for(let column of columns) {
      var th = document.createElement('th');
      th.innerHTML = data.scores[team][tableName][column];
      tr.appendChild(th);
    }
  }
}

// Sort teams by most achievements, breaking ties by least penalties, and then least time
function sortTeams(tableName) {
  var teams = Object.keys(data.scores);

  sortedTeams = teams.sort(function(teamA, teamB) {
    achievement_diff = Number(data.scores[teamA][tableName]['achievements']) - Number(data.scores[teamB][tableName]['achievements']);
    //console.log(data.scores[teamA][tableName]['Achievements'])
    //console.log(data.scores[teamB][tableName]['Achievements'])
    if(achievement_diff != 0) {
      return -achievement_diff;
    }

    penalty_diff = Number(data.scores[teamA][tableName]['penalties']) - Number(data.scores[teamB][tableName]['penalties']);
    if(penalty_diff != 0) {
      return penalty_diff;
    }

    time_diff = Number(data.scores[teamA][tableName]['time']) - Number(data.scores[teamB][tableName]['time']);
    if(time_diff != 0) {
      return time_diff;
    }

    return 0;
  });

  console.log('sorted teams: ' + sortedTeams);

  return sortedTeams;
}

/*function fillTable(data) {
  console.log(data);
  document.getElementById('title').innerHTML = data.title;

  var teams = Object.keys(data.scores);
  var benchmarks = Object.keys(data.scores[teams[0]]);

  var table = document.getElementById('scores-table');
  table.innerHTML = '';

  var tr = table.insertRow(-1);
  tr.appendChild(document.createElement('th'));
  for(let benchmark of benchmarks) {
    var th = document.createElement('th');
    th.colSpan = '2';
    th.className = 'centered';
    th.innerHTML = benchmark;
    tr.appendChild(th);
  }

  tr = table.insertRow(-1);
  tr.appendChild(document.createElement('th'));
  for(let benchmark of benchmarks) {
    if(benchmark.toLowerCase() == 'total') {
      var th = document.createElement('th');
      tr.appendChild(th);
    }
    else {
      var th = document.createElement('th');
      th.innerHTML = 'Trials left';
      tr.appendChild(th);

      var th = document.createElement('th');
      th.innerHTML = 'Score';
      tr.appendChild(th);
    }
  }

  for(let team of teams) {
    var tr = table.insertRow(-1);
    var th = document.createElement('th');
    th.innerHTML = team;
    tr.appendChild(th);

    for(let benchmark of benchmarks) {
      if(benchmark.toLowerCase() == 'total') {
        var th = document.createElement('th');
        th.innerHTML = data.scores[team][benchmark]['score'];
        tr.appendChild(th);
      }
      else {
        var th = document.createElement('th');
        th.innerHTML = data.scores[team][benchmark]['trials_left'];
        tr.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = data.scores[team][benchmark]['score'];
        tr.appendChild(th);
      }
    }
  }
}*/