// DB 화면의 버튼이 부르는 주소입니다: /api/sql
import { listTables, resetPractice, runSql } from '@/lib/practice-db';

// GET /api/sql → 지금 있는 표 목록
export async function GET() {
  return Response.json({ tables: listTables() });
}

// POST /api/sql → SQL 실행, 처음 상태로 되돌리기
export async function POST(request: Request) {
  // 다른 사이트가 몰래 부르지 못하게 JSON 요청만 받습니다. (app/api/lab/route.ts와 같은 이유)
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'JSON 요청만 받습니다.' }, { status: 415 });
  }

  const body = await request.json();

  if (body.action === 'reset') {
    resetPractice();
    return Response.json({ message: '처음 상태로 되돌렸습니다.', tables: listTables() });
  }
  if (body.action === 'run') {
    return Response.json({ ...runSql(String(body.sql)), tables: listTables() });
  }
  return Response.json({ error: '모르는 동작입니다.' }, { status: 400 });
}
