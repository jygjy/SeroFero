export default function Contact() {
    return (
      <section className="container mx-auto px-6 py-16 text-center">
        {/* <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2> */}
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Have any questions or need assistance? Reach out to us!
        </p>
        <a
          href="mailto:support@serofero.com"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Email Us
        </a>
      </section>
    );
  }
  