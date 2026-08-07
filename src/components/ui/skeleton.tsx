import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

function DynamicSkeleton({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary animate-pulse rounded-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton, DynamicSkeleton };
