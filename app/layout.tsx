import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { ChatButton } from '@/components/chat-button';
import { ThemeButton } from '@/components/theme-button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { site, whereAmI, whoAmI } from '@/lib/site';
import './global.css';

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

// 모든 화면이 공통으로 쓰는 틀입니다. 왼쪽에 사이드바, 오른쪽에 본문이 들어갑니다.
export default async function RootLayout({ children }: { children: ReactNode }) {
  // 로그인했으면 그 아이디를, 아니면 Codespace의 GitHub 아이디를 사이드바 아래에 보여 줍니다.
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session ? `${session.user.username} (로그인함)` : whoAmI();

  return (
    // 브라우저 확장 프로그램이 html 태그에 값을 덧붙여도 경고하지 않게 합니다.
    <html lang="ko" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar user={user} place={whereAmI()} />
            <SidebarInset>
              <header className="flex h-12 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <span className="text-sm text-muted-foreground">{site.owner}</span>
                <ThemeButton />
              </header>
              <div className="mx-auto w-full max-w-3xl p-6">{children}</div>
            </SidebarInset>
            <ChatButton />
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
