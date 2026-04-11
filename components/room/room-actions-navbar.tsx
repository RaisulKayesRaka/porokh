"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JoinRoomDialog } from "@/components/room/join-room-dialog";
import { CreateRoomDialog } from "@/components/room/create-room-dialog";

export function RoomActionsNavbar() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="hidden gap-2 md:flex">
        <JoinRoomDialog>
          <Button variant="outline" size="sm">
            Join Room
          </Button>
        </JoinRoomDialog>
        <CreateRoomDialog>
          <Button size="sm">Create Room</Button>
        </CreateRoomDialog>
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus />
              <span className="sr-only">Join or Create Room</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem onSelect={() => setJoinOpen(true)}>
              Join Room
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
              Create Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <JoinRoomDialog open={joinOpen} onOpenChange={setJoinOpen} />
      <CreateRoomDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
