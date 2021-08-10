const { response, SUCCESS, ACCOUNT_LOGOUT } = require('../core/response');
const User = require('../models/user');

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await User.login(email, password);
    await User.updateLastLogin(email, password);
    res.success(response(SUCCESS, '', result));
  } catch (error) {
    res.error(error);
  }
};

module.exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  /**
   * TODO: Update last_login on successful login
   */
  User.loginAdmin(email, password)
    .then(result => {
      res.success(response(SUCCESS, '', result));
    })
    .catch(err => {
      res.error(err);
    });
};

module.exports.logout = (req, res) => {
  /**
   * TODO: Add blacklisting of token here
   */
  res.success(response(ACCOUNT_LOGOUT));
};