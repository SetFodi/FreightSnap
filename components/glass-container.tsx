"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    variant?: "default" | "intense" | "subtle";
}

export function GlassContainer({
    children,
    className,
    variant = "default",
    ...props
}: GlassContainerProps) {
    const variantClasses = {
        default: "glass",
        intense: "glass-intense",
        subtle: "glass-subtle",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                variantClasses[variant],
                "rounded-2xl",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
