# 이 저장소에서 AI가 지킬 것

학생이 자기 코드를 처음부터 끝까지 읽고 설명할 수 있는 작은 서비스다. 기능보다 읽기 쉬움이 먼저다.

## 일하는 방법

- 한 번에 한 가지만 바꾼다. 바꾼 파일과 이유를 한국어로 짧게 설명한다.
- 바꾼 뒤에는 `npm run dev`로 실행해 화면에서 확인할 방법을 알려 준다. 확인하지 않은 것을 됐다고 말하지 않는다.
- 학생이 “다 만들어 줘”라고 하면 가장 작은 첫 단계를 제안하고 그것부터 한다.
- 파일 맨 위와 헷갈리기 쉬운 줄에는 한국어 주석으로 무엇을 하는지 적는다.
- 기능을 바꾸면 `README.md`의 **내가 바꾼 것**에 한 줄을 추가한다. 무엇을 바꿨고 화면 어디에서 확인했는지 적는다.
- 커밋과 push는 학생이 화면에서 확인했다고 한 뒤에 한다.

## 화면

- 화면 부품은 shadcn/ui를 쓴다. 필요한 부품은 `npx shadcn@latest add <이름>`으로 추가하고, `components/ui/` 안의 파일은 직접 고치지 않는다.
- 이 프로젝트의 shadcn은 Base UI 기반이다. 다른 태그로 그리게 할 때는 `asChild`가 아니라 `render` 속성을 쓴다. 예: `<SidebarMenuButton render={<Link href="/db" />}>`
- 모양은 Tailwind CSS 클래스로 정한다. 새 CSS 파일을 만들지 않는다. 색은 `bg-muted`, `text-muted-foreground`처럼 테마 값을 쓰고 색 코드를 직접 적지 않는다.
- 전체 색과 둥글기는 `app/global.css`의 `:root` 값에서 바꾼다.
- 사이드바 메뉴는 `lib/menu.ts`에서 고친다.

## 코드

- 새 패키지, 새 폴더 구조는 학생이 먼저 요청했을 때만 추가한다. 추가하기 전에 왜 필요한지 묻는다.
- DB는 Node.js 내장 SQLite(`node:sqlite`)를 쓴다. 다른 DB나 ORM을 넣지 않는다.
- 가입·로그인·세션은 Better Auth(`lib/auth.ts`)가 맡는다. 비밀번호 해시나 세션 쿠키를 직접 만들지 않는다. 로그인한 사람은 서버에서 `auth.api.getSession({ headers: await headers() })`로 확인한다.
- AI 도우미(`components/chat-button.tsx`)는 크롬 내장 AI(`LanguageModel`)만 쓴다. 키가 필요한 외부 AI API로 바꾸려면 학생이 먼저 요청해야 하고, 키를 코드에 적지 않는다.
- 공통 유틸리티, 추상화, 방어적 예외 처리를 미리 만들지 않는다. 지금 필요한 코드만 쓴다.
- `labs/`의 실습은 한 파일에서 흐름을 읽을 수 있게 유지한다. 실습끼리 코드를 공유하지 않는다.

## 위험한 변경

- `/api/lab`과 `/api/sql`은 컴퓨터에서 코드와 SQL을 실행한다. 고칠 수 있는 파일을 수업 목록에 적힌 파일 밖으로 넓히거나, JSON 형식 확인을 빼거나, 서버를 127.0.0.1 밖으로 여는 변경은 위험을 먼저 설명하고 학생의 확인을 받는다.
- 비밀 값은 코드와 저장소에 적지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
