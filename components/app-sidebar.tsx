'use client';

// 왼쪽 사이드바입니다. 메뉴 내용은 lib/menu.ts에 있고, 여기는 그리는 방법만 있습니다.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { menu } from '@/lib/menu';
import { site } from '@/lib/site';

export function AppSidebar({ user, place }: { user: string; place: string }) {
  // 지금 보고 있는 주소입니다. 같은 주소의 메뉴를 강조하는 데 씁니다.
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="px-2 py-1 text-base font-semibold">
          {site.name}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {menu.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href} render={<Link href={item.href} />}>
                      <group.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground">
          <div className="text-sm font-medium text-foreground">{user}</div>
          <div>{place}</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
