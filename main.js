const {app, BrowserWindow} = require("electron");
const mysql = require('mysql2');


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
  password:'root',
  database: 'jokes'
});

connection.query(
    'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    ['Page', 45],
    function(err, results, fields) {
        if (err) {
            console.log(err);
        }
      console.log(results);
      console.log(fields);
    }
  );