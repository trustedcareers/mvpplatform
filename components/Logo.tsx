import Image from 'next/image';
import Link from 'next/link';

type LogoVariant = 'mark' | 'horizontal' | 'stacked' | 'full' | 'full-dark' | 'white';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  asLink?: boolean;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 120, height: 32 },
  xl: { width: 150, height: 40 },
  '2xl': { width: 200, height: 50 },
};

const variantMap: Record<LogoVariant, { src: string, alt: string, defaultSize: LogoSize }> = {
  mark: { src: '/logos/logo-mark.svg', alt: 'Trusted Logo Mark', defaultSize: 'md' },
  horizontal: { src: '/logos/logo-horizontal.svg', alt: 'Trusted Logo', defaultSize: 'lg' },
  stacked: { src: '/logos/logo-stacked.svg', alt: 'Trusted Logo', defaultSize: 'xl' },
  full: { src: '/logos/logo-full.svg', alt: 'Trusted Logo', defaultSize: 'xl' },
  'full-dark': { src: '/logos/logo-full-dark.svg', alt: 'Trusted Logo', defaultSize: 'xl' },
  white: { src: '/logos/logo-white.svg', alt: 'Trusted Logo', defaultSize: 'lg' },
};

const Logo = ({ variant = 'horizontal', size, className, asLink = false }: LogoProps) => {
  const { src, alt, defaultSize } = variantMap[variant];
  const { width, height } = sizeMap[size || defaultSize];

  const logoImage = (
    <span className={className} style={{ display: 'inline-block', lineHeight: 0 }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
        priority
      />
    </span>
  );

  if (asLink) {
    return <Link href="/dashboard">{logoImage}</Link>;
  }

  return logoImage;
};

export default Logo; 