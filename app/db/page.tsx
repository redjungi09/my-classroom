import { listTables } from '@/lib/practice-db';
import { SqlPanel } from './sql-panel';

export const dynamic = 'force-dynamic';

export default function DbPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">SQL 실행</h1>
        <p>SQL을 적어 실행하고, 표가 어떻게 바뀌는지 봅니다. 수업과 할 일, 두 표로 시작합니다.</p>
        <p className="text-sm text-muted-foreground">
          DB는 이 서비스가 돌고 있는 컴퓨터의 <code className="font-mono">data/practice.sqlite</code> 파일
          하나입니다. 망가져도 “처음 상태로”를 누르면 됩니다.
        </p>
      </header>

      <SqlPanel initialTables={listTables()} />
    </article>
  );
}
