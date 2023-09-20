import { V0Logo } from './v0logo';

const Footer = () => (
  <footer>
    <div className="custom-screen pt-16">
      <div className="mt-10 py-10 border-t items-center justify-between flex">
        <p className="text-gray-600">
          Created by{' '}
          <a
            href="https://twitter.com/nutlope"
            className="hover:underline transition"
          >
            Hassan
          </a>{' '}
          and{' '}
          <a
            href="https://twitter.com/kevinhou22"
            className="hover:underline transition"
          >
            Kevin
          </a>
          .
        </p>
        <div className="flex items-center gap-x-6 text-gray-400">
          <a
            className="border border-slate-200 rounded-md px-3 py-1 tracking-tight flex gap-1 hover:scale-105 transition"
            href="https://v0.dev/"
            target="_blank"
          >
            <span className="text-gray-500">Built with</span>
            <V0Logo width={25} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
