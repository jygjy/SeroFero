import Image from "next/image"
import { motion } from "framer-motion"

export default function About() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About SeroFero</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your gateway to extraordinary travel experiences. We connect passionate travelers with unique 
              destinations and authentic local insights.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Discover",
                description: "Find hidden gems and popular destinations",
                icon: "🔍"
              },
              {
                title: "Connect",
                description: "Join a community of passionate travelers",
                icon: "🤝"
              },
              {
                title: "Explore",
                description: "Create your own unique travel stories",
                icon: "🌎"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
  