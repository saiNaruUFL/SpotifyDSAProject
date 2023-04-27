/*
const fs = require('fs');
const path = require('path');
const jsonFilePath = './bruh.json';
const csvFilePath = path.resolve(__dirname, './data/tracks_features.csv');
let count = 0;
const jsonArray = [];

const { parse } = require('papaparse');

fs.createReadStream(csvFilePath)
  .pipe(parse({ header: true }))
  .on('data', (data) => {
    count++;
    jsonArray.push(data);
    if (count === 100) {
      this.emit('end');
    }
  })
  .on('end', () => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray));
    console.log('CSV file successfully converted to JSON');
  });
*/