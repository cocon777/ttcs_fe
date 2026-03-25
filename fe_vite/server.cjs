const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

const nowIso = () => new Date().toISOString();

const normalizeGender = (gioiTinh) => {
  if (typeof gioiTinh === "boolean") return gioiTinh;
  if (gioiTinh === "Nam") return true;
  if (gioiTinh === "Nữ") return false;
  return true;
};

const buildStudentClass = (studentClass, student) => {
  const hocSinh = studentClass?.hocSinh ?? student ?? null;
  const nguoiDung = hocSinh?.nguoiDung ?? {};

  return {
    ...studentClass,
    ten: studentClass?.ten ?? nguoiDung.ten ?? "Hoc sinh",
    email: studentClass?.email ?? nguoiDung.email ?? "",
    soDienThoai: studentClass?.soDienThoai ?? nguoiDung.soDienThoai ?? "",
    gioiTinh: normalizeGender(studentClass?.gioiTinh ?? nguoiDung.gioiTinh),
    ngaySinh: studentClass?.ngaySinh ?? nguoiDung.ngaySinh ?? null,
    hocSinh,
  };
};

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

// ---- CLASSROOM: danh sach HS theo lop ----
server.get("/classrooms/:classId/students", (req, res) => {
  const db = router.db;
  const classId = Number(req.params.classId);
  const classroom = db.get("classrooms").find({ id: classId }).value();

  if (!classroom) {
    return res.status(404).json({ message: "Classroom not found" });
  }

  const studentClasses = db
    .get("student-classes")
    .filter({ lopHocId: classId })
    .value();
  const students = db.get("students").value();
  const assignments = db
    .get("assignments")
    .filter({ classroomId: classId })
    .value();

  const studentClassesWithProfile = studentClasses.map((studentClass) => {
    const student =
      studentClass.hocSinh ??
      students.find((item) => item.id === studentClass.hocSinhId);
    return buildStudentClass(studentClass, student);
  });

  return res.status(200).json({
    ...classroom,
    soLuongHS: studentClassesWithProfile.length,
    studentClasses: studentClassesWithProfile,
    assignments,
  });
});

// ---- CLASSROOM: tao lop ----
server.post("/classrooms", (req, res) => {
  const db = router.db;
  const { className, classYear, tenLop, namHoc, giaoVienId } = req.body || {};
  const now = nowIso();
  const newClassroom = {
    id: Date.now(),
    tenLop: className ?? tenLop ?? "Lop moi",
    namHoc: classYear ?? namHoc ?? "",
    giaoVienId: giaoVienId ?? 2,
    soLuongHS: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.get("classrooms").push(newClassroom).write();
  return res.status(201).json(newClassroom);
});

// ---- STUDENT-CLASSES: them hoc sinh bang ma ----
server.post("/student-classes/add-by-code", (req, res) => {
  const db = router.db;
  const { studentCode, classroomId } = req.body || {};
  const classId = Number(classroomId);

  if (!studentCode || !classId) {
    return res
      .status(400)
      .json({ message: "Missing studentCode or classroomId" });
  }

  const student = db.get("students").find({ maHS: studentCode }).value();
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const existed = db
    .get("student-classes")
    .find({ hocSinhId: student.id, lopHocId: classId })
    .value();
  if (existed) {
    return res
      .status(409)
      .json({ message: "Student already in classroom" });
  }

  const studentClass = buildStudentClass(
    {
      id: Date.now(),
      lopHocId: classId,
      hocSinhId: student.id,
      createdAt: nowIso(),
    },
    student,
  );

  db.get("student-classes").push(studentClass).write();
  return res.status(201).json(studentClass);
});

server.get("/student-classes/classroom/:classroomId", (req, res) => {
  const db = router.db;
  const classId = Number(req.params.classroomId);
  const studentClasses = db
    .get("student-classes")
    .filter({ lopHocId: classId })
    .value();
  return res.status(200).json(studentClasses);
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running on http://localhost:3001");
});
