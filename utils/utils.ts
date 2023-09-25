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
  wifi_name,
  wifi_password,
}: {
  wifi_name: string;
  wifi_password: string;
}) => {
  return `WIFI:T:WPA;S:${wifi_name};P:${wifi_password};H:;;`;
};
