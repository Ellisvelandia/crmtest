// Animation variants for BirthdayManager components
export const animations = {
  containerVariants: {
    list: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
    calendar: {
      transition: { staggerChildren: 0, delayChildren: 0 }
    }
  },
  fadeInUp: {
    initial: { 
      opacity: 0, 
      y: 10
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  },
  calendarVariants: {
    initial: { 
      opacity: 0, 
      scale: 0.98,
      y: 5
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.98,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  },
  pageTransition: {
    type: "spring",
    damping: 20,
    stiffness: 300,
    duration: 0.3
  }
}

export default animations; 