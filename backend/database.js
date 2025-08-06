// backend/database.js (전체 코드 교체)
const sqlite3 = require("sqlite3").verbose();

// 데이터베이스 파일 연결
const db = new sqlite3.Database("myapp.db", (err) => {
  if (err) {
    console.error("데이터베이스 연결 실패:", err.message);
  } else {
    console.log("SQLite 데이터베이스에 연결되었습니다.");
  }
});

// users 테이블 생성
db.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err) => {
    if (err) {
      console.error("테이블 생성 실패:", err.message);
    } else {
      console.log("users 테이블이 준비되었습니다.");
    }
  }
);

module.exports = db;
