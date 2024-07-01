const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const LoginController = require('./controllers/loginController');

app.use(cors({
  origin: ['http://192.168.202.166:5173', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/upload_images', express.static('/home/web/upload_images'));

app.post(`/api/login`, LoginController.login);
app.post(`/api/create-user`, LoginController.createVendorAccount)



app.listen(port, () => {
  console.log(`NISA app listening on port ${port}`);
});