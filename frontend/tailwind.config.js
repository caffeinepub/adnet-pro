import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                /* AD TRIBE brand utilities — forest green + saffron */
                saffron: {
                    DEFAULT: 'oklch(0.72 0.20 65)',
                    light: 'oklch(0.82 0.16 70)',
                    dark: 'oklch(0.55 0.18 60)',
                },
                forest: {
                    DEFAULT: 'oklch(0.28 0.10 145)',
                    light: 'oklch(0.42 0.14 145)',
                    deep: 'oklch(0.14 0.018 145)',
                },
                gold: {
                    DEFAULT: 'oklch(0.72 0.18 75)',
                    light: 'oklch(0.82 0.14 78)',
                    dark: 'oklch(0.55 0.16 70)',
                },
            },
            fontFamily: {
                display: ['"Bebas Neue"', 'Impact', 'Arial Narrow', 'sans-serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                'saffron': '0 4px 24px -4px oklch(0.72 0.20 65 / 0.45)',
                'forest': '0 4px 24px -4px oklch(0.38 0.12 145 / 0.40)',
                /* keep amber alias for backward compat with existing shadow-amber classes */
                'amber': '0 4px 24px -4px oklch(0.72 0.20 65 / 0.45)',
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.5s ease-out forwards',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        }
    },
    plugins: [typography, containerQueries, animate],
};
