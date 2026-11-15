import { AuthPanel } from './auth-panel';

export default function AuthPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">가입과 로그인</h1>
        <p>가입하고 로그인해 보고, 그때 DB에 무엇이 저장되는지 봅니다.</p>
        <p className="text-sm text-muted-foreground">
          계정은 이 서비스가 돌고 있는 컴퓨터의 <code className="font-mono">data/auth.sqlite</code> 파일에
          저장됩니다. 연습용이니 실제로 쓰는 비밀번호는 넣지 않습니다.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">해 볼 순서</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>가입하고, 아래 표에서 내 비밀번호가 어떤 모습으로 저장됐는지 봅니다.</li>
          <li>로그아웃했다가 로그인해 봅니다. 세션 표가 어떻게 바뀌나요?</li>
          <li>같은 비밀번호로 계정을 하나 더 만듭니다. 저장된 값이 서로 같은가요?</li>
          <li>틀린 비밀번호로 로그인해 봅니다.</li>
        </ol>
      </section>

      <AuthPanel />
    </article>
  );
}
