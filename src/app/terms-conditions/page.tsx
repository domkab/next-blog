// app/terms/page.tsx
import { FiMail, FiExternalLink } from 'react-icons/fi';
import { DOMAIN_NAME, SITE_NAME, SITE_TITLE } from '@/lib/constants';

export const metadata = {
  title: `Terms & Conditions | ${SITE_TITLE}`,
  description: `Terms of service for ${SITE_TITLE}`,
};

const TermsAndConditions = () => {
  return (
    <main className="terms md:mx-auto max-w-4xl p-6 sm:p-12">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 gap-2 text-gray-800 dark:text-gray-300">
        Terms&nbsp;&amp;&nbsp;Conditions
      </h1>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
        Last updated:&nbsp;10&nbsp;June&nbsp;2025
      </div>

      <div className="max-w-none">  

        {/* Section 0 – Intro */}
        <section className="mb-10 prose dark:prose-invert">
          <p>
            These Terms&nbsp;&amp;&nbsp;Conditions (“<strong>Terms</strong>”) govern your access to and use
            of <strong>{SITE_TITLE}</strong> (<em>“Site”</em>), operated by&nbsp;
            <strong>[Company Name]</strong> (<em>“we”</em>, <em>“us”</em>, <em>“our”</em>). By continuing to use
            {` www.${DOMAIN_NAME}`} you agree to these Terms and to our&nbsp;
            <a href="/privacy-policy" className="text-teal-600 dark:text-teal-400 hover:underline">
              Privacy&nbsp;&amp;&nbsp;Cookie Policy
            </a>. If you do not agree, you must refrain from using the Site.
          </p>
        </section>

        {/* 1 Changes */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">1. Changes to the Terms</h2>
          <p>
            We may revise these Terms at any time. The new version will appear on this page with an updated
            “Last updated” date. Your continued use of the Site after changes take effect constitutes acceptance.
          </p>
        </section>

        {/* 2 IP */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">2. Intellectual Property</h2>
          <p>
            All articles, graphics, code, logos and other content are protected by copyright, trademark and
            other laws. You may view and share public pages for personal, non-commercial purposes if you keep
            all proprietary notices intact. Any other use (reproduction, modification, commercial exploitation)
            requires our prior written permission.
          </p>
        </section>

        {/* 3 Acceptable Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">3. Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Follow all applicable laws and regulations.</li>
            <li>No unlawful, defamatory, harassing or obscene material.</li>
            <li>No scraping, crawling or automated copying without consent.</li>
            <li>No viruses, malware or harmful code.</li>
            <li>No interference with Site security or access controls.</li>
          </ul>
          <p className="mt-4">
            We may suspend or terminate access for violations or conduct harmful to the Site or its users.
          </p>
        </section>

        {/* 4 Ads & Affiliate */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">
            4. Advertising &amp; Affiliate Disclosure
          </h2>

          <p className="mb-3">
            The Site is monetised through:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Affiliate links</strong> (e.g.&nbsp;Amazon Associates). If you click a link and purchase,
              we may earn a commission at no extra cost to you.
            </li>
            <li>
              <strong>Google AdSense</strong> display ads. Google and its partners use cookies or identifiers to
              serve personalised or contextual ads and measure performance.&nbsp;
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:underline"
              >
                Learn more <FiExternalLink className="ml-1" size={14} />
              </a>
            </li>
          </ul>
          <p className="mt-4">
            Sponsored articles or paid placements will always be labelled “Sponsored”, “Advertisement” or
            “Promotion”. Opinions remain our own.
          </p>
        </section>

        {/* 5 Third-Party Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">
            5. Third-Party Links &amp; Services
          </h2>
          <p>
            We may link to or embed third-party sites (e.g.&nbsp;YouTube). We are not responsible for their
            content or policies; you access them at your own risk.
          </p>
        </section>

        {/* 6 No Advice */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">6. No Professional Advice</h2>
          <p>
            Content is for general information only and is not professional, financial, legal or technical
            advice. You act on any information at your own discretion.
          </p>
        </section>

        {/* 7 Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">7. Disclaimer of Warranties</h2>
          <p>
            The Site and its content are provided “as is” and “as available” without warranties of any kind,
            express or implied (including merchantability, fitness for a particular purpose or non-infringement).
          </p>
        </section>

        {/* 8 Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for indirect, incidental, special,
            consequential or punitive damages, or loss of profits/revenues, arising from your use of the Site.
          </p>
        </section>

        {/* 9 Indemnity */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims, losses or expenses (including reasonable
            attorneys’ fees) arising out of your violation of these Terms or misuse of the Site.
          </p>
        </section>

        {/* 10 Law */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">
            10. Governing Law&nbsp;&amp; Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of Lithuania and, where applicable, EU consumer-protection law.
            Disputes shall be submitted to the courts of Vilnius, Lithuania, unless mandatory rules let you sue
            in your country of residence.
          </p>
        </section>

        {/* 11 Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">11. Contact</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FiMail className="mr-2" />
              E-mail:&nbsp;
              <a
                href={`mailto:contact@${SITE_NAME}.com`}
                className="text-teal-600 dark:text-teal-400 hover:underline"
              >
                contact@{SITE_NAME}.com
              </a>
            </li>
            <li>
              Postal: [Company Name], [Street Address], [City], [Postcode], Lithuania.
            </li>
          </ul>
        </section>

        <div className="border-t dark:border-gray-600 pt-6 mt-10">
          <p className="italic">
            By continuing to use this Site, you acknowledge that you have read, understood and agree to these
            Terms&nbsp;&amp;&nbsp;Conditions.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsAndConditions;