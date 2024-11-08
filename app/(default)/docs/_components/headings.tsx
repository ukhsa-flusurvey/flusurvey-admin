import { cn } from "@/lib/utils";

export const H1 = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
        className={cn(
            "font-heading mt-2 scroll-m-20 text-4xl font-bold",
            className
        )}
        {...props}
    />
)

export const H2 = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
        className={cn(
            "font-heading font-extrabold  first:pt-0 pt-4 scroll-m-20 pb-2 text-4xl tracking-tight first:mt-0",
            className
        )}
        {...props}
    />
)

export const H3 = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        className={cn(
            "font-heading mt-6 scroll-m-20 text-xl font-semibold tracking-tight",
            className
        )}
        {...props}
    />
)
