'use client';

// 오른쪽 아래의 AI 도우미입니다. 크롬에 들어 있는 AI를 써서 서버도 키도 필요 없습니다.
// 내장 AI가 없는 브라우저에서는 버튼 자체가 나오지 않습니다.
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 도우미의 성격입니다. 말투나 역할을 바꾸려면 이 문장을 고칩니다.
const personality =
  '너는 레드준기의 네트워크 교실 도우미야. 친절한 선배처럼 반말로, 네트워크, DB, 인증 질문에 한국어로 쉽게 답해. 세 문장을 넘기지 말고, 꾸미는 기호 없이 문장으로만 답해.';

type Message = { from: 'me' | 'ai'; text: string };
// promptStreaming은 답을 한꺼번에 주지 않고, 만들어지는 대로 조각조각 줍니다.
type Session = { promptStreaming(text: string): AsyncIterable<string> };

// 크롬이 웹페이지에 제공하는 내장 AI입니다. 여기서 쓰는 기능만 적어 둡니다.
declare const LanguageModel: {
  availability(): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
  create(options: object): Promise<Session>;
};

export function ChatButton() {
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const session = useRef<Promise<Session> | null>(null);
  const list = useRef<HTMLDivElement>(null);

  // 이 브라우저에 내장 AI가 있는지 확인합니다. 없으면 supported가 false로 남아 아무것도 그리지 않습니다.
  useEffect(() => {
    if (typeof LanguageModel === 'undefined') return;
    LanguageModel.availability().then((state) => setSupported(state !== 'unavailable'));
  }, []);

  // 새 말이 생기면 대화창을 맨 아래로 내립니다.
  useEffect(() => {
    list.current?.scrollTo(0, list.current.scrollHeight);
  }, [messages, busy]);

  // AI를 준비합니다. 모델을 올리느라 처음 한 번은 몇 초 걸려서, 대화창을 열 때 미리 시작해 둡니다.
  function prepare() {
    session.current ??= LanguageModel.create({ initialPrompts: [{ role: 'system', content: personality }] });
    return session.current;
  }

  function toggle() {
    if (!open) prepare();
    setOpen(!open);
  }

  async function send() {
    const question = input.trim();
    if (!question || busy) return;
    setInput('');
    setBusy(true);
    setMessages((before) => [...before, { from: 'me', text: question }]);
    try {
      const ai = await prepare();
      // 빈 말풍선을 먼저 만들고, 답 조각이 올 때마다 뒤에 이어 붙입니다.
      setMessages((before) => [...before, { from: 'ai', text: '' }]);
      for await (const piece of ai.promptStreaming(question)) {
        setMessages((before) => [...before.slice(0, -1), { from: 'ai', text: before.at(-1)!.text + piece }]);
      }
    } catch (error) {
      session.current = null;
      setMessages((before) => [...before, { from: 'ai', text: `답하지 못했습니다: ${(error as Error).message}` }]);
    }
    setBusy(false);
  }

  if (!supported) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="flex h-96 w-80 flex-col rounded-xl border bg-background shadow-lg">
          <div className="border-b px-3 py-2 text-sm font-medium">
            AI 도우미 <span className="text-xs font-normal text-muted-foreground">· 크롬 내장 AI라 틀릴 수 있어요</span>
          </div>

          <div ref={list} className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
            {messages.length === 0 && (
              <p className="text-muted-foreground">
                무엇이든 물어보세요. 질문은 이 컴퓨터 밖으로 나가지 않습니다. 첫 답은 조금 걸립니다.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.from === 'me'
                    ? 'ml-8 rounded-lg bg-primary px-3 py-2 text-primary-foreground'
                    : 'mr-8 rounded-lg bg-muted px-3 py-2 whitespace-pre-wrap'
                }
              >
                {message.text}
              </div>
            ))}
            {busy && messages.at(-1)?.from === 'me' && <p className="text-muted-foreground">생각하는 중…</p>}
          </div>

          <form
            className="flex gap-2 border-t p-2"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <Input placeholder="질문 입력" value={input} onChange={(event) => setInput(event.target.value)} />
            <Button type="submit" disabled={busy}>보내기</Button>
          </form>
        </div>
      )}

      <Button
        className="size-12 rounded-full shadow-lg"
        aria-label={open ? 'AI 도우미 닫기' : 'AI 도우미 열기'}
        onClick={toggle}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
