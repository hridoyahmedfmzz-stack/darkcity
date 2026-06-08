export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <h1 className="text-5xl font-black text-red-600 mb-4">
          Contact Us
        </h1>

        <p className="text-gray-400 mb-10">
          We'd love to hear from you.
        </p>

        <div className="bg-zinc-900 rounded-2xl p-8">

          <div className="space-y-4">

            <div>
              <h3 className="font-bold text-red-500">
                Support Email
              </h3>

              <a
                href="mailto:support@darkcitys.net"
                className="text-gray-300 hover:text-red-500"
              >
                darkcity.support@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-bold text-red-500">
                Website
              </h3>

              <p className="text-gray-300">
                https://darkcitys.netlify.app
              </p>
            </div>

            <div>
              <h3 className="font-bold text-red-500">
                Response Time
              </h3>

              <p className="text-gray-300">
                Usually within 24–48 hours.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}