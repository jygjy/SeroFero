import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer-section" className="bg-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">SeroFero</h3>
            <p className="text-gray-400">
              Discover and share amazing locations across Nepal. Join our community of travelers today.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-gray-400 hover:text-primary transition duration-300">Explore</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition duration-300">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition duration-300">Contact</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-primary transition duration-300">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-primary transition duration-300">Help Center</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-primary transition duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-primary transition duration-300">Terms of Service</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-primary transition duration-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition duration-300">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition duration-300">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition duration-300">
                <FaTwitter className="text-xl" />
              </a>
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = 'mailto:bhandari3149anish@gmail.com?subject=Inquiry%20from%20SeroFero'}
                className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 text-sm font-semibold"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SeroFero. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
