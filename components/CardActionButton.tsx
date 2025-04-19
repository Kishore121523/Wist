// components/CardActionButton.tsx
'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import Tooltip from './Tooltip';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: string;
  highlight?: boolean;
  scaleOnHover?: boolean;
}

export default function CardActionButton({
  icon,
  tooltip,
  highlight = false,
  scaleOnHover = false,
  ...props
}: Props) {
  const baseStyle = `transition cursor-pointer ${
    highlight ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
  }`;

  const button = (
    <motion.button {...(props as React.ComponentProps<typeof motion.button>)} className={baseStyle}>
      {icon}
    </motion.button>
  );

  const wrapped = scaleOnHover ? (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className='flex items-center justify-center'
    >
      {button}
    </motion.div>
  ) : (
    button
  );

  return tooltip ? <Tooltip label={tooltip} sourceComp="cardItems">{wrapped}</Tooltip> : wrapped;
}
