import Link from "next/link";
import Categories from "../components/Categories";
import ExplorePreview from "@/components/ExplorePreview";
import About from "./about";
import Contact from "./contact";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navbar */}
      <nav className="bg-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SeroFero</h1>
          <div className="space-x-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/explore" className="hover:text-primary">
              Explore
            </Link>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link href="/community" className="hover:text-primary">
              Our Community
            </Link>
          </div>
          <div>
            <Link href="/login" className="px-4 py-2 hover:text-primary">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-6">
        {/* Left - Text Content */}
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-dark">
            Start <span className="text-primary"> Exploring</span> 
           Hidden Places of Nepal
          </h1>
          {/* <p className="text-secondary mt-4">
            Discover amazing locations shared by fellow travelers. Join our
            community to explore, share, and find hidden gems!
          </p>
           */}
           <p className="text-lg text-gray-600 mt-4 leading-relaxed">
  Disscover breathtaking destinations handpicked by fellow travelers. 
  Connect with a vibrant community, uncover hidden gems, and embark on 
  unforgettable journeys together!
</p>

          <div className="mt-6">
            <Link
              href="/explore"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600"
            >
              Explore Now
            </Link>
          </div>
        </div>

        {/* Right - Hero Image */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img src="/home.svg" alt="Travel Illustration" className="w-100" />
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className="w-96 h-auto"
          >
            <circle cx="250" cy="250" r="200" fill="#4F46E5" />
          </svg> */}
        </div>
      </header>

      {/* Search Bar */}
      <section className="container mx-auto flex justify-center mt-10">
        <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden w-full max-w-lg">
          <input
            type="text"
            placeholder="Search trip destination"
            className="w-full px-4 py-3 text-dark focus:outline-none"
          />
          <button className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md">
            Search
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Explore Preview Section */}
      <ExplorePreview />


      {/* <About />
      <Contact /> */}

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose SeroFero?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-secondary">
              User-Contributed Locations
            </h3>
            <p className="mt-2 text-gray-600">
              Discover hidden gems contributed by travelers like you.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-secondary">
              Community Engagement
            </h3>
            <p className="mt-2 text-gray-600">
              Share reviews, add locations, and interact with fellow travelers.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-secondary">
              Admin Verified Destinations
            </h3>
            <p className="mt-2 text-gray-600">
              Only approved locations are displayed for authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-darkBlue text-white text-center py-16">
        <h2 className="text-3xl font-bold">Start Exploring Today!</h2>
        <p className="mt-2 text-lg">
          Find your next adventure with verified locations.
        </p>
        <Link
          href="/explore"
          className="mt-6 inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-softPurple"
        >
          Explore Now
        </Link>
      </section>
    </div>
  );
}
