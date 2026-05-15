window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37', // Gold
          50: '#fbf8ea',
          100: '#f5efcd',
          600: '#b89225', // Darker gold for hover
        },
        secondary: {
          DEFAULT: '#1a365d', // Deep Blue
          light: '#2c5282', // Lighter Navy
          dark: '#0f1f38',
        },
        accent: {
          DEFAULT: '#2563eb', // Blue accent
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: '#333333',
        medium: '#666666',
        light: '#f8f9fa',
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        serif: ['Tajawal', 'serif'],
        brand: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
};
