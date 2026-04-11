"use client";

import { useState } from "react";
import { addMember } from "@/app/actions/member";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface InviteMemberDialogProps {
  roomId: string;
  role: "EXAMINER" | "EXAMINEE";
}

export function InviteMemberDialog({ roomId, role }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRole = role === "EXAMINER" ? "Examiners" : "Examinees";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const res = await addMember(roomId, email, role);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`User invited as ${role.toLowerCase()} successfully!`);
      setOpen(false);
      setEmail("");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10 h-8 w-8 rounded-full"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Invite {displayRole}</DialogTitle>
            <DialogDescription>
              Invite a user to this room by entering their email address. They
              must already have an account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !email}>
              {isSubmitting ? "Inviting..." : "Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
