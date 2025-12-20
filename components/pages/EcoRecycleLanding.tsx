"use client";
import { motion } from "framer-motion";
import { Leaf, Recycle, ShoppingBag, UploadCloud, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EcoRecycleLanding() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F1F8E9] text-[#1B5E20] overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Floating eco blobs */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-[#A5D6A7] rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-40 -right-20 w-80 h-80 bg-[#4FC3F7] rounded-full blur-3xl opacity-30"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative max-w-7xl mx-auto px-6 py-28 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Turn Waste Into <span className="text-[#2E7D32]">Wealth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-[#2E7D32]"
          >
            Waste to wealth is an advanced recycle marketplace where you can{" "}
            <b>sell</b>, <b>buy</b>, and <b>post</b> recycled products. From
            plastic and metal to handmade eco-items — everything finds a new
            life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <button
              className="px-8 py-4 rounded-2xl bg-[#2E7D32] text-[#FAFAFA] shadow-lg hover:bg-[#66BB6A] hover:scale-105 transition"
              onClick={() => {
                router.push("auth/login");
              }}
            >
              Start Selling
            </button>
            <button
              className="px-8 py-4 rounded-2xl bg-[#FFFFFF] border border-[#A5D6A7] text-[#2E7D32] hover:bg-[#A5D6A7] hover:scale-105 transition"
              onClick={() => {
                router.push("auth/login");
              }}
            >
              Browse Products
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-semibold text-center mb-16"
        >
          How Waste to wealth Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <UploadCloud className="w-8 h-8" />,
              title: "Post Recycled Products",
              desc: "Upload your recycled or reusable items in seconds and reach eco-conscious buyers.",
            },
            {
              icon: <ShoppingBag className="w-8 h-8" />,
              title: "Buy Sustainable Goods",
              desc: "Discover affordable recycled products that reduce waste and save resources.",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Connect & Trade",
              desc: "Chat, trade, and build a community that believes in sustainability.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg border border-[#A5D6A7]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#A5D6A7] text-[#2E7D32] flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-[#2E7D32]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-[#FFFFFF]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Every Post Makes an Impact 🌍
            </h2>
            <p className="text-lg text-[#2E7D32] mb-6">
              When you sell or buy recycled products, you reduce landfill waste,
              save energy, and support a circular economy.
            </p>
            <p className="text-[#2E7D32]">
              Waste to wealth empowers individuals and small businesses to turn
              waste into value — creating income while protecting the planet.
            </p>
          </div>

          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="bg-[#A5D6A7] rounded-3xl p-12 text-center"
          >
            <Recycle className="w-20 h-20 mx-auto text-[#2E7D32] mb-4" />
            <p className="text-xl font-semibold">Reduce • Reuse • Earn</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Final Call To Action */}
      <section className="bg-[#2E7D32] text-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 py-24 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Post Today. Sell Tomorrow.
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-[#FAFAFA]/90">
            Join thousands of users buying and selling recycled products. Build
            income, reduce waste, and be part of the eco revolution.
          </p>
          <button
            className="px-10 py-4 rounded-2xl bg-[#FFC107] text-[#1B5E20] font-semibold shadow-lg hover:scale-110 transition"
            onClick={() => {
              router.push("auth/login");
            }}
          >
            Create Free Account
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#A5D6A7] py-8 text-center text-sm text-[#2E7D32]">
        © {new Date().getFullYear()} Waste to wealth. Turning Waste Into Wealth.
      </footer>
    </div>
  );
}
