import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import SidebarMobile from "./sidebar-mobile";
import FormPopover from "@/components/form/form-popover";

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 h-14 px-4 border-b shadow-sm bg-white flex items-center z-10">
      <SidebarMobile />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" side="bottom" sideOffset={12}>
          <div>
            <Button
              variant="primary"
              size="sm"
              className="hidden md:block h-auto py-1.5 px-2 rounded-sm"
            >
              Create
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="block md:hidden rounded-sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export { Navbar };
