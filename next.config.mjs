/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 서버는 127.0.0.1에서 돕니다. 아래 주소로 열어도 요청을 받게 합니다.
  // (…app.github.dev는 Codespace가 만들어 주는 주소입니다.)
  allowedDevOrigins: ['localhost', '*.app.github.dev'],

  // 개발 중에 뜨는 동그란 N 표시를 끕니다. 오른쪽 아래 AI 도우미 버튼과 겹치기 때문입니다.
  devIndicators: false,

  // 화면이 1초마다 실행 상태를 묻는 요청은 터미널에 찍지 않습니다.
  logging: { incomingRequests: { ignore: [/\/api\/lab\?id=/] } },
};

export default nextConfig;
