// 기존 내용을 모두 지우고 다음으로 교체
export default function Home() {
  // 1. 여기서 자신의 정보로 바꿔보세요!
  const siteName = "내 첫 SNS";
  const userName = "정민제"; // ← 본인 이름으로 바꾸기
  const age = 33; // ← 본인 나이로 바꾸기
  const hobby = "영화감상"; // ← 본인 취미로 바꾸기

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>{siteName}</h1>
      <p>안녕하세요, {userName}님!</p>
      <p>나이: {age}살</p>
      <p>취미: {hobby}</p>
      <p>내년에는 {age + 1}살이 되겠네요!</p>
      <p>🎉 성공적으로 만들어졌습니다!</p>
    </div>
  );
}
