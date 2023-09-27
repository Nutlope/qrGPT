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
  encrpytion,
}: {
  wifi_name: string;
  wifi_password: string;
  encrpytion: string;
}) => {
  const encyptValue = encrpytion === 'none' ? '' : encrpytion;
  return `WIFI:T:${encyptValue};S:${wifi_name};P:${wifi_password};H:;;`;
};
