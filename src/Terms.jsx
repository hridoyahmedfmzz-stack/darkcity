export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

        <h1 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 mb-10">
          Last Updated: June 6, 2026
        </p>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Acceptance of Terms
            </h2>

            <p className="text-gray-300">
              By accessing and using DarkCity, you agree to comply with and be
              bound by these Terms & Conditions. If you do not agree with any
              part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Use of the Website
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>You must be at least 18 years old to use this website.</li>
              <li>You agree not to misuse or interfere with the website.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You may not attempt to gain unauthorized access to our systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              User Accounts
            </h2>

            <p className="text-gray-300">
              Users may be required to register an account to access certain
              features. You are responsible for all activities that occur under
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Content
            </h2>

            <p className="text-gray-300">
              All videos, images, text, logos, and other content on DarkCity
              are provided for entertainment and informational purposes.
            </p>

            <p className="text-gray-300 mt-3">
              Unauthorized copying, redistribution, or reproduction of content
              is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Advertisements
            </h2>

            <p className="text-gray-300">
              Our website may display advertisements provided by third-party
              advertising partners including Monetag and ExoClick. We are not
              responsible for the content or practices of third-party ads.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Intellectual Property
            </h2>

            <p className="text-gray-300">
              All trademarks, logos, website design, and content are the
              property of DarkCity or their respective owners and are protected
              by applicable copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Limitation of Liability
            </h2>

            <p className="text-gray-300">
              DarkCity shall not be liable for any direct, indirect, incidental,
              or consequential damages resulting from the use or inability to
              use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Termination
            </h2>

            <p className="text-gray-300">
              We reserve the right to suspend or terminate user accounts at any
              time for violations of these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Changes to These Terms
            </h2>

            <p className="text-gray-300">
              We may update these Terms & Conditions at any time. Continued use
              of the website after changes are posted constitutes acceptance of
              the updated terms.
            </p>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-red-500 mb-3">
              Contact Us
            </h2>

            <p className="text-gray-300 mb-3">
              If you have any questions regarding these Terms & Conditions,
              please contact us:
            </p>

            <p className="font-semibold">
              Email:
              <a
                href="mailto:support@darkcitys.net"
                className="text-red-500 ml-2 hover:underline"
              >
                darkcity.support@gmail.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}