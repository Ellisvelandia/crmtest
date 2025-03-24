// Animation variants for BirthdayManager components
export const animations = {
  containerVariants: {
    list: {
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    },
    calendar: {
      transition: { staggerChildren: 0, delayChildren: 0 }
    }
  },
  fadeInUp: {
    initial: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(clamp(0px, 8px, 8px))'
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: 'blur(clamp(0px, 8px, 8px))',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  },
  calendarVariants: {
    initial: { 
      opacity: 0, 
      scale: 0.92,
      rotateX: 5,
      filter: 'blur(clamp(0px, 8px, 8px))'
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 200,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.92,
      rotateX: -5,
      filter: 'blur(clamp(0px, 8px, 8px))',
      transition: {
        duration: 0.3
      }
    }
  },
  pageTransition: {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }
}

export default animations; 