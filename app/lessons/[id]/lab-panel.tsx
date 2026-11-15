'use client';

// 브라우저에서 움직이는 부분입니다. 버튼을 누르면 /api/lab 에 요청을 보냅니다.
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = { id: string; file: string; port: number; initialCode: string };

// 글자를 그대로 보여 주는 상자의 모양입니다.
const box = 'min-h-14 rounded-lg border bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap';

// /api/lab 에 JSON을 보내고, JSON 응답을 받습니다.
async function callLab(body: object) {
  const response = await fetch('/api/lab', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}

export function LabPanel({ id, file, port, initialCode }: Props) {
  const [code, setCode] = useState(initialCode);
  const [saved, setSaved] = useState(true);
  const [alive, setAlive] = useState(false);
  const [log, setLog] = useState('');
  const [requestText, setRequestText] = useState('GET / HTTP/1.0');
  const [responseText, setResponseText] = useState('');

  // 1초마다 서버에 물어봐서 실행 상태와 터미널 출력을 새로 받아 옵니다.
  useEffect(() => {
    const refresh = async () => {
      try {
        const status = await fetch(`/api/lab?id=${id}`).then((response) => response.json());
        setAlive(status.alive);
        setLog(status.log);
      } catch {
        // 내 교실 서버(npm run dev)를 껐다 켜는 동안에는 답이 오지 않습니다. 다음 차례에 다시 묻습니다.
      }
    };
    refresh();
    const timer = setInterval(refresh, 1000);
    return () => clearInterval(timer);
  }, [id]);

  async function save() {
    await callLab({ id, action: 'save', code });
    setSaved(true);
  }

  async function start() {
    const status = await callLab({ id, action: 'start' });
    setAlive(status.alive);
    setLog(status.log);
  }

  async function stop() {
    const status = await callLab({ id, action: 'stop' });
    setAlive(status.alive);
    setLog(status.log);
  }

  async function send() {
    const result = await callLab({ id, action: 'request', text: requestText });
    setResponseText(result.response);
  }

  // HTTP 응답은 빈 줄을 기준으로 앞은 머리말, 뒤는 본문입니다. 본문만 떼어 냅니다.
  const body = responseText.startsWith('HTTP/')
    ? responseText.split('\r\n\r\n').slice(1).join('\r\n\r\n')
    : '';

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. 코드 · {file}</h2>
        <Textarea
          className="font-mono"
          rows={18}
          spellCheck={false}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setSaved(false);
          }}
        />
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saved}>파일에 저장</Button>
          <span className="text-sm text-muted-foreground">
            {saved ? '저장됨' : '아직 저장하지 않았습니다.'}
          </span>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. 서버 켜기</h2>
        <p className="text-sm text-muted-foreground">
          위 파일을 node로 실행해 서버를 켭니다. 서버는 켜진 뒤 요청이 올 때까지 기다리기만 합니다.
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={start}>{alive ? '서버 껐다 켜기' : '서버 켜기'}</Button>
          <Button variant="outline" onClick={stop} disabled={!alive}>서버 끄기</Button>
          <Badge variant={alive ? 'default' : 'secondary'}>
            {alive ? `서버 켜짐 · 포트 ${port}` : '서버 꺼짐'}
          </Badge>
        </div>
        <h3 className="pt-2 text-sm font-medium text-muted-foreground">서버 터미널 출력</h3>
        <pre className={box}>
          {log || (alive ? '서버가 요청을 기다리는 중입니다. 아래 3번에서 요청을 보내 보세요.' : '서버가 꺼져 있습니다.')}
        </pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. 요청 보내기</h2>
        <p className="text-sm text-muted-foreground">
          브라우저가 주소를 열 때 하는 일을 여기서 직접 합니다. 아래 글자를 그대로 포트 {port}에 보냅니다.
          고쳐서 보내 봐도 됩니다.
        </p>
        <Textarea
          className="font-mono"
          rows={3}
          spellCheck={false}
          value={requestText}
          onChange={(event) => setRequestText(event.target.value)}
        />
        <Button onClick={send}>요청 보내기</Button>

        <h3 className="pt-2 text-sm font-medium text-muted-foreground">응답 원문</h3>
        <pre className={box}>{responseText || '요청을 보내면 서버가 돌려준 글자가 여기에 나옵니다.'}</pre>

        <h3 className="pt-2 text-sm font-medium text-muted-foreground">브라우저가 그린 화면</h3>
        {body ? (
          // 본문을 HTML로 그립니다. sandbox는 그 안의 스크립트가 실행되지 못하게 막습니다.
          <iframe
            className="h-36 w-full rounded-lg border bg-white"
            title="응답 본문을 그린 화면"
            sandbox=""
            srcDoc={body}
          />
        ) : (
          <pre className={box}>응답을 받으면 본문을 브라우저처럼 그려서 보여 줍니다.</pre>
        )}
      </section>
    </div>
  );
}
