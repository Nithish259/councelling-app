const jwt = require("jsonwebtoken");

const authCouncellor = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token)
      return res.status(401).json({ status: "Fail", message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.councellorId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ status: "Fail", message: "Unauthorized" });
  }
};

module.exports = authCouncellor;
