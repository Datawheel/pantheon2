"use client";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function SimpleTooltip({content, children, className, placement = "top"}) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={className} style={{display: "inline"}}>{children}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="radix-tooltip-content" side={placement} sideOffset={5}>
            {content}
            <Tooltip.Arrow className="radix-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
