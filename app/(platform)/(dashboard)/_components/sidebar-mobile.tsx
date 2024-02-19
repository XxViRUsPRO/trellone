"use client";

import Mounted from "@/components/hoc/mounted";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Sidebar from "./sidebar";

const SidebarMobile = () => {
  const pathname = usePathname();

  const isOpen = useMobileSidebar((state) => state.isOpen);
  const open = useMobileSidebar((state) => state.open);
  const close = useMobileSidebar((state) => state.close);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      <Button
        className="block md:hidden"
        variant="ghost"
        size="sm"
        onClick={open}
      >
        <Menu className="w-4 h-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Mounted(SidebarMobile);
