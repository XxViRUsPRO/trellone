import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 h-14 px-4 border-b shadow-sm bg-light flex items-center z-10">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="md:block md:w-auto w-full flex items-center justify-between space-x-4">
          <Button size="sm" variant="outline" asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button size="sm" variant="primary" asChild>
            <Link href="/sign-up">Get Trellone for free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
