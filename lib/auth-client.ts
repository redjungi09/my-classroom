// 브라우저에서 가입·로그인 요청을 보낼 때 쓰는 도구입니다. /api/auth/... 주소로 요청을 보냅니다.
import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({ plugins: [usernameClient()] });
