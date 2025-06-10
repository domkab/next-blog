import { FiMail, FiExternalLink } from 'react-icons/fi';
import { DOMAIN_NAME, SITE_NAME, SITE_TITLE } from '@/lib/constants';

const PrivacyPolicy = () => {
  return (
    <main className="privacy-policy md:mx-auto max-w-4xl p-6 sm:p-12">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 gap-2 text-gray-800 dark:text-gray-300">
        Privacy & Cookie Policy
      </h1>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
        Last updated: 10 June 2025
      </div>

      <div className=" max-w-none">
        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">1. Who We Are</h2>
          <p>
            <span className="font-semibold">{SITE_TITLE}</span> (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) is a technology-focused blog operated from [Vilnius, Lithuania].
            This Policy explains how we collect, use, store and share your information and how we use cookies and similar technologies.
            It applies to www.{DOMAIN_NAME} and any sub-domains (collectively, the &quot;Site&quot;).
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">2. The Data We Collect</h2>

          <figure className="rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] text-sm w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Category</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Examples</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Collected via</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Contact Data</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Name, e-mail address, message content</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Contact-us form, direct e-mail</td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Newsletter Data</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">E-mail address, marketing preferences</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">&quot;Subscribe&quot; form</td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Usage Data</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Pages viewed, clicks, referring URL, time on page</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Google Analytics cookies</td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Device Data</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">IP address, browser type, OS, screen resolution</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Google Analytics cookies</td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Advertising Data</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      Ad impressions, ad clicks, coarse location <br />(country/region), device identifiers
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      Google AdSense cookies &amp; tags <span className="italic">(future)</span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </figure>



          <p className="italic">
            We do not intentionally collect sensitive personal data (e.g., health, race, political opinions).
            Please refrain from submitting such information.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">3. How & Why We Collect It</h2>

          <figure className="rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] text-sm w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Purpose</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Legal Basis*</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Provide the Site & respond to enquiries</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Legitimate interest / Contract</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Enable you to read articles, contact us & receive replies</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Send newsletters & promotions</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Consent</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Only after you opt-in; each e-mail includes an unsubscribe link</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Analytics & performance</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Consent (EU/UK) / Legitimate interest (elsewhere)</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Understand traffic, improve content & UX</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Advertising &amp; monetisation</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      Consent<span className="hidden sm:inline"> (EU/UK)</span> / Legitimate interest
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      Serve personalised or contextual ads, measure ad performance
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Affiliate link tracking</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Legitimate interest / Consent</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Track clicks & attribute commissions</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Security & fraud prevention</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Legitimate interest</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Ensure the integrity of our systems</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </figure>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">4. Where & How We Store Your Data</h2>

          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <span className="font-semibold">MongoDB Atlas (EU cluster)</span> – Stores post/content records & contact messages.
            </li>
            <li>
              <span className="font-semibold">Firebase (Cloud Storage & Auth, EU multiregion)</span> – Stores images and manages newsletter login tokens.
            </li>
            <li>
              <span className="font-semibold">Mail Service Provider (e.g., MailerSend)</span> – Handles e-mail campaigns.
            </li>
          </ul>

          <p className="mb-4">
            All providers implement encryption in transit (TLS) and at rest (AES-256), role-based access controls,
            and independent security certifications (ISO 27001, SOC 2). We keep contact and newsletter data until
            you delete your account / unsubscribe or for as long as necessary to fulfil the purposes above.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">5. Third-Party Services</h2>

          <figure className="rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] text-sm w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Service</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Purpose</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Link to their Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Google Analytics 4</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Traffic & performance stats</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                      >
                        View <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Google AdSense</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Ad serving &amp; reporting</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <a
                        href="https://policies.google.com/technologies/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                      >
                        View <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Firebase by Google</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Image storage, e-mail auth</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <a
                        href="https://firebase.google.com/support/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                      >
                        View <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">MongoDB Atlas</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Managed database</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <a
                        href="https://www.mongodb.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                      >
                        View <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Amazon Associates</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Affiliate programme (future)</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <a
                        href="https://affiliate-program.amazon.com/help/operating/agreement"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                      >
                        View <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </figure>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">6. Cookies & Similar Technologies</h2>

          <p className="mb-4">
            <span className="font-semibold">What are cookies?</span> Cookies are small text files stored on your device when you visit a website. We use:
          </p>

          <figure className="rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] text-sm w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Type</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Purpose</th>
                    <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Lifespan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Strictly Necessary</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Remember cookie-consent choice, load-balancing</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">up to 12 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Analytics</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Measure traffic & user behaviour (Google Analytics)</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">up to 14 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Functional</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Persist theme (dark/light) preference</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">up to 12 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Marketing / Affiliate</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Track outbound clicks to commerce partners</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">up to 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b dark:border-gray-600">Advertising / AdSense</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      Deliver personalised or non-personalised ads, limit ad frequency
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">up to 13 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </figure>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">7. Your Rights (GDPR & similar laws)</h2>

          <p className="mb-4">
            You may, at any time:
          </p>

          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <span className="font-semibold">Access</span> – Ask for a copy of personal data we hold about you.
            </li>
            <li>
              <span className="font-semibold">Rectify</span> – Request correction of inaccurate or incomplete data.
            </li>
            <li>
              <span className="font-semibold">Erase (&quot;Right to be forgotten&quot;)</span> – Ask us to delete your data where no legal reason to keep it exists.
            </li>
            <li>
              <span className="font-semibold">Restrict processing</span> – Ask us to pause processing while a dispute is resolved.
            </li>
            <li>
              <span className="font-semibold">Data portability</span> – Receive your data in a machine-readable format.
            </li>
            <li>
              <span className="font-semibold">Object</span> – Object to processing based on legitimate interests or direct marketing.
            </li>
            <li>
              <span className="font-semibold">Withdraw consent</span> – Where processing is based on consent, you may withdraw it at any time (e.g., unsubscribe link).
            </li>
            <li>
              <span className="font-semibold">Lodge a complaint</span> – Contact your local data-protection authority (e.g., Lithuanian DPA or EU supervisory authority).
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-6">How to exercise these rights</h3>
          <p>
            Send an e-mail to <a href={`mailto:privacy@${SITE_NAME}.com`} className="text-teal-600 dark:text-teal-400 hover:underline">privacy@{SITE_NAME}.com</a> or use the &quot;Privacy Request&quot; form. We will respond within 30 days.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">8. International Transfers</h2>
          <p>
            Your data may be processed in countries outside the EEA/UK (e.g., US). We rely on EU–US Data Privacy Framework or Standard Contractual Clauses to protect it.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">9. Changes to This Policy</h2>
          <p>
            We may update this Policy periodically. We will post the new version and, if changes are significant, notify subscribers by e-mail. Check &quot;Last updated&quot; date for current version.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">10. Contact Us</h2>
          <p className="mb-4">
            If you have questions about privacy or cookies, reach us at:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FiMail className="mr-2" />
              E-mail:
              <a href={`mailto:contact@${SITE_NAME}.com`}
                className="text-teal-600 dark:text-teal-400 hover:underline ml-1">contact@{SITE_NAME}.com
              </a>
            </li>
            <li>
              Postal: [Company Name], [Street Address], [City], [Postcode], Lithuania.
            </li>
          </ul>
        </section>

        <div className="border-t dark:border-gray-600 pt-6 mt-10">
          <p className="italic">
            By continuing to use this Site, you acknowledge that you have read and understood this Privacy & Cookie Policy.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
