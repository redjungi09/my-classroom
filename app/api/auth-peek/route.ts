// 인증 화면의 "저장된 것 보기"가 부르는 주소입니다: /api/auth-peek
// 가입과 로그인 때 DB에 무엇이 저장됐는지 읽기만 합니다.
import { authDb } from '@/lib/auth';

export async function GET() {
  return Response.json({
    // 가입한 사람
    users: authDb.prepare('SELECT username, name, createdAt FROM user ORDER BY createdAt').all(),
    // 비밀번호. 입력한 글자가 아니라 해시가 저장됩니다.
    passwords: authDb
      .prepare('SELECT user.username, account.password FROM account JOIN user ON user.id = account.userId')
      .all(),
    // 로그인할 때마다 생기는 세션. 토큰은 앞부분만 보여 줍니다.
    sessions: authDb
      .prepare(
        "SELECT user.username, substr(session.token, 1, 8) || '…' AS token, session.expiresAt FROM session JOIN user ON user.id = session.userId ORDER BY session.createdAt",
      )
      .all(),
  });
}
