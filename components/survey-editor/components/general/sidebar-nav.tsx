"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    formIndex?: number,
    items: {
        title: string,
        href: string,
        navOnClick?: () => void,
    }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    //const pathname = usePathname()

    return (

        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
        >
            {items.map((item) => (
                <Link
                    href={item.href}
                    onClick={item.navOnClick}
                    key={item.title}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        props.formIndex === items.indexOf(item)
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>

    )
}
