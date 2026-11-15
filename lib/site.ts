// 내 교실의 이름과 소개입니다. 가장 먼저 바꿔 볼 곳입니다.
export const site = {
  name: '내 교실',
  owner: '만든 사람 이름',
  description: '네트워크, DB, 인증을 이 화면에서 직접 실행해 보며 배웁니다.',
};

// 이 페이지를 만든 서버가 어디에서 실행 중인지 알려 줍니다.
// Codespace는 실행 환경에 아래 값을 미리 넣어 둡니다.
export function whereAmI() {
  if (process.env.CODESPACES === 'true') return `GitHub Codespace (${process.env.CODESPACE_NAME})`;
  return '내 컴퓨터';
}

// Codespace를 연 사람의 GitHub 아이디입니다. 로그인을 만들지 않아도 Codespace가 알려 줍니다.
export function whoAmI() {
  return process.env.GITHUB_USER ?? '이름 모름 (Codespace 밖)';
}
