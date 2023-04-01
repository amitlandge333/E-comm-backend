const Jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    const isValid = await Jwt.verify(token, "shhh");
    console.log(token)
    console.log(isValid)
    // req.user = isValid;
    if (!isValid) {
    //   res.status(401).json("token invalid");
    } else {
    //   res.json("token matched");
    next();
    }
  }
};
module.exports = auth;
