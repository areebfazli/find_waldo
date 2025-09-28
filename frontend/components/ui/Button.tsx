
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Button({className, ...props}: ComponentProps<"button">){
  return (
    <button
      className={cn(
        "btn-glass px-4 py-2 rounded-2xl2 rounded-2xl font-semibold",
        "text-gray-900",
        "hover:brightness-105 active:brightness-95",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
}
