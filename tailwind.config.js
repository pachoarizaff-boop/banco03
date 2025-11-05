module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep trust blue
        primary: {
          DEFAULT: "#1B365D", // primary-900
          50: "#F0F4F8", // slate-50
          100: "#D9E2EC", // slate-100
          200: "#BCCCDC", // slate-200
          300: "#9FB3C8", // slate-300
          400: "#829AB1", // slate-400
          500: "#627D98", // slate-500
          600: "#486581", // slate-600
          700: "#334E68", // slate-700
          800: "#243B53", // slate-800
          900: "#1B365D", // slate-900
        },
        // Secondary Colors - Professional warmth
        secondary: {
          DEFAULT: "#2E5984", // blue-gray-600
          50: "#F1F5F9", // slate-50
          100: "#E2E8F0", // slate-100
          200: "#CBD5E0", // slate-200
          300: "#A0AEC0", // slate-300
          400: "#718096", // slate-400
          500: "#4A5568", // slate-500
          600: "#2E5984", // blue-gray-600
          700: "#2D3748", // gray-700
          800: "#1A202C", // gray-800
          900: "#171923", // gray-900
        },
        // Accent Colors - Success green
        accent: {
          DEFAULT: "#00A86B", // emerald-600
          50: "#F0FDF4", // green-50
          100: "#DCFCE7", // green-100
          200: "#BBF7D0", // green-200
          300: "#86EFAC", // green-300
          400: "#4ADE80", // green-400
          500: "#22C55E", // green-500
          600: "#00A86B", // emerald-600
          700: "#15803D", // green-700
          800: "#166534", // green-800
          900: "#14532D", // green-900
        },
        // Background Colors
        background: "#FAFBFC", // gray-50
        surface: "#F5F7FA", // slate-50
        // Text Colors
        text: {
          primary: "#1A202C", // gray-800
          secondary: "#4A5568", // gray-600
        },
        // Status Colors
        success: {
          DEFAULT: "#38A169", // green-600
          50: "#F0FDF4", // green-50
          100: "#DCFCE7", // green-100
          500: "#22C55E", // green-500
        },
        warning: {
          DEFAULT: "#D69E2E", // yellow-600
          50: "#FFFBEB", // yellow-50
          100: "#FEF3C7", // yellow-100
          500: "#F59E0B", // yellow-500
        },
        error: {
          DEFAULT: "#E53E3E", // red-600
          50: "#FEF2F2", // red-50
          100: "#FEE2E2", // red-100
          500: "#EF4444", // red-500
        },
        // Border Colors
        border: {
          DEFAULT: "#E2E8F0", // gray-200
          focus: "#2E5984", // secondary-600
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'natural': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}