import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <i
      role="status"
      aria-label="Loading"
      className={cn("fa-solid fa-spinner animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
