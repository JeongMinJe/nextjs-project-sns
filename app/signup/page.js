"use client";
import { useState } from "react";
import styles from "./signup.module.css";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 사용자명 실시간 유효성 검사 메시지
  const getUsernameValidationMessage = () => {
    if (username && username.length < 3) {
      return "사용자명은 3글자 이상이어야 합니다.";
    }
    return "";
  };

  // 비밀번호 실시간 유효성 검사 메시지
  const getPasswordValidationMessage = () => {
    if (password && password.length < 4) {
      return "비밀번호는 4글자 이상이어야 합니다.";
    }
    return "";
  };

  const usernameError = getUsernameValidationMessage();
  const passwordError = getPasswordValidationMessage();

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 1. 제출 시 최종 검증
    if (usernameError || passwordError) {
      setMessage("입력 형식을 다시 확인해주세요.");
      return;
    }

    if (!username || !password) {
      setMessage("사용자명과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 시작
    setMessage(""); // 기존 메시지 초기화

    try {
      // 2. API 호출
      const response = await fetch("http://localhost:3001/api/signup", {
        // 상대 경로로 변경하는 것을 권장
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      // 3. 응답 처리
      if (response.ok) {
        // 성공
        setMessage(`${data.message} 환영합니다, ${data.username}님!`);
        setUsername(""); // 폼 초기화
        setPassword("");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        // 실패 (400, 500 등)
        setMessage(data.error || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      // 네트워크 오류 등
      console.error("회원가입 오류:", error);
      setMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <p className={styles.subtitle}>새 계정을 만들어보세요!</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>사용자명</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3글자 이상 입력해주세요"
            disabled={isLoading}
            className={styles.input}
          />
          {/* 사용자명 유효성 검사 메시지 위치 */}
          {usernameError && (
            <div className={styles.validationError}>{usernameError}</div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="4글자 이상 입력해주세요"
            disabled={isLoading}
            className={styles.input}
          />
          {/* 비밀번호 유효성 검사 메시지 위치 */}
          {passwordError && (
            <div className={styles.validationError}>{passwordError}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !!usernameError || !!passwordError}
          className={styles.button}
        >
          {isLoading ? "처리 중..." : "가입하기"}
        </button>
      </form>
      {message && (
        <div
          className={`${styles.message} ${
            message.includes("환영합니다")
              ? styles.messageSuccess
              : styles.messageError
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
