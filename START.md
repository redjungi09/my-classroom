# 내 교실 시작하기 — 코딩 에이전트가 읽는 안내

학생이 자기 코딩 에이전트(Codex, Claude Code 등)에게 “이 문서를 읽고 진행해 줘”라고 했을 때 따르는 순서다. 목표는 **학생 자신의 저장소에서 내 교실이 실행되고, 이름과 색이 학생 것으로 바뀌어 첫 커밋이 올라가는 것**이다.

진행 원칙:

- 위에서부터 순서대로 한다. 단계가 끝날 때마다 학생에게 한두 줄로 알린다.
- 막히면 추측으로 넘어가지 않는다. 실행한 명령과 나온 글자를 그대로 보여 주고 멈춘다.
- 학생에게 묻는 것은 3단계에 모아서 한 번에 묻는다.
- 저장소를 만드는 것과 push는 학생 계정에 남는 일이다. 하기 전에 무엇을 할지 한 줄로 말한다.

## 0. 지금 상태 확인

아래를 실행해 결과를 본다.

```sh
node -v
git --version
gh auth status
git remote get-url origin
echo "CODESPACES=$CODESPACES"
```

- `node -v`가 24보다 낮으면 멈추고 학생에게 Node.js 24 설치가 필요하다고 알린다.
- 지금 폴더에 `lib/site.ts`와 `labs/` 폴더가 있고 `origin`이 **학생 계정의 저장소**이면, 이미 내 저장소 안이다. **2단계로 간다.**
- 그 밖에는 1단계로 간다.

## 1. 내 저장소 만들기

이 저장소(`almaden-almaden/classroom-starter`)는 템플릿이다. 학생 계정에 복사본을 만든다. 이 저장소에 직접 push하지 않는다.

**`gh`가 로그인돼 있을 때** — 저장소 이름은 `my-classroom`으로 한다. 같은 이름이 이미 있으면 학생에게 다른 이름을 묻는다.

```sh
gh repo create my-classroom --template almaden-almaden/classroom-starter --public --clone
cd my-classroom
```

복사 직후에는 폴더가 비어 있을 수 있다. `package.json`이 없으면 5초 기다린 뒤 `git pull origin main`을 실행한다.

**`gh`가 없거나 로그인이 안 돼 있을 때** — macOS에 Homebrew가 있으면 아래로 준비한 뒤 위 명령을 실행한다. 두 번째 명령은 브라우저가 열리고 학생이 직접 승인해야 한다.

```sh
brew install gh
gh auth login --web --git-protocol https
```

`gh`를 쓸 수 없으면 학생에게 아래를 직접 하게 안내하고, 만든 저장소 주소를 받아 `git clone` 한다.

1. <https://github.com/almaden-almaden/classroom-starter> 를 연다.
2. 초록색 **Use this template → Create a new repository**를 누른다.
3. 이름을 `my-classroom`으로 적고 **Create repository**를 누른다.

## 2. 실행해서 확인

```sh
npm ci
npm run dev
```

`npm run dev`는 끝나지 않는 명령이다. 백그라운드로 실행하거나, 학생에게 새 터미널에서 실행해 달라고 한다. 켜진 뒤 아래 세 주소가 모두 200을 돌려주는지 확인한다.

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/db
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/auth
```

- 3000 포트를 다른 프로그램이 쓰고 있으면 그 프로그램을 끄고 다시 실행한다. 다른 포트로 띄우면 로그인이 거절될 수 있다.
- 학생에게 <http://localhost:3000>을 열어 보게 한다. Codespace 안이라면 **PORTS** 탭의 `3000` 주소를 열게 한다.
- Codespace 안이라면 **3000 포트를 Public으로 바꾸지 말라고** 알린다. 이 서비스는 화면에서 받은 코드를 실행한다.

## 3. 학생에게 묻기

아래를 한 번에 묻는다. 답이 없는 항목은 그대로 둔다.

1. 교실 이름은 무엇으로 할까요? (예: 민아의 네트워크 교실)
2. 만든 사람으로 무엇을 적을까요? 저장소가 공개라서 누구나 봅니다. 별명도 됩니다.
3. 교실을 한 문장으로 소개하면?
4. 어떤 색이나 분위기를 원하나요? (예: 짙은 초록, 차분한 남색, 밝은 주황)
5. 오른쪽 아래 AI 도우미는 어떤 말투였으면 하나요?

## 4. 반영하기

| 답 | 고칠 곳 |
| --- | --- |
| 교실 이름, 만든 사람, 소개 | `lib/site.ts`의 `name`, `owner`, `description` |
| 색과 분위기 | `app/global.css`의 `:root` 안 `--primary`, `--primary-foreground`, `--sidebar-primary` 등 |
| AI 도우미 말투 | `components/chat-button.tsx` 맨 위 `personality` 문장 |
| 첫 화면 소개 | `README.md`의 제목과 첫 문단을 학생의 교실 소개로 바꾼다 |

`README.md`의 **내가 바꾼 것**에 한 줄을 추가한다. 예: `- 교실 이름과 색을 정함. 홈 화면과 사이드바에서 확인.`

고친 뒤에는 학생이 화면에서 확인할 곳을 알려 준다. 홈 화면의 제목, 사이드바 위쪽의 이름, 버튼 색이다.

## 5. 올리기

학생이 화면을 확인했다고 하면 올린다.

```sh
git add -A
git commit -m "내 교실 이름과 색 정하기"
git push
```

push가 거절되면 나온 글자를 그대로 보여 주고 멈춘다.

## 6. 다음에 할 일 제안

여기까지 끝나면 학생에게 아래 중 하나를 고르게 한다. 고른 것 하나만, 가장 작은 단계부터 한다.

- 밝은 테마와 어두운 테마를 바꾸는 버튼
- 예전에 만든 실습 하나를 네트워크 메뉴에 옮기기 (`README.md`의 “네트워크 수업을 하나 더 옮기려면”)
- DB 화면에 내가 만든 예시 SQL 버튼 추가
- 로그인이 거절될 때 나오는 영어 문구를 한글로
- 로그인한 사람만 볼 수 있는 “내 할 일”
- 학생이 직접 생각한 것

이후의 작업은 `AGENTS.md`를 따른다. 이 문서는 다시 읽지 않아도 된다.

## 7. Codespace에서도 열어 보기 (학생이 직접)

올린 뒤에는 내 컴퓨터 없이도 열 수 있다.

1. GitHub의 내 저장소에서 **Code → Codespaces → Create codespace on main**을 누른다.
2. 준비가 끝나면 터미널에 `npm run dev`를 입력한다.
3. **PORTS** 탭의 `3000` 주소를 연다. 사이드바 아래에 내 GitHub 아이디가 보이면 성공이다.

계정과 연습용 DB는 컴퓨터마다 따로 있어서, Codespace에서는 다시 가입해야 한다.
