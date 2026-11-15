import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { menu } from '@/lib/menu';
import { site, whereAmI } from '@/lib/site';

// 요청이 올 때마다 서버에서 새로 만듭니다. 그래야 "어디에서 실행 중인지"가 맞게 나옵니다.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">{site.name}</h1>
        <p>{site.description}</p>
        <p className="text-sm text-muted-foreground">
          이 페이지를 만든 서버: <strong>{whereAmI()}</strong>
        </p>
      </section>

      <section className="grid gap-4">
        {menu.map((group) => (
          <Link key={group.title} href={group.items[0].href}>
            <Card className="transition-colors hover:bg-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <group.icon className="size-4" />
                  {group.title}
                </CardTitle>
                <CardDescription>{group.summary}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
