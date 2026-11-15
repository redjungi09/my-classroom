# 내 교실 — 시작점

네트워크, DB, 인증을 **화면 안에서 직접 실행해 보며** 배우는 작은 웹 서비스입니다. 여기서 출발해 각자 자기 교실로 바꿉니다.

실행은 이 서비스가 돌고 있는 컴퓨터가 합니다. 내 컴퓨터에서 띄우면 내 컴퓨터가, Codespace에서 띄우면 그 Codespace가 실습 코드와 SQL을 실행합니다. 따로 배포하지 않습니다.

## 시작하기

코딩 에이전트(Codex, Claude Code 등)를 빈 폴더에서 열고 아래 한 줄을 넣습니다.

```
https://raw.githubusercontent.com/almaden-almaden/classroom-starter/main/START.md 를 읽고, 거기 적힌 순서대로 진행해 줘.
```

에이전트가 내 계정에 저장소를 만들고, 실행해 확인하고, 교실 이름과 색을 물어 반영한 뒤 첫 커밋을 올립니다. 순서는 [START.md](START.md)에 그대로 적혀 있습니다.

## 내가 바꾼 것

바꿀 때마다 한 줄씩 적습니다. 무엇을 바꿨고 어디에서 확인했는지 씁니다.

- (아직 없음)

## 준비 상태

| 메뉴 | 화면에서 하는 일 | 상태 |
| --- | --- | --- |
| 네트워크 · 01 첫 성공 | 서버 코드를 고쳐 저장하고, 서버를 켜고, 요청을 보내 응답 원문을 봄 | 준비 · Codespace에서 확인 (2026-11-15, 사이드바 적용 전 화면 기준) |
| DB · SQL 실행 | SQL을 실행해 결과 표를 보고, 처음 상태로 되돌림 | 준비 · Codespace에서 확인 (2026-11-15) |
| 인증 · 가입과 로그인 | 아이디·비밀번호로 가입·로그인하고, DB에 저장된 사용자·비밀번호 해시·세션을 봄 | 준비 · Codespace에서 확인 (2026-11-15) |

사이드바와 DB 화면, 가입·로그인은 Codespace에서 동작하는 것을 확인했습니다 (2026-11-15).

오른쪽 아래의 **AI 도우미** 버튼은 크롬에 들어 있는 AI를 씁니다. 키도 서버도 필요 없고, 질문이 컴퓨터 밖으로 나가지 않습니다. 내장 AI가 없는 브라우저에서는 버튼이 나오지 않습니다. 크롬이어도 모델을 아직 받지 않았다면 첫 질문 때 내려받느라 오래 걸릴 수 있습니다. 작은 모델이라 틀린 답을 할 수 있습니다. 내 컴퓨터 주소에서 확인했고 Codespace 주소에서는 미확인입니다.

## 꼭 지킬 것

이 서비스는 화면에서 받은 코드와 SQL을 컴퓨터에서 실행합니다. **PORTS 탭의 3000 포트를 Public으로 바꾸지 않습니다.** 바꾸면 주소를 아는 누구나 내 Codespace에서 코드를 실행할 수 있습니다. 처음 상태(Private)에서는 나만 열 수 있습니다.

## Codespace에서 열기

1. GitHub의 내 저장소 화면에서 초록색 **Code** 버튼 → **Codespaces** 탭 → **Create codespace on main**을 누릅니다.
2. 브라우저에 VS Code가 열리고 패키지 설치가 끝날 때까지 기다립니다. 처음에는 1~2분 걸립니다.
3. 아래쪽 터미널에서 실행합니다.

   ```sh
   npm run dev
   ```

4. 오른쪽 아래 알림의 **Open in Browser**를 누르거나, **PORTS** 탭에서 `3000` 줄의 주소를 엽니다.

이미 만든 Codespace에 새 코드를 받으려면 터미널에서 아래 순서로 실행합니다. 패키지가 바뀌었을 수 있어 `npm ci`를 함께 합니다.

```sh
git pull
npm ci
npm run dev
```

30분쯤 쓰지 않으면 Codespace가 멈추고, 다시 열면 이어서 쓸 수 있습니다.

## 내 컴퓨터에서 실행

Node.js 24가 필요합니다. 이 폴더에서 실행합니다.

```sh
npm ci
npm run dev
```

<http://localhost:3000>을 엽니다. 종료는 Ctrl+C입니다.

## 어디를 고치면 무엇이 바뀌나

