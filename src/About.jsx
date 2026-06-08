export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">

        <h1 className="text-4xl md:text-5xl font-black text-red-600 mb-4">
          About Us
        </h1>

        <p className="text-gray-400 mb-10">
          Last Updated: June 6, 2026
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Who We Are
            </h2>

            <p>
              DarkCity is an online video streaming platform that provides
              users with entertainment content including movies, series,
              and trending videos in one place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Our Mission
            </h2>

            <p>
              Our mission is to deliver fast, smooth, and high-quality
              entertainment experiences to users around the world.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              What We Offer
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Trending Videos</li>
              <li>New Releases</li>
              <li>Movie & Series Collections</li>
              <li>Fast streaming experience</li>
              <li>Mobile & desktop friendly platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Our Vision
            </h2>

            <p>
              We aim to become a leading entertainment platform with a
              user-friendly experience and global reach.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">
              Contact
            </h2>

            <p>
              If you have any questions, feel free to contact us at:
            </p>

            <a
              href="mailto:support@darkcitys.net"
              className="text-red-500 hover:underline"
            >
              darkcity.support@gmail.com
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}