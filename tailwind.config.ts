import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        fire: {
          orange: "hsl(var(--fire-orange))",
          red: "hsl(var(--fire-red))",
          yellow: "hsl(var(--fire-yellow))",
        },
        ember: {
          glow: "hsl(var(--ember-glow))",
        },
        coal: {
          black: "hsl(var(--coal-black))",
        },
        ash: {
          gray: "hsl(var(--ash-gray))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.6",
            transform: "scale(1)" 
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.05)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ember-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.1)" },
        },
        "ember-flicker": {
          "0%, 100%": { opacity: "0.6" },
          "25%": { opacity: "0.9" },
          "50%": { opacity: "0.4" },
          "75%": { opacity: "0.8" },
        },
        "spark": {
          "0%": { opacity: "0", transform: "translateY(0) scale(1)" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(0)" },
        },
        "float-spark": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(0) translateX(0)" 
          },
          "10%": { 
            opacity: "0.7" 
          },
          "50%": { 
            transform: "translateY(-50vh) translateX(20px)" 
          },
          "90%": { 
            opacity: "0.5" 
          },
          "100%": { 
            opacity: "0", 
            transform: "translateY(-100vh) translateX(-10px)" 
          },
        },
        "flame-dance": {
          "0%, 100%": { 
            opacity: "0.5", 
            transform: "scaleY(1) translateY(0)" 
          },
          "50%": { 
            opacity: "0.8", 
            transform: "scaleY(1.2) translateY(-5px)" 
          },
        },
        "flame-flicker": {
          "0%, 100%": { opacity: "0.6", transform: "scaleX(1)" },
          "25%": { opacity: "0.9", transform: "scaleX(1.1)" },
          "50%": { opacity: "0.5", transform: "scaleX(0.9)" },
          "75%": { opacity: "0.8", transform: "scaleX(1.05)" },
        },
        "flame-core": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "ember-pulse": "ember-pulse 2s ease-in-out infinite",
        "ember-pulse-slow": "ember-pulse 3s ease-in-out infinite",
        "ember-pulse-delayed": "ember-pulse 2.5s ease-in-out 0.5s infinite",
        "ember-flicker": "ember-flicker 1.5s ease-in-out infinite",
        "ember-flicker-fast": "ember-flicker 0.8s ease-in-out infinite",
        "ember-flicker-delayed": "ember-flicker 1.5s ease-in-out 0.3s infinite",
        "spark": "spark 2s ease-out infinite",
        "spark-delayed": "spark 2s ease-out 0.7s infinite",
        "spark-slow": "spark 3s ease-out 1s infinite",
        "float-spark": "float-spark linear infinite",
        "flame-dance": "flame-dance 2s ease-in-out infinite",
        "flame-dance-slow": "flame-dance 3s ease-in-out infinite",
        "flame-dance-delayed": "flame-dance 2.5s ease-in-out 0.5s infinite",
        "flame-flicker": "flame-flicker 1.2s ease-in-out infinite",
        "flame-flicker-fast": "flame-flicker 0.7s ease-in-out infinite",
        "flame-flicker-delayed": "flame-flicker 1.2s ease-in-out 0.4s infinite",
        "flame-core": "flame-core 1s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-fire": "linear-gradient(135deg, hsl(16 100% 50%), hsl(0 85% 45%))",
        "gradient-ember": "linear-gradient(180deg, hsl(0 85% 25%) 0%, hsl(25 100% 35%) 50%, hsl(45 100% 45%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
