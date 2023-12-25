import React from "react";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";
import CardList from "./card";
import data from "./list.json";

const oswald = Oswald({ subsets: ["latin"] });
const source_sans = Source_Sans_3({ subsets: ["latin"] });

const Panduan = () => {
  return (
    <div className="h-screen py-3 relative overflow-hidden flex items-center justify-center bg-sky-600">
      <div className="max-w-md max-h-[calc(100vh-100px)] relative z-20 overflow-auto bg-white mx-auto pb-8 pt-4 w-full rounded-2xl shadow-lg">
        <div className="flex items-center justify-center px-2 gap-4 mb-6">
          <Link
            href={"/"}
            className="w-12 aspect-square flex hover:bg-gray-200 items-center justify-center border rounded-md"
          >
            <ArrowLeftIcon />
          </Link>
          <h3
            className={cn(
              "text-xl py-4 font-semibold ml-auto mr-auto",
              oswald.className
            )}
          >
            PANDUAN PENGGUNAAN
          </h3>
        </div>
        <div
          className={cn(
            "flex flex-col overflow-auto gap-8",
            source_sans.className
          )}
        >
          {data.length ? data.map((item) => <CardList item={item} />) : null}
        </div>
      </div>
      <div className="absolute -top-32 -right-32 h-60 md:h-[400px] aspect-square border-[32px] md:border-[70px] border-sky-300/40 rounded-full"></div>
      <div className="absolute -bottom-32 -left-32 h-60 md:h-[320px] aspect-square border-[32px] md:border-[70px] border-sky-300/40 rounded-full"></div>
    </div>
  );
};

export default Panduan;
