'use client';

import Image from 'next/image';
import NavLink from './NavLink';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { cn } from '@/utils/utils';
import Body from './Body';
import { FAQ } from './FAQ';

let heroImages = [
  '/8.png',
  '/1.png',
  '/4.png',
  '/13.png',
  '/2.png',
  '/3.png',
  '/5.png',
  '/6.png',
  '/7.png',
];

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28">
        <div className="space-y-5 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
            No More Wifi Passwords
          </h1>
          <h1 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
            1) create wifi qr code (with cool art)
          </h1>
          <h1 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
            2) print it
          </h1>
          <h1 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
            3) forget about your password
          </h1>

          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="#gen-qr"
              className="text-white bg-blue-700 hover:bg-blue-500 active:bg-blue-700 "
            >
              Generate your Wifi QR Code
            </NavLink>
          </div>
          <ScrollArea>
            <div className="flex space-x-2 pb-4">
              {heroImages.map((image, idx) => (
                <Image
                  key={idx}
                  alt="image"
                  src={image}
                  width={240}
                  height={240}
                  className={cn(
                    'h-auto w-auto object-cover transition-all hover:scale-105',
                    'aspect-square',
                  )}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Body />
        <FAQ />
      </div>
    </section>
  );
}
