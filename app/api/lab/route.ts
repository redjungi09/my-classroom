// 화면의 버튼이 부르는 주소입니다: /api/lab
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { lessons } from '@/lib/lessons';
import { labStatus, sendRaw, startLab, stopLab } from '@/lib/runner';

// GET /api/lab?id=first-success → 실행 중인지와 터미널 출력
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return Response.json({ error: '없는 수업입니다.' }, { status: 404 });
  return Response.json(labStatus(lesson));
}

// POST /api/lab → 저장, 실행, 중지, 요청 보내기
export async function POST(request: Request) {
  // 이 주소는 컴퓨터에서 코드를 실행합니다. 다른 사이트가 몰래 부르지 못하게,
  // 브라우저가 다른 사이트에는 허락 없이 붙여 주지 않는 형식(JSON)만 받습니다.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'JSON 요청만 받습니다.' }, { status: 415 });
  }

  const body = await request.json();
  const lesson = lessons.find((item) => item.id === body.id);
  if (!lesson) return Response.json({ error: '없는 수업입니다.' }, { status: 404 });

  if (body.action === 'save') {
    // 수업 목록에 적힌 파일 하나만 고칠 수 있습니다.
    await writeFile(path.join(process.cwd(), lesson.folder, lesson.file), String(body.code));
    return Response.json({ saved: true });
  }
  if (body.action === 'start') {
    await startLab(lesson);
    return Response.json(labStatus(lesson));
  }
  if (body.action === 'stop') {
    await stopLab();
    return Response.json(labStatus(lesson));
  }
  if (body.action === 'request') {
    return Response.json({ response: await sendRaw(lesson.port, String(body.text)) });
  }
  return Response.json({ error: '모르는 동작입니다.' }, { status: 400 });
}
