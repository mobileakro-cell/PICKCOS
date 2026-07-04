/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'var(--font-noto-kr)', 'DM Sans', 'Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        ivory: '#F4F1EB',
        charcoal: '#3D3D3B',
        sage: '#8F9B8E',
        'forest-sage': '#6B7C6E',
        'sand-beige': '#C8C3B8',
        rose: '#A8523E',
        coral: '#C4785E',
        'deep-clay': '#7B3B30',
        blush: '#F5EDE8',
        'warm-petal': '#DEB8A0',
        'warm-white': '#F8F1E8',
        'clay-beige': '#D5C4B3',
        'nude-taupe': '#B68E7A',
        'burnt-sienna': '#AF6141',
        'soft-gray': '#E8E6E3',
        'silver-mist': '#C2C0BE',
        'neutral-gray': '#6B6B6D',
        'mocha-gray': '#524D49',
        graphite: '#3A3836',
        border: '#E0DDD8',
      },
      borderRadius: {
        'pill': '100px',
        'card': '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        'soft': '0 2px 40px rgba(0,0,0,0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'button': '0 1px 4px rgba(0,0,0,0.06)',
        'toast': '0 4px 20px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
