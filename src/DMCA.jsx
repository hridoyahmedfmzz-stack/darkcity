export default function DMCA() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">

        <h1 className="text-5xl font-black text-red-600 mb-4">
          DMCA Policy
        </h1>

        <p className="text-gray-400 mb-8">
          Last Updated: June 6, 2026
        </p>

        <div className="space-y-6 text-gray-300">

          <p>
            DarkCity respects the intellectual property rights of others
            and expects users to do the same.
          </p>

          <p>
            If you believe that any content available on this website
            infringes your copyright, please submit a DMCA notice.
          </p>

          <p>
            Your notice should include:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Your full legal name.</li>
            <li>Your contact information.</li>
            <li>Description of the copyrighted work.</li>
            <li>The URL of the allegedly infringing material.</li>
            <li>A statement of good-faith belief.</li>
            <li>Your electronic or physical signature.</li>
          </ul>

          <p>
            Upon receiving a valid DMCA complaint, we will investigate
            and remove the content when appropriate.
          </p>

          <div className="bg-zinc-900 rounded-xl p-5">
            <h3 className="text-xl font-bold text-red-500 mb-2">
              DMCA Contact
            </h3>

            <p>Email: darkcity.support@gmail.com</p>
          </div>

        </div>
      </div>
    </div>
  );
}