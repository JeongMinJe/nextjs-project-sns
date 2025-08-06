// backend/test-bcrypt.js
const bcrypt = require("bcrypt");

async function testBcrypt() {
  console.log("=== bcrypt 테스트 시작 ===");

  const originalPassword = "1234";
  console.log("원본 비밀번호:", originalPassword);

  // 1. 암호화
  const hashedPassword = await bcrypt.hash(originalPassword, 10);
  console.log("암호화된 비밀번호:", hashedPassword);
  console.log("길이:", hashedPassword.length);

  // 2. 검증 (맞는 비밀번호)
  const isValid = await bcrypt.compare("1234", hashedPassword);
  console.log("1234로 검증:", isValid);

  // 3. 검증 (틀린 비밀번호)
  const isWrong = await bcrypt.compare("5678", hashedPassword);
  console.log("5678로 검증:", isWrong);

  // 4. 같은 비밀번호를 다시 암호화
  const hashedPassword2 = await bcrypt.hash(originalPassword, 10);
  console.log("두 번째 암호화:", hashedPassword2);
  console.log("첫 번째와 같나?", hashedPassword === hashedPassword2);

  console.log("=== 테스트 완료 ===");
}

testBcrypt().catch(console.error);
