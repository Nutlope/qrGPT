import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <div className=" border-t p-4 pt-12" id="#faqs">
      <h1 className="text-l text-gray-800 font-extrabold mx-auto sm:text-3xl">
        FAQs
      </h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is storing Wifi passwords secure?</AccordionTrigger>
          <AccordionContent>
            We don&apos;t save your passwords, ip address or any personal
            information into any databases. However, the image url we generate
            is not protected. Therefore, we take no responsibility for security
            of the password. Don&apos;t put anything you don&apos;t want to be
            shared with public. This is a project for fun not meant to secure
            your private keys.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Who Created This?</AccordionTrigger>
          <AccordionContent>
            This was created for fun by Andriy (
            <a
              href="https://twitter.com/emergingbits"
              className="underline"
              target="_blank"
            >
              @emergingbits
            </a>
            ). Credit also goes to original open sourced{' '}
            <a
              href="https://github.com/Nutlope/qrGPT"
              className="underline"
              target="_blank"
            >
              github repo
            </a>{' '}
            &amp; its creators from which I forked the repository & took
            inspiration from.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
