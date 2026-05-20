'use client'

import { motion } from 'framer-motion'

const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
  slideDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  },
}

export default function AnimateIn({
  children,
  variant = 'slideUp',
  delay = 0,
  className = '',
  viewTrigger = true,
}) {
  const selectedVariant = variants[variant] || variants.slideUp

  return (
    <motion.div
      initial="hidden"
      whileInView={viewTrigger ? 'visible' : undefined}
      animate={!viewTrigger ? 'visible' : undefined}
      viewport={viewTrigger ? { once: true, margin: '-50px' } : undefined}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            ...selectedVariant.visible.transition,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
