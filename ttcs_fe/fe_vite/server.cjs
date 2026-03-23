const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// helper
const makeToken = (user) => `${user.tenDangNhap}-${user.id}`;

server.post("/auth/login", (req, res) => {
  const { tenDangNhap, matKhau } = req.body;
  const db = router.db;
  const user = db.get("users").find({ tenDangNhap, matKhau }).value();

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = makeToken(user);
  return res.status(200).json({ accessToken, user });
});

server.post("/auth/register", (req, res) => {
  const db = router.db;
  const users = db.get("users");
  const id = Date.now();
  const newUser = { id, ...req.body };
  users.push(newUser).write();
  return res.status(201).json(newUser);
});

server.post("/auth/logout", (_req, res) => {
  return res.status(204).send();
});

server.post("/auth/refresh-token", (req, res) => {
  const token = req.headers.authorization || "fake-token";
  return res.status(200).json({ accessToken: token });
});

// ---- NEW: GET /users trả user theo token ----
server.get("/users", (req, res) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "TOKEN_MISSING" });
  }

  const token = auth.replace("Bearer ", "");
  const ten = token.split("-")[0];
  const db = router.db;
  const user = db.get("users").find({ ten }).value();

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json(user);
});

// protect /users (optional, vẫn giữ)
server.use((req, res, next) => {
  if (req.path.startsWith("/users")) {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer "))
      return res.status(401).json({ error: "TOKEN_MISSING" });
  }
  next();
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running on http://localhost:3001");
});
