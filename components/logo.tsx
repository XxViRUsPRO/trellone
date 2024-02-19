import React from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const calsans = localFont({ src: "../public/fonts/font.woff2" });

type Props = {} & React.HTMLAttributes<HTMLDivElement>;

const Logo = (props: Props) => {
  return (
    <Link href="/">
      <div
        {...props}
        className={cn(
          "hidden md:flex items-center gap-x-2 transition-opacity hover:opacity-75",
          props.className,
          calsans.className
        )}
      >
        <Image src="/logo.svg" alt="logo" height={40} width={40} />
        <span className="text-xl text-neutral-700">Trellone</span>
      </div>
    </Link>
  );
};

export default Logo;
