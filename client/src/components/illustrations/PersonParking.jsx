import React from 'react';
import { motion } from 'framer-motion';

const PersonParking = ({ className }) => (
  <motion.svg
    width="200"
    height="300"
    viewBox="0 0 200 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {/* Head */}
    <circle cx="100" cy="50" r="25" stroke="#0F0F0F" strokeWidth="3" />
    {/* Body */}
    <path d="M100 75V180" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 100C80 110 120 110 140 100" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
    {/* Phone (Doodle style) */}
    <rect x="135" y="90" width="15" height="25" rx="3" stroke="#0F0F0F" strokeWidth="2" fill="white" />
    {/* Legs */}
    <path d="M100 180L70 260" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
    <path d="M100 180L130 260" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

export default PersonParking;
