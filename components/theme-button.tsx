'use client';

// 밝은 테마와 어두운 테마를 바꾸는 버튼입니다.
// html 태그에 dark 클래스를 붙이면 app/global.css의 .dark 색이 쓰입니다.
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeButton() {
  const [dark, setDark] = useState(false);

  // 처음 열 때, 지난번에 고른 테마를 브라우저 저장소에서 꺼내 씁니다.
  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', saved);
    setDark(saved);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="테마 바꾸기" className="ml-auto">
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
