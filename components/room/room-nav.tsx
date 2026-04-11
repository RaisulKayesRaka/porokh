"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface RoomNavProps {
  roomId: string;
  isExaminer?: boolean; // Kept as optional incase we need it later
}

export function RoomNav({ roomId }: RoomNavProps) {
  const pathname = usePathname();

  const links = [
    {
      name: "Exams",
      href: `/rooms/${roomId}/exams`,
      active: pathname.startsWith(`/rooms/${roomId}/exams`),
    },
    {
      name: "Members",
      href: `/rooms/${roomId}/members`,
      active: pathname === `/rooms/${roomId}/members`,
    },
  ];

  return (
    <nav className="mb-6 flex space-x-6 border-b pb-4">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "hover:text-primary text-sm font-medium transition-colors",
            link.active
              ? "text-primary border-primary -mb-4 border-b-2 pb-4"
              : "text-muted-foreground",
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
