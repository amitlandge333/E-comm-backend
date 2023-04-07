const Jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token) {
      token = token.split(" ")[1];
      const isValid = await Jwt.verify(token, process.env.SECRETE_KEY);
      
      if (!isValid) {
        throw new Error({
          success: false,
          message: "invalid token",
        });
      } else {
        next();
      }
    }
  } catch (error) {
    res.send(error);
  }
};
module.exports = auth;
