import Image from "next/image";
import React from "react";

import { Oswald, Source_Sans_3 } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const oswald = Oswald({ subsets: ["latin"] });
const source_sans = Source_Sans_3({ subsets: ["latin"] });

const Header = () => {
  return (
    <div className="text-center h-screen relative overflow-hidden flex items-center justify-center bg-sky-600">
      <div className="max-w-md mx-auto flex justify-center items-center flex-col py-8">
        <Image alt="makan" src="/icon_launcher.png" width={84} height={84} />
        <div className="flex flex-col mt-3 mx-4">
          <h3
            className={cn("text-white text-xl font-semibold", oswald.className)}
          >
            Aplikasi Kesegaran Ikan Laut
          </h3>
          <p className={cn("text-white mt-1 text-xs", source_sans.className)}>
            Aplikasi Android Berbasis Machine Lerning Untuk Mendeteksi
            Kesegeragan Ikan Laut (Selar Como dan Kembung)
          </p>
          <div className="mt-8 mx-6 flex flex-col items-center gap-4 justify-center text-white">
            <Link
              href={"/ikanSegarV10.apk"}
              className={cn(
                "w-full border shadow-button border-lime-500 bg-gradient-to-b from-lime-500 to-lime-600 hover:from-green-500 hover:to-green-600  py-2 px-2 rounded-lg",
                source_sans.className
              )}
            >
              Download Aplikasi
            </Link>
            <Link
              href={"/panduan"}
              className={cn(
                "w-full text-gray-500 bg-white hover:bg-gray-200  py-2 px-2 rounded-lg",
                source_sans.className
              )}
            >
              Panduan Penggunaan
            </Link>
            <Link
              href={"/ikanSegarV9.apk"}
              className={cn(
                "w-full underline underline-offset-4",
                source_sans.className
              )}
            >
              Download Versi Lama
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute -top-32 -right-32 h-60 md:h-[400px] aspect-square border-[32px] md:border-[70px] border-sky-300/40 rounded-full"></div>
      <div className="absolute -bottom-32 -left-32 h-60 md:h-[320px] aspect-square border-[32px] md:border-[70px] border-sky-300/40 rounded-full"></div>
    </div>
  );
};

export default Header;
