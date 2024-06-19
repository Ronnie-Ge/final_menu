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

// 編輯菜單頁面
app.get('/edit-menu', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'menu.json');
  const menus = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  res.render('edit', { menus });
});

// 更新菜單請求
app.post('/update-menu', (req, res) => {
  const updatedMenus = req.body.menus.map(menu => ({
    name: menu.name,
    price: parseFloat(menu.price),
    quantity: parseInt(menu.quantity),
    index: parseInt(menu.index),
  }));

  const newFileName = req.body.newFileName;
  const jsonFilePath = path.join(__dirname, 'menu.json');
  const newJsonFilePath = path.join(__dirname, 'uploads', `${newFileName}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(updatedMenus, null, 2), 'utf-8');
  fs.writeFileSync(newJsonFilePath, JSON.stringify(updatedMenus, null, 2), 'utf-8');
  res.redirect('/menus');
});

// 載入菜單頁面
app.get('/load', (req, res) => {
  const jsonDir = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(jsonDir).filter(file => file.endsWith('.json'));
  res.render('load', { files });
});

// 處理載入的菜單
app.post('/load-menu', (req, res) => {
  const selectedFile = req.body.selectedFile;
  const jsonFilePath = path.join(__dirname, 'uploads', selectedFile);
  let menus = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  // // Filter out menus with empty names
  // menus = menus.filter(menu => menu.name && menu.name.trim() !== '');

  fs.writeFileSync(path.join(__dirname, 'menu.json'), JSON.stringify(menus, null, 2), 'utf-8');
  res.redirect('/menus');
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
