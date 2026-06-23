import React from 'react';
import { motion } from 'framer-motion';

const PersonCar = ({ className }) => (
  <motion.svg
    width="200"
    height="300"
    viewBox="0 0 200 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
  >
    <circle cx="100" cy="50" r="25" stroke="#0F0F0F" strokeWidth="3" />
    <path d="M100 75V180" stroke="#0F0F0F" strokeWidth="3" />
    {/* Holding Key */}
    <path d="M100 120L150 140" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
    <circle cx="155" cy="142" r="5" fill="#0F0F0F" />
    <path d="M100 180L80 270M100 180L120 270" stroke="#0F0F0F" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

export default PersonCar;
