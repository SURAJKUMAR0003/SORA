/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#070f21',
          850: '#0c1836',
          800: '#11224d',
          700: '#19346d',
          600: '#234894',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          300: '#67e8f9',
        },
        hospital: {
          accent: '#00e5ff',
          teal: '#00f5d4',
          alert: '#ff3366',
          warning: '#ffb703',
          success: '#10b981',
          blue: '#1d4ed8'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)' },
          '50%': { opacity: '0.4', boxShadow: '0 0 5px rgba(0, 229, 255, 0.1)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
