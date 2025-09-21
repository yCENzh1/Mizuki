/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
const fs = require("fs")
const path = require("path")

// 简化的字体配置加载
let fontConfig = {};
try {
  const configPath = path.join(__dirname, 'src', 'config.json');
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  if (configData.fonts && configData.fonts.enable) {
    fontConfig = {
      sans: [configData.fonts.global.fontFamily, ...configData.fonts.global.fallback],
      mono: [configData.fonts.code.fontFamily, ...configData.fonts.code.fallback]
    };
  }
} catch (error) {
  console.warn("Failed to load font config, using defaults:", error.message);
}

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: fontConfig.sans || ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
        mono: fontConfig.mono || [...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
