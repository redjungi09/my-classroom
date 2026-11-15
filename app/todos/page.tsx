// 로그인한 사람만 볼 수 있는 "내 할 일" 화면입니다.
// 할 일은 계정과 같은 파일(data/auth.sqlite)의 my_todos 표에 사람마다 따로 저장됩니다.
import Link from 'next/link';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, authDb } from '@/lib/auth';

// 표가 없으면 만듭니다. user_id로 누구의 할 일인지 구분합니다.
authDb.exec(`
CREATE TABLE IF NOT EXISTS my_todos (
  id      INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  text    TEXT NOT NULL,
  done    INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1))
)`);

type Todo = { id: number; text: string; done: number };

// 지금 로그인한 사람의 id입니다. 로그인하지 않았으면 null입니다.
async function myId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

// 아래 두 함수는 서버에서 실행됩니다. 폼을 제출하면 호출됩니다.
async function addTodo(form: FormData) {
  'use server';
  const userId = await myId();
  const text = String(form.get('text') ?? '').trim();
  if (!userId || !text) return;
  authDb.prepare('INSERT INTO my_todos (user_id, text) VALUES (?, ?)').run(userId, text);
  revalidatePath('/todos');
}

async function toggleTodo(form: FormData) {
  'use server';
  const userId = await myId();
  if (!userId) return;
  // WHERE에 user_id를 같이 적어서, 다른 사람의 할 일은 바꿀 수 없게 합니다.
  authDb
    .prepare('UPDATE my_todos SET done = 1 - done WHERE id = ? AND user_id = ?')
    .run(Number(form.get('id')), userId);
  revalidatePath('/todos');
}

export default async function TodosPage() {
  const userId = await myId();

  if (!userId) {
    return (
      <article className="space-y-4">
        <h1 className="text-2xl font-semibold">내 할 일</h1>
        <p>로그인한 사람만 볼 수 있습니다.</p>
        <Button render={<Link href="/auth" />}>로그인하러 가기</Button>
      </article>
    );
  }

  const todos = authDb
    .prepare('SELECT id, text, done FROM my_todos WHERE user_id = ? ORDER BY id')
    .all(userId) as Todo[];

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">내 할 일</h1>
        <p className="text-sm text-muted-foreground">다른 아이디로 로그인하면 다른 목록이 보입니다.</p>
      </header>

      <form action={addTodo} className="flex max-w-md gap-2">
        <Input name="text" placeholder="할 일을 적어 주세요" required />
        <Button type="submit">추가</Button>
      </form>

      {todos.length === 0 ? (
        <p className="text-muted-foreground">아직 할 일이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 rounded-lg border p-3">
              <form action={toggleTodo}>
                <input type="hidden" name="id" value={todo.id} />
                <Button type="submit" variant={todo.done ? 'default' : 'outline'} size="sm">
                  {todo.done ? '끝남' : '할 일'}
                </Button>
              </form>
              <span className={todo.done ? 'text-muted-foreground line-through' : ''}>{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
