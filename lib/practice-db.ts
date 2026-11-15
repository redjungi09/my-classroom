// 연습용 DB입니다. Node.js에 들어 있는 SQLite를 써서 따로 설치할 것이 없습니다.
// DB는 data/practice.sqlite 파일 하나이고, 이 서비스가 돌고 있는 컴퓨터에 저장됩니다.
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const folder = path.join(process.cwd(), 'data');
const file = path.join(folder, 'practice.sqlite');

// 처음 상태입니다. 수업(lessons)과 그 수업의 할 일(todos), 두 표로 시작합니다.
const firstState = `
CREATE TABLE lessons (
  id    INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE todos (
  id        INTEGER PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  text      TEXT NOT NULL,
  done      INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1))
);

INSERT INTO lessons (title) VALUES ('첫 성공'), ('소켓 채팅'), ('HTTP 요청');

INSERT INTO todos (lesson_id, text, done) VALUES
  (1, 'Hello!를 내 문장으로 바꾸기', 1),
  (1, '서버를 껐다 켜야 바뀌는 이유 적기', 0),
  (2, '에코 서버에 글자 보내기', 1),
  (3, '요청 첫 줄의 세 부분 설명하기', 0);
`;

// 개발 서버가 코드를 다시 읽어도 열어 둔 DB를 잊지 않도록 globalThis에 둡니다.
const store = globalThis as { practice?: DatabaseSync };

function open() {
  if (store.practice) return store.practice;
  mkdirSync(folder, { recursive: true });
  const db = new DatabaseSync(file);
  // 표가 하나도 없으면 방금 만들어진 빈 파일입니다. 처음 상태를 넣습니다.
  const count = db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE type = 'table'").get();
  if (count?.n === 0) db.exec(firstState);
  store.practice = db;
  return db;
}

// DB 파일을 지우고 처음 상태로 다시 만듭니다.
export function resetPractice() {
  store.practice?.close();
  store.practice = undefined;
  rmSync(file, { force: true });
  open();
}

// 지금 있는 표와, 그 표를 만든 문장을 돌려줍니다.
export function listTables() {
  return open()
    .prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY name")
    .all()
    .map((row) => ({ name: String(row.name), sql: String(row.sql) }));
}

// SQL 한 문장을 실행합니다. 틀린 문장이면 SQLite가 알려 준 이유를 그대로 돌려줍니다.
export function runSql(sql: string) {
  try {
    const statement = open().prepare(sql);
    const columns = statement.columns().map((column) => column.name);

    // 돌려줄 열이 있으면 조회(SELECT)이고, 없으면 표를 바꾸는 문장입니다.
    if (columns.length > 0) {
      return { columns, rows: statement.all().map((row) => Object.values(row)) };
    }
    const result = statement.run();
    return { message: `실행했습니다. 바뀐 줄 수: ${result.changes}` };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
