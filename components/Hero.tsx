'use client';

import Image from 'next/image';
import NavLink from './NavLink';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { cn } from '@/utils/utils';

let heroImages = [
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png',
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png',
];

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-gray-600">
        <div className="space-y-5 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
            No More Wifi Passwords
          </h1>
          <h1 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
            Create QR Code in a few seconds
          </h1>
          <h2 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
            & Get Rid of Passwords forever
          </h2>
          <p className="max-w-xl mx-auto">Yoyo</p>
          <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
            <NavLink
              href="/start"
              className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
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
      </div>
    </section>
  );
}
