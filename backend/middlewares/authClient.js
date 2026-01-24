const jwt = require("jsonwebtoken");

const authClient = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

    if (!token) {
      return res.status(401).json({
        status: "Fail",
        message: "Not authorized. Login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      message: error,
    });
  }
};

module.exports = authClient;
