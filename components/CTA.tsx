import NavLink from './NavLink';

const CTA = () => (
  <SectionWrapper>
    <div className="custom-screen">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-gray-800 text-3xl font-semibold sm:text-4xl"
          id="cta"
        >
          Get started with QrGPT today
        </h2>
        <p className="mt-3 text-gray-600">
          Generate your first AI QR Code today, 100% free.
        </p>
        <NavLink
          href="/start"
          className="mt-4 inline-block font-medium text-sm text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900"
        >
          Generate your AI QR Code
        </NavLink>
      </div>
    </div>
  </SectionWrapper>
);

const SectionWrapper = ({ children, ...props }: any) => (
  <section {...props} className={`py-16 ${props.className || ''}`}>
    {children}
  </section>
);

export default CTA;
