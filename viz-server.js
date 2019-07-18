const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const port = 8080;

const sheetData = require('./sheet-data');

app.get('/scores', async (req, res) => {
  const [scores, title] = await Promise.all([sheetData.getScores(), sheetData.getTitle()]);

  res.send({
    scores,
    title
  });
});

app.listen(port, () => console.log(`Scoreboard server listening on port ${port}!`));