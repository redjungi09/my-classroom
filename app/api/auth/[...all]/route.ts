// /api/auth/ 로 시작하는 주소(가입, 로그인, 로그아웃 등)를 모두 Better Auth에 넘깁니다.
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

export const { GET, POST } = toNextJsHandler(auth);
