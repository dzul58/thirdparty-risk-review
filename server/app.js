const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const LoginController = require('./controllers/loginController');
const authentication = require('./middlewares/authentication');
const VendorController = require('./controllers/vendorController');

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/upload_images', express.static('/home/web/upload_images'));

// app.get('/auto-login', LoginController.autoLogin);
app.post(`/api/create-vendor-user`, LoginController.createVendorAccount)
app.post(`/api/login-vendor`, LoginController.login);

app.use(authentication);

app.get(`/api/ticket_thirdparty`, VendorController.getAllTicketThirdParty)
app.get(`/api/ticket_thirdpartyclean`, VendorController.getAllTicketThirdPartyClean)
app.post('/api/complaint/:tpty_third_no', VendorController.createTicketComplaint);
app.put('/api/complaint/:tpty_third_no', VendorController.updateTicketComplaint);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});