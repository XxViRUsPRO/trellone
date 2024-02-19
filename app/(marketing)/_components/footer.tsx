import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 inset-x-0 p-4 border-t bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between flex-row-reverse">
        <Logo />
        <div className="md:block md:w-auto w-full flex items-center justify-between space-x-4">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of Service
          </Button>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
