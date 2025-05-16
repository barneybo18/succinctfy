/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this path correctly points to your source files
  ],
  safelist: [
    // These are the patterns for your dynamic accent colors
    ...['blue', 'pink', 'green', 'purple', 'orange'].flatMap(color => [
      `bg-${color}-50`,
      `bg-${color}-100`,
      `bg-${color}-200`,
      `disabled:bg-${color}-300`,
      `bg-${color}-500`,
      `hover:bg-${color}-600`,
      `bg-${color}-600`,
      `text-${color}-600`,
      `text-${color}-700`,
    ])
  ],
  theme: {
    extend: {
      // Any other theme extensions you might have
    },
  },
  plugins: [
    // Any other Tailwind plugins you might be using
  ],
}