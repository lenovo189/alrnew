"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

export function Logo({ width = 138, height = 37, className }: LogoProps) {
    return (
        <Link href="/dashboard" className={`flex items-center ${className}`}>
            <Image
                src="/logo.svg"
                alt="Learnifiy"
                width={width}
                height={height}
                priority
                className="object-contain"
            />
        </Link>
    );
}
