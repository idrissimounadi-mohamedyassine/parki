import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title,
  description,
  icon: Icon = Search,
  actionLabel,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 text-gray-300">
        <Icon size={48} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 max-w-xs mx-auto mb-10 font-medium">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
