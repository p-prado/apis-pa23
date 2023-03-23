const { app, BrowserWindow } = require("electron");
const mysql = require('mysql2');
const { ipcMain } = require('electron');


function createWindow() {
  const window = new BrowserWindow({
    width: 700,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  window.loadFile("index.html");
}

app.whenReady().then(createWindow);

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'jokes'
});

connection.query(
  'SELECT * FROM `jokes`',
  function (err, results, fields) {
    if (err) {
      // console.log(err);
    }
    // console.log(results);
    // console.log(fields);
  }
);

// Event handler for incoming mySQLInsert from Renderer process;
ipcMain.on('mySQLInsert', (event, j) => {
  console.log(j);
  if (j.type == "twopart") {
    connection.query(
      'INSERT INTO jokes (idjoke, language, type, category, setup, delivery) VALUES (?,?,?,?,?,?);',
      [j.id, j.lang, j.type, j.category, j.setup, j.delivery],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          event.sender.send('insertFail');
        } else {
          event.sender.send('insertSuccess', 'twopart');
        }
        // console.log(results);
      });
  } else {
    connection.query(
      'INSERT INTO jokes (idjoke, language, type, category, joke) VALUES (?,?,?,?,?);',
      [j.id, j.lang, j.type, j.category, j.joke],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          event.sender.send('insertFail');
        } else {
          event.sender.send('insertSuccess', 'single');
        }
        // console.log(results);
      });
  }
});

// Event handler for incoming mySQLSelect from Renderer process;
ipcMain.on('mySQLSelect', (event, catParam, typeParam) => {
  console.log(catParam, typeParam);
  if (catParam === "Any") {
    if (typeParam === "") {
      connection.query(
        'SELECT * FROM jokes ORDER BY RAND() LIMIT 1;',
        function(err, results){
          if (err) {
            console.log(err);
            event.sender.send('selectFail');
          } else {
            event.sender.send('selectSuccess', results[0]);
          }
        });
    } else {
      connection.query(
        'SELECT * FROM jokes WHERE type = ? ORDER BY RAND() LIMIT 1;',
        typeParam,
        function (err, results) {
          if (err) {
            console.log(err);
            event.sender.send('selectFail');
          } else{
            event.sender.send('selectSuccess', results[0]);
          }
        }
      )
    }
  } else {
    if (typeParam==="") {
      connection.query(
        'SELECT * FROM jokes WHERE category IN (?) ORDER BY RAND() LIMIT 1;',
        catParam,
        function(err, results){
          if (err) {
            console.log(err);
            event.sender.send('selectFail');
          } else {
            event.sender.send('selectSuccess', results[0]);
          }
        }
      )
    } else {
      connection.query(
        'SELECT * FROM jokes WHERE category IN (?) AND type = ? ORDER BY RAND() LIMIT 1;',
        [catParam, typeParam],
        function (err, results) {
          if (err) {
            console.log(err);
            event.sender.send('selectFail');
          } else {
            event.sender.send('selectSuccess', results[0]);
          }
        });
    }
  }
});