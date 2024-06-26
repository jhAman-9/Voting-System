const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  // check the request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  // extract the jwt token from the request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return req.status(401).json({ error: "unauthorized" });

  try {
    //verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user information to the request obj
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid Token" });
  }
};

// function to generate JWT token
const generateToken = (userData) => {
  // userData = payload
  // generating a new JWT token using userData
  return jwt.sign({ userData }, process.env.JWT_SECRET_KEY, {
    expiresIn: 300000,
  });
};
module.exports = { jwtAuthMiddleware, generateToken };
