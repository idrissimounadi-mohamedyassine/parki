import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className }) => {
  return <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />;
};

export default Skeleton;
