'use client';

// 브라우저에서 움직이는 부분입니다. 가입·로그인은 /api/auth/... 로, 저장된 것 보기는 /api/auth-peek 로 요청합니다.
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { authClient } from '@/lib/auth-client';

type Row = Record<string, string>;
type Stored = { users: Row[]; passwords: Row[]; sessions: Row[] };

const box = 'rounded-lg border bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap';

// 표 하나를 그립니다. 열 이름은 첫 줄에서 가져옵니다.
function StoredTable({ title, note, rows }: { title: string; note: string; rows: Row[] }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{note}</p>
      {rows.length === 0 ? (
        <pre className={box}>아직 없습니다.</pre>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(rows[0]).map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, cell) => (
                    <TableCell key={cell} className="font-mono break-all whitespace-normal">{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function AuthPanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [stored, setStored] = useState<Stored>({ users: [], passwords: [], sessions: [] });

  // 지금 로그인한 사람입니다. 로그인 상태가 바뀌면 알아서 다시 그려집니다.
  const session = authClient.useSession();
  const me = session.data?.user.username;

  async function refresh() {
    setStored(await fetch('/api/auth-peek').then((response) => response.json()));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function signUp() {
    // Better Auth는 이메일이 꼭 있어야 해서, 아이디로 연습용 이메일을 만들어 넣습니다.
    const result = await authClient.signUp.email({
      username,
      password,
      name: username,
      email: `${username}@classroom.local`,
    });
    setMessage(result.error ? `거절됨: ${result.error.message}` : `${username} 계정을 만들고 로그인했습니다.`);
    refresh();
  }

  async function signIn() {
    const result = await authClient.signIn.username({ username, password });
    setMessage(result.error ? `거절됨: ${result.error.message}` : `${username}(으)로 로그인했습니다.`);
    refresh();
  }

  async function signOut() {
    await authClient.signOut();
    setMessage('로그아웃했습니다.');
    refresh();
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. 가입 · 로그인</h2>
        <div className="flex items-center gap-2 text-sm">
          지금 로그인한 사람:
          <Badge variant={me ? 'default' : 'secondary'}>{me ?? '없음'}</Badge>
        </div>
        <div className="grid max-w-sm gap-2">
          <Input placeholder="아이디 (영문 3자 이상)" value={username} onChange={(event) => setUsername(event.target.value)} />
          <Input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={signUp}>가입</Button>
          <Button variant="outline" onClick={signIn}>로그인</Button>
          <Button variant="outline" onClick={signOut} disabled={!me}>로그아웃</Button>
        </div>
        <pre className={box}>{message || '가입하거나 로그인하면 결과가 여기에 나옵니다.'}</pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">2. DB에 저장된 것</h2>
        <StoredTable title="user 표" note="가입한 사람입니다." rows={stored.users} />
        <StoredTable
          title="account 표"
          note="비밀번호입니다. 입력한 글자가 그대로 있나요?"
          rows={stored.passwords}
        />
        <StoredTable
          title="session 표"
          note="로그인할 때마다 한 줄이 생깁니다. 브라우저는 이 토큰을 쿠키로 들고 다닙니다."
          rows={stored.sessions}
        />
      </section>
    </div>
  );
}
