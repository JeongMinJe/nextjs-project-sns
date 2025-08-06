// backend/server.js (전체 파일 교체)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 🔹 기본 테스트 API
app.get("/api/test", (req, res) => {
  res.json({
    message: "서버가 살아있습니다!",
    time: new Date().toLocaleString(),
    status: "success",
  });
});

// 🔹 모든 사용자 조회 (비밀번호 제외)
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

// 🔹 테스트 사용자 추가 (랜덤)
app.post("/api/users/test", (req, res) => {
  const testUsers = [
    { username: "테스트1", password: "1234" },
    { username: "테스트2", password: "abcd" },
    { username: "테스트3", password: "qwer" },
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

// 🎯 회원가입 API (메인 기능)
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 입력 데이터 검증
    if (!username || !password) {
      return res.status(400).json({
        error: "사용자명과 비밀번호를 모두 입력해주세요",
      });
    }

    // 2. 사용자명 검증
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        error: "사용자명은 3-20글자 사이여야 합니다",
      });
    }

    // 3. 특수문자 검증
    const usernameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: "사용자명은 한글, 영문, 숫자만 사용 가능합니다",
      });
    }

    // 4. 비밀번호 검증
    if (password.length < 4 || password.length > 50) {
      return res.status(400).json({
        error: "비밀번호는 4-50글자 사이여야 합니다",
      });
    }

    // 5. 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. 데이터베이스에 저장
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(400).json({
              error: "이미 존재하는 사용자명입니다",
            });
          }
          console.error("회원가입 실패:", err);
          return res.status(500).json({
            error: "서버 오류가 발생했습니다",
          });
        }

        // 7. 성공 응답
        res.status(201).json({
          success: true,
          message: "회원가입이 완료되었습니다! 🎉",
          userId: this.lastID,
          username: username,
        });

        // 8. 서버 로그
        console.log(`새 사용자 가입: ${username} (ID: ${this.lastID})`);
      }
    );
  } catch (error) {
    console.error("회원가입 처리 중 오류:", error);
    res.status(500).json({
      error: "서버 오류가 발생했습니다",
    });
  }
});

// 서버 시작
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다!`);
  console.log("🚀 사용 가능한 API:");
  console.log("   GET  /api/test        - 서버 상태 확인");
  console.log("   GET  /api/users       - 사용자 목록 조회");
  console.log("   POST /api/signup      - 회원가입");
  console.log("   POST /api/users/test  - 테스트 사용자 추가");
});
