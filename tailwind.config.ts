import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                twilight: {
                    blue: {
                        950: "#0c1832",
                        900: "#0f2554",
                        800: "#1a3a7c",
                        700: "#1e40af",
                        600: "#2563eb",
                        500: "#3b82f6",
                        400: "#60a5fa",
                        100: "#dbeafe",
                        50: "#eff6ff",
                    },
                    // Updated to match the bright lime-green from SmartBus branding
                    green: {
                        700: "#047857",
                        600: "#059669",
                        500: "#10b981",  // Emerald green
                        400: "#34d399",
                        300: "#6ee7b7",
                        200: "#a7f3d0",
                        100: "#d1fae5",
                        50: "#ecfdf5",
                    },
                },
            },
            fontSize: {
                xs: ["11px", { lineHeight: "16px" }],
                sm: ["13px", { lineHeight: "20px" }],
                base: ["14px", { lineHeight: "22px" }],
                lg: ["16px", { lineHeight: "24px" }],
                xl: ["18px", { lineHeight: "28px" }],
                "2xl": ["22px", { lineHeight: "30px" }],
                "3xl": ["28px", { lineHeight: "36px" }],
            },
            animation: {
                "fade-in": "fadeIn 0.2s ease-out",
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0", transform: "translateY(4px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
