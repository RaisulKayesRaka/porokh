"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Boxes,
  LayoutDashboard,
  ChevronsUpDown,
  LogOutIcon,
  BadgeCheckIcon,
  FileText,
  Users,
  ArrowLeft,
  Settings,
} from "lucide-react";
import { getRoomBrief } from "@/app/actions/room";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  // Detect room context from URL
  const roomMatch = pathname.match(/^\/rooms\/([^/]+)/);
  const roomId = roomMatch ? roomMatch[1] : null;

  const [roomName, setRoomName] = React.useState<string | null>(null);
  const [isExaminer, setIsExaminer] = React.useState(false);

  React.useEffect(() => {
    if (roomId) {
      getRoomBrief(roomId).then((res) => {
        if (res.success && res.room) {
          setRoomName(res.room.name);
          setIsExaminer(res.role === "EXAMINER");
        }
      });
    } else {
      setRoomName(null);
      setIsExaminer(false);
    }
  }, [roomId]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center">
                  <Image
                    src="/porokh.svg"
                    alt="Porokh Logo"
                    width={20}
                    height={20}
                    className="invert dark:invert-0"
                  />
                </div>
                <span className="truncate font-bold text-lg">Porokh</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        {!roomId ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/rooms"}
                  >
                    <Link href="/rooms">
                      <Boxes />
                      <span>Rooms</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-muted-foreground hover:text-foreground">
                    <Link href="/rooms">
                      <ArrowLeft className="h-4 w-4" />
                      <span>All Rooms</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Room Context Navigation — only visible inside a room */}
        {roomId && (
          <SidebarGroup className="pt-0">
            <SidebarGroupLabel className="truncate pr-2 font-semibold text-primary/80">
              {roomName || "Current Room"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(`/rooms/${roomId}/exams`)}
                  >
                    <Link href={`/rooms/${roomId}/exams`}>
                      <FileText />
                      <span>Exams</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/rooms/${roomId}/members`}
                  >
                    <Link href={`/rooms/${roomId}/members`}>
                      <Users />
                      <span>Members</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isExaminer && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/rooms/${roomId}/settings`}
                    >
                      <Link href={`/rooms/${roomId}/settings`}>
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.substring(0, 2).toUpperCase() || "ME"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "Loading..."}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "..."}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex w-full cursor-pointer flex-row items-center gap-2">
                      <BadgeCheckIcon className="size-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex w-full cursor-pointer flex-row items-center gap-2"
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/login";
                    }}
                  >
                    <LogOutIcon className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
