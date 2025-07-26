'use client'

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, CreditCard, Star, Truck, Headphones, DollarSign, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
  }),
};

const memberVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
  }),
};

const About = () => {
  const cards = [
    {
      icon: <ShieldCheck className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Trustworthy",
      desc: "We are dedicated to honesty, reliability, and transparency in everything we do.",
    },
    {
      icon: <CreditCard className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Secure Payments",
      desc: "Your payment and data are fully protected with advanced security systems.",
    },
    {
      icon: <Star className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Quality Products",
      desc: "Only genuine and verified items from trusted sellers across Nepal.",
    },
    {
      icon: <Truck className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Fast Delivery",
      desc: "We deliver across Nepal quickly and safely, right to your doorstep.",
    },
    {
      icon: <Headphones className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Customer Support",
      desc: "Friendly support team ready to help with any questions or concerns.",
    },
    {
      icon: <DollarSign className="mx-auto mb-3 text-orange-500" size={40} />,
      title: "Transparent Pricing",
      desc: "We believe in clear, upfront prices with no hidden fees — what you see is what you pay.",
    },
  ];

  const teamMembers = [
    { name: "Aaditya Karki", role: "CEO" },
    { name: "Samyog Aryal", role: "Team Member" },
    { name: "Rupak Bhattarai", role: "Team Member" },
    { name: "Sulav Panthi", role: "Team Member" },
    { name: "Kritish Bhandari", role: "Team Member" },
    { name: "Kush Karki", role: "Team Member" },
  ];

  const supportTeam = [
    { name: "Subhekshya Bhattarai", role: "Promotion" },
    { name: "Dikshya Bogati", role: "Ads" },
  ];

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-br from-white to-orange-50 min-h-screen">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <p className="text-3xl md:text-4xl font-extrabold text-orange-600 tracking-wide drop-shadow-md">
            About Hamro eShop
          </p>
          <div className="w-20 h-1 bg-orange-500 rounded-full mx-auto mt-2 shadow-lg"></div>
        </div>

        {/* Intro */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-8 sm:p-10 text-gray-800 space-y-6 text-lg leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-orange-600">Hamro eShop</span> — an online marketplace where quality, affordability, and exceptional service come together.
          </p>
          <p>
            Our platform is designed to simplify your shopping experience by connecting you with genuine products and ensuring seamless delivery. Whether you're searching for electronics, fashion, or everyday essentials, we've got you covered.
          </p>
          <p>
            At Hamro eShop, we don't just sell products — we are committed to serving you. Your satisfaction and trust are our highest priorities.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Why Choose Us?</h2>

          {/* Mobile layout - Square boxes */}
          <div className="md:hidden space-y-6">

            {/* First 4 cards: 2 columns grid with square aspect ratio */}
            <div className="grid grid-cols-2 gap-4">
              {cards.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.title}
                  className="aspect-square p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer flex flex-col justify-center text-center"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  <div className="flex justify-center mb-2">
                    {React.cloneElement(item.icon, { size: 32, className: "text-orange-500" })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Last 2 cards: 2 columns grid with square aspect ratio */}
            <div className="grid grid-cols-2 gap-4">
              {cards.slice(4, 6).map((item, i) => (
                <motion.div
                  key={item.title}
                  className="aspect-square p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer flex flex-col justify-center text-center"
                  custom={i + 4}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  <div className="flex justify-center mb-2">
                    {React.cloneElement(item.icon, { size: 32, className: "text-orange-500" })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop and tablet (md+) layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {cards.map((item, i) => (
              <motion.div
                key={item.title}
                className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-orange-200 transition cursor-pointer"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Team Section */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Our Team</h2>
            <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto shadow-lg"></div>
          </div>

          {/* Mobile Layout - Stacked Vertically */}
          <div className="lg:hidden space-y-6">
            {/* Team Members - Mobile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <Users className="text-orange-500 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Team Members</h3>
              </div>
              
              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={member.name}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-all duration-300"
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={memberVariants}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{member.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{member.role}</p>
                    </div>
                    {member.role === "CEO" && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Leader
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support Team - Mobile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <Heart className="text-orange-500 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Support Team</h3>
              </div>
              
              <div className="space-y-3">
                {supportTeam.map((member, i) => (
                  <motion.div
                    key={member.name}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-all duration-300"
                    custom={i + teamMembers.length}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={memberVariants}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{member.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{member.role}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      Supporter
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original but Smaller */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            {/* Team Members - Desktop */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <Users className="text-orange-500 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-800">Team Members</h3>
              </div>
              
              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <motion.div
                    key={member.name}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-all duration-300"
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={memberVariants}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{member.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{member.role}</p>
                    </div>
                    {member.role === "CEO" && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Leader
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support Team - Desktop */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <Heart className="text-orange-500 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-800">Support Team</h3>
              </div>
              
              <div className="space-y-3">
                {supportTeam.map((member, i) => (
                  <motion.div
                    key={member.name}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-100 hover:shadow-md transition-all duration-300"
                    custom={i + teamMembers.length}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={memberVariants}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{member.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{member.role}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      Supporter
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;

