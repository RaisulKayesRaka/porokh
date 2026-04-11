"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MoveQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPosition: number;
  totalQuestions: number;
  onMove: (newPosition: number) => void;
}

export function MoveQuestionDialog({
  isOpen,
  onOpenChange,
  ...props
}: MoveQuestionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Use key to reset state when dialog opens for a different question or re-opens */}
      <MoveQuestionDialogInner 
        key={isOpen ? `open-${props.currentPosition}` : 'closed'} 
        onClose={() => onOpenChange(false)} 
        {...props} 
      />
    </Dialog>
  );
}

function MoveQuestionDialogInner({
  currentPosition,
  totalQuestions,
  onMove,
  onClose,
}: Omit<MoveQuestionDialogProps, "isOpen" | "onOpenChange"> & { onClose: () => void }) {
  const [moveType, setMoveType] = useState<string>("beginning");
  const [customPosition, setCustomPosition] = useState<number>(currentPosition);

  const handleMove = () => {
    let newPos = currentPosition;
    switch (moveType) {
      case "beginning":
        newPos = 1;
        break;
      case "end":
        newPos = totalQuestions;
        break;
      case "up":
        newPos = Math.max(1, currentPosition - 1);
        break;
      case "down":
        newPos = Math.min(totalQuestions, currentPosition + 1);
        break;
      case "custom":
        newPos = Math.max(1, Math.min(totalQuestions, customPosition));
        break;
    }
    onMove(newPos);
    onClose();
  };

  const isUpDisabled = currentPosition === 1;
  const isDownDisabled = currentPosition === totalQuestions;
  const isMoved =
    (currentPosition !== 1 && moveType === "beginning") ||
    (currentPosition !== totalQuestions && moveType === "end") ||
    (!isUpDisabled && moveType === "up") ||
    (!isDownDisabled && moveType === "down") ||
    (moveType === "custom" &&
      customPosition !== currentPosition &&
      customPosition >= 1 &&
      customPosition <= totalQuestions);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Move Question</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-muted-foreground mb-4 text-sm">
          Current position: {currentPosition} of {totalQuestions}
        </p>
        <RadioGroup
          value={moveType}
          onValueChange={setMoveType}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="beginning"
              id="beginning"
              disabled={isUpDisabled}
            />
            <Label
              htmlFor="beginning"
              className={isUpDisabled ? "text-muted-foreground" : ""}
            >
              Move to beginning
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="end" id="end" disabled={isDownDisabled} />
            <Label
              htmlFor="end"
              className={isDownDisabled ? "text-muted-foreground" : ""}
            >
              Move to end
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="up" id="up" disabled={isUpDisabled} />
            <Label
              htmlFor="up"
              className={isUpDisabled ? "text-muted-foreground" : ""}
            >
              Move up 1 position
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="down"
              id="down"
              disabled={isDownDisabled}
            />
            <Label
              htmlFor="down"
              className={isDownDisabled ? "text-muted-foreground" : ""}
            >
              Move down 1 position
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="custom" id="custom" className="mt-1" />
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="custom">Move to specific position</Label>
              {moveType === "custom" && (
                <Input
                  type="number"
                  min={1}
                  max={totalQuestions}
                  value={customPosition || ""}
                  onChange={(e) =>
                    setCustomPosition(parseInt(e.target.value) || 1)
                  }
                  className="mt-2 w-full"
                />
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleMove} disabled={!isMoved}>
          Move
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
