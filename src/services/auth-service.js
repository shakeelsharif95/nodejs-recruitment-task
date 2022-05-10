const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const users = [
  {
    id: 123,
    role: "basic",
    name: "Basic Thomas",
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  },
  {
    id: 434,
    role: "premium",
    name: "Premium Jim",
    username: "premium-jim",
    password: "GBLtTyq3E_UNjFnpo9m6",
  },
];

class AuthError extends Error {}

const authFactory = (secret) => (username, password) => {
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    throw new AuthError("invalid username or password");
  }

  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      role: user.role,
    },
    secret,
    {
      issuer: "https://www.netguru.com/",
      subject: `${user.id}`,
      expiresIn: 30 * 60,
    }
  );
};

const authorizeRequest = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send("No authorization header present!");

  const token = extractToken(authorization);

  if (!token) {
    return res.status(401).send("Token not provided!");
  }

  if (verifyToken(token)) {
    next();
    return;
  }

  return res
    .status(403)
    .send("You are not authorized to perform this request!");
};

const extractToken = (header) => {
  const contents = header.split(" ");
  if (contents[0] !== "Bearer") return false;

  return contents[1];
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded", decoded);
    return decoded;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  authFactory,
  AuthError,
  authorizeRequest,
  verifyToken,
  extractToken,
};
