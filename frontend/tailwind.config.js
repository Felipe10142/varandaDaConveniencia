export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: "#D62828",    // Rojo intenso (predominante)
        secondary: "#F77F00",  // Naranja vibrante (secundario)
        accent: "#F4A261",     // Amarillo cálido (toques)
        dark: "#1B1B1B",       // Negro profundo
        gray: "#4A4A4A",       // Gris medio/oscuro
        gastronomico: "#ffb703", // Color gastronómico
        cta: "#fb8500",        // Botones / Llamados
        success: "#52b788",    // Confirmaciones / Éxito
        error: "#e63946",      // Errores / Alertas
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        handwriting: ['Dancing Script', 'cursive'],
        condensed: ['Oswald', 'sans-serif'],
        accent: ['Lobster', 'cursive']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, #D62828, #F77F00, #F4A261)',
        'gradient-secondary': 'linear-gradient(to right, #F77F00, #F4A261, #F77F00)',
        'gradient-fire': 'linear-gradient(to right, #D62828, #F77F00, #D62828)',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite'
      },
    },
  },
  plugins: [],
}