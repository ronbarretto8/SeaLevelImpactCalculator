import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center group", className)}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full transition-all duration-200 group-hover:h-2"
      style={{ background: "hsl(var(--muted))" }}
    >
      <SliderPrimitive.Range
        className="absolute h-full rounded-full"
        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(200 90% 45%))" }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-5 w-5 sm:h-4 sm:w-4 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-125 touch-manipulation"
      style={{
        background: "hsl(var(--primary))",
        border: "2px solid hsl(var(--primary))",
        boxShadow: "0 0 0 3px hsl(var(--background)), 0 0 16px hsl(var(--primary) / 0.4)",
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
