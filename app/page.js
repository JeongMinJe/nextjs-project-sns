// my-sns/app/page.js (전체 코드 교체)
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  // 1. 상태 변수 선언
  const [message, setMessage] = useState("로딩 중...");
  const [serverData, setServerData] = useState(null);
  const [error, setError] = useState(null);

  // 2. 서버에서 데이터 가져오는 함수
  const fetchServerData = async () => {
    try {
      // Express 서버의 API 호출
      const response = await fetch("http://localhost:3001/api/test");

      // 응답이 성공적인지 확인
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      // JSON 데이터로 변환
      const data = await response.json();

      // 상태 업데이트
      setMessage(data.message);
      setServerData(data);
      setError(null);
    } catch (error) {
      console.error("에러:", error);
      setMessage("서버 연결 실패");
      setError(error.message);
    }
  };

  // 3. 컴포넌트가 로딩될 때 데이터 가져오기
  useEffect(() => {
    fetchServerData();
  }, []); // 빈 배열 = 한 번만 실행

  // 4. 화면 렌더링
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>프론트엔드 ↔ 백엔드 연결 테스트</h1>

      <div
        style={{
          margin: "20px 0",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        <h3>서버 상태: {message}</h3>
      </div>

      {serverData && (
        <div
          style={{
            margin: "20px 0",
            padding: "20px",
            backgroundColor: "#e6f7ff",
            borderRadius: "8px",
          }}
        >
          <h4>서버에서 받은 데이터:</h4>
          <p>메시지: {serverData.message}</p>
          <p>시간: {serverData.time}</p>
          <p>상태: {serverData.status}</p>
        </div>
      )}

      {error && (
        <div
          style={{
            margin: "20px 0",
            padding: "20px",
            backgroundColor: "#ffe6e6",
            borderRadius: "8px",
          }}
        >
          <h4>오류 발생:</h4>
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={fetchServerData}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        🔄 서버 데이터 새로고침
      </button>
    </div>
  );
}
