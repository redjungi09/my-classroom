// 수업 목록입니다. 항목을 하나 더 적으면 홈 화면에 수업이 하나 늘어납니다.
// folder 안의 file이 화면에서 고치고 실행하는 코드이고, port는 그 코드가 여는 포트입니다.
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  folder: string;
  file: string;
  port: number;
  steps: string[];
};

export const lessons: Lesson[] = [
  {
    id: 'first-success',
    title: '01 · 첫 성공',
    summary: '16줄 서버를 실행하고, 요청을 보내 응답 원문을 확인합니다.',
    folder: 'labs/01-first-success',
    file: 'server.mjs',
    port: 8080,
    steps: [
      '서버를 켜고, 요청을 보내 응답 원문을 확인합니다.',
      '코드의 Hello!를 내 문장으로 바꾸고 파일에 저장합니다.',
      '다시 요청을 보내 봅니다. 응답이 바뀌었나요? 왜 그럴까요?',
      '서버를 껐다 켠 뒤 요청을 보내 비교합니다.',
    ],
  },
];
