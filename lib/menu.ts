// 왼쪽 사이드바에 나오는 메뉴입니다. 묶음이나 항목을 추가하면 사이드바에 바로 나타납니다.
import { Database, KeyRound, Network } from 'lucide-react';
import { lessons } from './lessons';

export const menu = [
  {
    title: '네트워크',
    icon: Network,
    summary: '서버 코드를 고치고 실행하고, 요청을 보내 응답 원문을 봅니다.',
    // 네트워크 묶음은 lib/lessons.ts의 수업 목록에서 만들어집니다.
    items: lessons.map((lesson) => ({ title: lesson.title, href: `/lessons/${lesson.id}` })),
  },
  {
    title: 'DB',
    icon: Database,
    summary: 'SQL을 적어 실행하고, 표가 어떻게 바뀌는지 봅니다.',
    items: [{ title: 'SQL 실행', href: '/db' }],
  },
  {
    title: '인증',
    icon: KeyRound,
    summary: '가입과 로그인을 해 보고, 그때 무엇이 저장되는지 봅니다.',
    items: [{ title: '가입과 로그인', href: '/auth' }],
  },
];
