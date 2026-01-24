const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;
    if (!token)
      return res
        .status(401)
        .json({ status: "Fail", message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    res.status(401).json({ status: "Fail", message: "Unauthorized" });
  }
};

module.exports = auth;
