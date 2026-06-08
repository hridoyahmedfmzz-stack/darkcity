export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

        <h1 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-10">
          Last Updated: June 6, 2026
        </p>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Welcome to DarkCity
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information when you use our
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-red-500 mb-2">
              Personal Information
            </h3>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Email address (when registering or logging in)</li>
              <li>Username or profile information</li>
              <li>Information you voluntarily provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-red-500 mt-6 mb-2">
              Automatically Collected Information
            </h3>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Date and time of visits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              How We Use Information
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide and improve our services</li>
              <li>Manage user accounts</li>
              <li>Display content and videos</li>
              <li>Prevent fraud and abuse</li>
              <li>Analyze website performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Cookies
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We may use cookies and similar technologies to remember user
              preferences, improve website functionality, measure website
              traffic, and serve advertisements.
            </p>

            <p className="text-gray-300 mt-3">
              Users can disable cookies through their browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Third-Party Services
            </h2>

            <p className="text-gray-300 mb-4">
              Our website may use third-party services such as:
            </p>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Firebase</li>
              <li>Google Analytics</li>
              <li>Monetag</li>
              <li>ExoClick</li>
            </ul>

            <p className="text-gray-300 mt-4">
              These services may collect information according to their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Advertising
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Third-party advertising partners may use cookies, web beacons,
              and similar technologies to display relevant advertisements and
              measure campaign performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Data Security
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We implement reasonable security measures to protect your
              information. However, no method of transmission over the internet
              is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Children's Privacy
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Our website is not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Your Rights
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Changes to This Policy
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-3 text-red-500">
              Contact Us
            </h2>

            <p className="text-gray-300 mb-3">
              If you have any questions regarding this Privacy Policy, please
              contact us at:
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
