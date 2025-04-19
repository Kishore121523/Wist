'use client';

import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { btnWhiteBg } from '@/lib/constants';

export default function ThemeToggleBtn() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className={`${btnWhiteBg} px-4 sm:px-auto`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ opacity: 1, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 1, scale: 0.8, rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <Sun size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 1, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 1, scale: 0.8, rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <Moon size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
