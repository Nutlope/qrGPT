import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
);

export const generateWifiStr = ({
  wifiName,
  wifiPassword,
}: {
  wifiName: string;
  wifiPassword: string;
}) => {
  return `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};H:;;`;
};
