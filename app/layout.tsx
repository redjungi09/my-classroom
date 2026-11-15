import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { ChatButton } from '@/components/chat-button';
import { ThemeButton } from '@/components/theme-button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { site, whereAmI, whoAmI } from '@/lib/site';
import './global.css';

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

// 모든 화면이 공통으로 쓰는 틀입니다. 왼쪽에 사이드바, 오른쪽에 본문이 들어갑니다.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 브라우저 확장 프로그램이 html 태그에 값을 덧붙여도 경고하지 않게 합니다.
    <html lang="ko" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar user={whoAmI()} place={whereAmI()} />
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
