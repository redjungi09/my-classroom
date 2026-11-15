'use client';

// 브라우저에서 움직이는 부분입니다. 버튼을 누르면 /api/sql 에 요청을 보냅니다.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

type TableInfo = { name: string; sql: string };
type Result = { columns?: string[]; rows?: unknown[][]; message?: string; error?: string };

// 눌러서 바로 넣어 볼 수 있는 예시입니다. 직접 고치거나 새로 적어도 됩니다.
const examples = [
  { label: '수업 전부 보기', sql: 'SELECT * FROM lessons;' },
  { label: '안 끝난 할 일', sql: 'SELECT * FROM todos WHERE done = 0;' },
  { label: '할 일 추가', sql: "INSERT INTO todos (lesson_id, text) VALUES (2, '친구와 채팅하기');" },
  { label: '없는 수업에 추가', sql: "INSERT INTO todos (lesson_id, text) VALUES (99, '없는 수업의 할 일');" },
  {
    label: '두 표 이어 보기',
    sql: 'SELECT lessons.title, todos.text, todos.done\nFROM todos\nJOIN lessons ON lessons.id = todos.lesson_id;',
  },
  // 레드준기가 추가한 예시입니다.
  { label: '할 일 끝내기', sql: 'UPDATE todos SET done = 1 WHERE id = 2;' },
  {
    label: '수업별 할 일 수',
    sql: 'SELECT lessons.title, COUNT(todos.id) AS 할일수\nFROM lessons\nLEFT JOIN todos ON todos.lesson_id = lessons.id\nGROUP BY lessons.id;',
  },
  { label: '끝낸 할 일 지우기', sql: 'DELETE FROM todos WHERE done = 1;' },
  { label: '잘못된 done 값', sql: "INSERT INTO todos (lesson_id, text, done) VALUES (1, '반쯤 끝냄', 2);" },
];

const box = 'rounded-lg border bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap';

// /api/sql 에 JSON을 보내고, JSON 응답을 받습니다.
async function callSql(body: object) {
  const response = await fetch('/api/sql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}

export function SqlPanel({ initialTables }: { initialTables: TableInfo[] }) {
  const [sql, setSql] = useState(examples[0].sql);
  const [result, setResult] = useState<Result>({});
  const [tables, setTables] = useState(initialTables);

  async function run() {
    const answer = await callSql({ action: 'run', sql });
    setResult(answer);
    setTables(answer.tables);
  }

  async function reset() {
    const answer = await callSql({ action: 'reset' });
    setResult(answer);
    setTables(answer.tables);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. SQL 적기</h2>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button key={example.label} variant="outline" size="sm" onClick={() => setSql(example.sql)}>
              {example.label}
            </Button>
          ))}
        </div>
        <Textarea
          className="font-mono"
          rows={5}
          spellCheck={false}
          value={sql}
          onChange={(event) => setSql(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">한 번에 한 문장만 실행합니다.</p>
        <div className="flex items-center gap-3">
          <Button onClick={run}>SQL 실행</Button>
          <Button variant="outline" onClick={reset}>처음 상태로</Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. 결과</h2>
        {result.error && <pre className={`${box} text-destructive`}>DB가 거절했습니다: {result.error}</pre>}
        {result.message && <pre className={box}>{result.message}</pre>}
        {result.columns && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {result.columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows?.map((row, index) => (
                  <TableRow key={index}>
                    {row.map((value, cell) => (
                      <TableCell key={cell}>{value === null ? 'NULL' : String(value)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="border-t px-3 py-2 text-sm text-muted-foreground">{result.rows?.length}줄</p>
          </div>
        )}
        {!result.error && !result.message && !result.columns && (
          <pre className={box}>SQL을 실행하면 결과가 여기에 나옵니다.</pre>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">지금 있는 표</h2>
        <p className="text-sm text-muted-foreground">표를 만든 문장입니다. 어떤 값이 거절되는지는 여기에 적혀 있습니다.</p>
        {tables.map((table) => (
          <pre key={table.name} className={box}>{table.sql}</pre>
        ))}
      </section>
    </div>
  );
}
