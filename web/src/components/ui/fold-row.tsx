import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { StatusDot } from "@/components/status-badge";
import type { AgentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A row that folds what sits under it: the folded dashboard's machine and space rows (fork:
 * collapsible spaces). One tap target the full width of the row, at least 52px tall, with the worst
 * status as a dot in front, the name, a quiet `meta` run, and a chevron that turns when open.
 *
 * The dot's slot is always drawn, empty when nothing is reported, so a state that comes or goes
 * repaints the row and never moves its name (DESIGN.md §2). `trailing` is a SIBLING of the button,
 * never inside it, so a "+" beside the row is its own target and never folds the row.
 *
 * `tone="machine"` is the filled band a crew machine wears; `tone="space"` is the plain row its
 * spaces wear under it, indented so the eye reads the nesting.
 */
export function FoldRow({
  label,
  open,
  onToggle,
  controls,
  status,
  statusLabel,
  meta,
  trailing,
  tone,
  level = 2,
  id,
  className,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  /** The id of what this row folds, wired to `aria-controls` only while it is rendered. */
  controls?: string;
  /** The worst state inside, drawn as its dot; omit when there is nothing to report. */
  status?: AgentStatus;
  /** Name the dot for a screen reader when nothing else in the row says the state in words. */
  statusLabel?: string;
  meta?: ReactNode;
  trailing?: ReactNode;
  tone: "machine" | "space";
  level?: 2 | 3;
  id?: string;
  className?: string;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <div
      data-slot="fold-row"
      className={cn(
        "flex items-center gap-1",
        tone === "machine" ? "rounded-lg bg-card pr-2 shadow-xs" : "rounded-md pr-1",
        className,
      )}
    >
      <Heading id={id} className="flex min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          {...(controls && open ? { "aria-controls": controls } : {})}
          className={cn(
            "flex min-h-13 min-w-0 flex-1 items-center gap-3 text-left transition-colors active:bg-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            tone === "machine"
              ? "rounded-lg px-4 text-[15px] font-semibold text-foreground"
              : "rounded-md pl-4 pr-2 text-[15px] font-medium text-foreground",
          )}
        >
          <span className="flex size-2.5 shrink-0 items-center justify-center" aria-hidden>
            {status && (
              <StatusDot status={status} surface={tone === "machine" ? "bg-card" : "bg-background"} className="size-2.5" />
            )}
          </span>
          {/* The name is read first, then the state, then the counts, each set off by a comma, so a
              screen reader says "bluefin, needs you, 2 workspaces" rather than one run-on word. */}
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {status && statusLabel && <span className="sr-only">, {statusLabel}</span>}
          {meta !== undefined && (
            <span className="flex shrink-0 items-center gap-2 text-xs font-normal text-muted-foreground">
              <span className="sr-only">, </span>
              {meta}
            </span>
          )}
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-90",
            )}
            aria-hidden
          />
        </button>
      </Heading>
      {trailing && <span className="flex shrink-0 items-center">{trailing}</span>}
    </div>
  );
}