| 파일 | 바뀌는 것 |
| --- | --- |
| `lib/site.ts` | 교실 이름, 만든 사람, 소개 문장 |
| `lib/menu.ts` | 사이드바의 묶음과 항목 |
| `lib/lessons.ts` | 네트워크 수업 목록. 항목을 추가하면 사이드바에 수업이 늘어남 |
| `app/global.css` | 색과 모서리 둥글기. `:root` 안의 `--primary`, `--radius` 등 |
| `components/app-sidebar.tsx` | 사이드바를 그리는 방법 |
| `components/chat-button.tsx` | 오른쪽 아래 AI 도우미. 맨 위 `personality` 문장을 고치면 말투와 역할이 바뀜 |
| `app/layout.tsx` | 모든 화면의 공통 틀 |
| `app/page.tsx` | 홈 화면 |
| `app/lessons/[id]/` | 네트워크 실습 화면 (`lab-panel.tsx`가 브라우저에서 움직이는 부분) |
| `app/db/` | DB 화면 (`sql-panel.tsx`가 브라우저에서 움직이는 부분) |
| `app/auth/` | 인증 화면 (`auth-panel.tsx`가 브라우저에서 움직이는 부분) |
| `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/` | 가입·로그인·세션을 맡는 Better Auth 설정과 연결 |
| `app/api/auth-peek/route.ts` | 인증 화면의 “DB에 저장된 것”을 읽어 주는 부분 |
| `app/api/lab/route.ts`, `lib/runner.ts` | 실습 서버를 켜고 끄고, 요청을 보내는 부분 |
| `app/api/sql/route.ts`, `lib/practice-db.ts` | SQL을 실행하는 부분과 연습용 DB의 처음 상태 |
| `labs/` | 실습 코드와 실습 안내(README) |
| `.devcontainer/devcontainer.json` | Codespace가 준비하는 컴퓨터 |

## 가져온 부품

화면의 버튼, 카드, 표, 사이드바는 [shadcn/ui](https://ui.shadcn.com)에서 가져온 부품입니다. `components/ui/` 폴더에 들어 있고, 한 줄씩 읽을 필요는 없습니다. 부품이 더 필요하면 아래처럼 추가합니다.

```sh
npx shadcn@latest add dialog
```

모양은 Tailwind CSS로 정합니다. `className="text-sm text-muted-foreground"`처럼 태그에 붙은 짧은 단어들이 그 모양입니다.

## 버튼을 누르면 일어나는 일

```
브라우저(lab-panel.tsx) ──POST /api/lab──▶ 내 교실 서버(route.ts)
                                              │ runner.ts
                                              ├─ 서버 켜기: node server.mjs 를 띄움
                                              └─ 요청 보내기: 127.0.0.1:8080 에 TCP로 연결해 글자를 보냄

브라우저(auth-panel.tsx) ─POST /api/auth/…─▶ 내 교실 서버(Better Auth)
                                              │ auth.ts
                                              └─ data/auth.sqlite 파일에 계정과 세션을 저장

브라우저(sql-panel.tsx) ──POST /api/sql──▶ 내 교실 서버(route.ts)
                                              │ practice-db.ts
                                              └─ data/practice.sqlite 파일에 SQL을 실행
```

## 연습용 DB와 계정

Node.js에 들어 있는 SQLite를 써서 따로 설치할 것이 없습니다. 모두 `data/` 폴더에 있고 저장소에는 올라가지 않습니다. Codespace를 지우면 함께 사라집니다.

| 파일 | 내용 |
| --- | --- |
| `data/practice.sqlite` | DB 메뉴의 연습용 표. “처음 상태로”를 누르면 다시 만들어짐 |
| `data/auth.sqlite` | 인증 메뉴에서 만든 계정과 세션. 처음부터 다시 하려면 서버를 끄고 이 파일을 지움 |
| `data/auth-secret.txt` | 세션 쿠키 서명에 쓰는 비밀 값. 처음 실행할 때 자동으로 만들어짐 |

가입·로그인은 [Better Auth](https://better-auth.com)가 맡습니다. 아이디와 비밀번호만 받으며, Better Auth가 요구하는 이메일 칸은 `아이디@classroom.local`로 채웁니다. 연습용이니 실제로 쓰는 비밀번호는 넣지 않습니다.

## 고친 것을 남기기

Codespace 안에서 고친 내용은 저장소에 올려야 남습니다. 왼쪽의 **Source Control**(가지 모양)에서 바뀐 파일을 확인하고, 무엇을 바꿨는지 한 줄로 적은 뒤 **Commit** → **Sync Changes**를 누릅니다.

## 네트워크 수업을 하나 더 옮기려면

1. 예전에 만든 실습 폴더를 `labs/` 아래에 넣습니다. 폴더 이름은 영문으로 짓습니다.
2. `lib/lessons.ts`에 항목을 추가하고 실행할 파일과 포트를 적습니다.
3. 화면에서 서버 켜기와 요청 보내기가 되는지 확인하고, 그 폴더에 README.md를 씁니다.

지금 화면은 **포트 하나를 여는 서버 파일 하나**를 실행하는 실습에 맞춰져 있습니다. 터미널 입력을 받는 프로그램(채팅 클라이언트)이나 창을 띄우는 프로그램(Tkinter 브라우저, Wireshark)은 이 화면으로 실행되지 않습니다. 옮겨지지 않는 이유를 설명하는 것도 좋은 기록입니다.
