const validator = require('validator');
const passwordValidator = require('password-validator');
const User = require('../models/UserModel');
const generateToken = require('../config/jwt');

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

class AdminController {

  index(req, res) {
    res.render('index');
  }

  async dashboard(req, res) {

    res.json(req.session.user);

  }

}

module.exports = new AdminController();
