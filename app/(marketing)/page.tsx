import React from "react";
import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const calsans = localFont({ src: "../../public/fonts/font.woff2" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div
        className={cn(
          "flex items-center justify-center flex-col",
          calsans.className
        )}
      >
        <div className="flex items-center border shadow-sm mb-4 p-4 rounded-full bg-amber-100 text-amber-700 uppercase">
          <Medal className="h-6 w-6 mr-2" />
          <span>#1 in tasks management</span>
        </div>
        <h1 className="text-3xl md:text-6xl text-neutral-800 mb-6">
          Trellone helps your team move
        </h1>
        <p className="text-3xl md:text-6xl bg-[linear-gradient(to_top_right,#64C2DB,#7476ED,#C994DF,#E56F8C)] text-white px-4 p-2 rounded-md w-fit">
          work forward.
        </p>
      </div>
      <div
        className={cn(
          "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
          poppins.className
        )}
      >
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is
        unique—accomplish it all with Trellone.
      </div>
      <Button className="mt-6" variant="primary" size="lg" asChild>
        <Link href="/sign-up">Get started</Link>
      </Button>
    </div>
  );
};

export default MarketingPage;
