## No More Wifi Passwords

This is a fun project to get rid of wifi passwords so we never have to remember them again. I took big inspiration from [qrGpt repo](https://github.com/Nutlope/qrGPT) that had a lot of the basics already set up (this repo is forked from it)

Generate wifi qr codes so you never have to memorize or pass long strings to your guests ever again

## Tech Stack

- Next.js [App Router](https://nextjs.org/docs/app)
- [Replicate](https://replicate.com/) for the AI model
- [Vercel Blob](https://vercel.com/storage/blob) for image storage
- [Vercel KV](https://vercel.com/storage/kv) for redis storage and rate limiting
- [Shadcn UI](https://ui.shadcn.com/) for the component library

## Deploy Your Own

Note that you'll need to:

- Set up [Replicate](https://replicate.com)
- Set up [Vercel KV](https://vercel.com/docs/storage/vercel-kv/quickstart)
- Set up [Vercel Blob](https://vercel.com/docs/storage/vercel-blob/quickstart)

## Authors

- Andriy Kulak ([@emergingbits](https://twitter.com/emergingbits))

## Credits

- original qrGpt authors are: Hassan El Mghari ([@nutlope](https://twitter.com/nutlope)) & Kevin Hou ([@kevinhou22](https://twitter.com/kevinhou22))
- [Lim Zi Yang](https://github.com/ZYLIM0702) for the original AI model
