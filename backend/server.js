// backend/server.js
const express = require("express"); // Express 가져오기
const cors = require("cors"); // CORS 가져오기

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🎯 여기에 API 추가!
app.get("/api/test", (req, res) => {
  res.json({
    message: "서버가 살아있습니다!",
    time: new Date().toLocaleString(),
    status: "success",
  });
});

// 추가 테스트 API
app.get("/api/hello", (req, res) => {
  res.json({
    greeting: "안녕하세요!",
    server: "Express",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다!`);
});
