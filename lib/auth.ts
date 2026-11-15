// 가입, 로그인, 세션을 맡는 Better Auth 설정입니다.
// 계정은 data/auth.sqlite 파일에 저장됩니다. (Node.js 내장 SQLite)
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { username } from 'better-auth/plugins';

const folder = path.join(process.cwd(), 'data');
mkdirSync(folder, { recursive: true });

// 세션 쿠키에 서명할 때 쓰는 비밀 값입니다. 처음 한 번 만들어 저장소 밖(data 폴더)에 둡니다.
const secretFile = path.join(folder, 'auth-secret.txt');
if (!existsSync(secretFile)) writeFileSync(secretFile, randomBytes(32).toString('hex'));

// 브라우저가 이 서비스를 여는 주소입니다. Codespace에서는 Codespace가 만들어 준 주소입니다.
const port = process.env.PORT ?? '3000';
const address =
  process.env.CODESPACES === 'true'
    ? `https://${process.env.CODESPACE_NAME}-${port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : `http://localhost:${port}`;

export const authDb = new DatabaseSync(path.join(folder, 'auth.sqlite'));

export const auth = betterAuth({
  database: authDb,
  secret: readFileSync(secretFile, 'utf8'),
  baseURL: address,
  // 아래 주소에서 온 요청만 받습니다. 다른 사이트가 대신 로그인 요청을 보내는 것을 막습니다.
  // Codespace는 요청을 전달하면서 "어디에서 왔는지"를 localhost로 바꿔 적기 때문에 localhost도 넣습니다.
  trustedOrigins: [address, `http://localhost:${port}`, `https://localhost:${port}`],
  // 아이디와 비밀번호로 가입·로그인합니다.
  emailAndPassword: { enabled: true },
  plugins: [username()],
});

// user, account, session 표가 없으면 만듭니다.
const { runMigrations } = await getMigrations(auth.options);
await runMigrations();
