import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { lessons } from '@/lib/lessons';
import { LabPanel } from './lab-panel';

export const dynamic = 'force-dynamic';

// 주소가 /lessons/first-success 이면 id에 'first-success'가 들어옵니다.
export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) notFound();

  // 실습 코드를 파일에서 읽어 화면에 넘겨 줍니다.
  const code = await readFile(path.join(process.cwd(), lesson.folder, lesson.file), 'utf8');

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">해 볼 순서</h2>
        <ol className="list-decimal space-y-1 pl-6">
          {lesson.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <LabPanel id={lesson.id} file={lesson.file} port={lesson.port} initialCode={code} />

      <p className="text-sm text-muted-foreground">
        자세한 안내는 <code className="font-mono">{lesson.folder}/README.md</code>에 있습니다.
      </p>
    </article>
  );
}
