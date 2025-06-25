/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
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
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			section: {
  				purple: '#faf5ff',
  				violet: '#f3e8ff',
  			},
  			card: '#ffffff',
  			anchor: {
  				DEFAULT: '#2e2a72',
  				light: '#4f4aa0',
  				dark: '#1f1b4e',
  				fg: '#ffffff',
  			},
  			brand: '#2e2a72',
  			success: '#10b981',
  			warning: '#f59e0b',
  			error: '#ef4444',
  			primary: {
  				DEFAULT: '#2e2a72',
  				gradient: 'linear-gradient(135deg, #2e2a72 0%, #9333ea 100%)',
  				hover: 'linear-gradient(135deg, #241f5c 0%, #7c2d12 100%)',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		backgroundImage: {
  			'hero-gradient': 'linear-gradient(135deg, #2e2a72 0%, #9333ea 100%)',
  			'primary-gradient': 'linear-gradient(135deg, #2e2a72 0%, #9333ea 100%)',
  			'primary-hover': 'linear-gradient(135deg, #241f5c 0%, #7c2d12 100%)',
  		},
  		fontFamily: {
  			heading: [
  				'var(--font-lato)',
  				'sans-serif'
  			],
  			body: [
  				'var(--font-montserrat)',
  				'sans-serif'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}; 