// npm install express body-parser multer ejs python-shell
// app.js

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
let { PythonShell } = require('python-shell');

const app = express();
const port = 3000;

// 設置靜態文件目錄
app.use(express.static('public'));

// 設置範本引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 解析請求體
app.use(bodyParser.urlencoded({ extended: true }));

// 設置文件上傳目錄
const upload = multer({ dest: 'uploads/' });

// 首頁路由
app.get('/', (req, res) => {
  res.render('index');
});

// 掃描頁面路由
app.get('/scan', (req, res) => {
  res.render('scan');
});

// 處理菜單上傳
app.post('/upload', upload.array('menu', 5), (req, res) => {
  const files = req.files;
  const filePaths = files.map(file => path.join(__dirname, file.path));
  // console.log(filePaths);

  const python = spawn('python3', ['../python_scripts/scan.py', ...filePaths]);

  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });


  python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.redirect('/menus');
  });
  
});

// 菜單顯示頁面
app.get('/menus', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'menu.json');
  const menus = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  res.render('menus', { menus });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
