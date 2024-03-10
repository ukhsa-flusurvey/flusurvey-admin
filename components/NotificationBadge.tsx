import React from 'react';

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "absolute top-[-3px] right-[-3px] size-[7px] rounded-full",
    {
        variants: {
            variant: {
                default: "bg-slate-900",
                warning: "bg-yellow-500",
            },
            animation: {
                pulse: "animate-pulse",
                bounce: "animate-bounce",
                ping: "animate-ping",
                none: "",
            },
        },
        defaultVariants: {
            variant: "default",
            animation: "ping",
        },
    }
)

export interface NotificationBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    isInvisible?: boolean;
}


const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className, variant, animation, ...props }) => {
    return (
        <div className='relative'>
            {props.children}

            {!props.isInvisible && (
                <div>
                    <div className={
                        cn(badgeVariants({ variant, animation, className }))
                    }></div>
                    {animation === 'ping' && <div className={
                        cn(badgeVariants({ variant, animation: 'none', className }))
                    }></div>}
                </div>
            )}
        </div>
    );
};

export default NotificationBadge;
