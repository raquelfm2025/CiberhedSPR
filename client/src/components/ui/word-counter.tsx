import * as React from "react";
import { cn } from "@/lib/utils";

interface WordCounterProps {
  text: string;
  limit: number;
  className?: string;
}

export function WordCounter({ text, limit, className }: WordCounterProps) {
  const wordCount = React.useMemo(() => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  }, [text]);

  const isExceeded = wordCount > limit;

  return (
    <div className={cn("text-xs text-right", className)}>
      <span className={cn(isExceeded ? "text-red-600 font-medium" : "text-gray-500")}>
        {wordCount}
      </span>
      <span className="text-gray-500">/{limit} words</span>
    </div>
  );
}
