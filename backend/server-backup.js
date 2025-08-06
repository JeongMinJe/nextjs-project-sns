// backend/server.js (전체 코드 교체)
const express = require("express");
const cors = require("cors");
const db = require("./database"); // 데이터베이스 연결

const app = express();

app.use(cors());
app.use(express.json());

// 기존 테스트 API
app.get("/api/test", (req, res) => {
  res.json({
    message: "서버가 살아있습니다!",
    time: new Date().toLocaleString(),
    status: "success",
  });
});

// 🎯 새로운 API: 모든 사용자 조회
app.get("/api/users", (req, res) => {
  db.all("SELECT id, username, created_at FROM users", (err, rows) => {
    if (err) {
      console.error("사용자 조회 실패:", err);
      res.status(500).json({ error: "데이터베이스 오류" });
    } else {
      res.json({
        users: rows,
        count: rows.length,
      });
    }
  });
});

// 🎯 새로운 API: 테스트 사용자 추가
app.post("/api/users/test", (req, res) => {
  const testUsers = [
    { username: "김철수", password: "1234" },
    { username: "이영희", password: "abcd" },
    { username: "박민수", password: "qwer" },
  ];

  const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)];

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [randomUser.username, randomUser.password],
    function (err) {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          res.status(400).json({ error: "이미 존재하는 사용자명입니다" });
        } else {
          res.status(500).json({ error: "데이터베이스 오류" });
        }
      } else {
        res.json({
          success: true,
          message: "테스트 사용자가 추가되었습니다",
          userId: this.lastID,
          username: randomUser.username,
        });
      }
    }
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다!`);
});
