# Assets Organization

## Official Logo Files

### Main Logo (Official)
- `logo-official.svg` - Logo oficial com texto "CRYPTO ZAP" (fundo bege)
- `logo-official.png` - Logo oficial PNG (substitua pelo arquivo original)
- `logo-official-white.svg` - Logo oficial com fundo branco para fundos escuros
- `logo-official-white.png` - Logo oficial PNG branco (substitua pelo arquivo original)
- `logo-official-icon.svg` - Apenas o ícone oficial (sem texto)
- `logo-official-icon.png` - Ícone oficial PNG (substitua pelo arquivo original)

### Legacy Logo Files (Deprecated)
- `logo.svg` - Logo anterior (mantido para compatibilidade)
- `logo-white.svg` - Logo anterior branco
- `logo-icon.svg` - Ícone anterior

### Favicon
- `client/public/favicon.svg` - Favicon atual
- `client/public/favicon-official.svg` - Favicon oficial baseado na logo
- `client/public/favicon.ico` - Favicon ICO (substitua pelo arquivo original)

## Usage

### In React Components (Recommended)
```tsx
// Use official logo files
import logoOfficial from '@/assets/logo-official.svg'
import logoOfficialWhite from '@/assets/logo-official-white.svg'
import logoOfficialIcon from '@/assets/logo-official-icon.svg'

// Use in components
<img src={logoOfficial} alt="Crypto Zap Official Logo" />
```

### In HTML
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon-official.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

## Design Specifications

- **Primary Colors:** 
  - Orange: `#ff6b35`
  - Beige: `#f5f5dc`
  - White: `#ffffff`

- **Typography:** Arial, sans-serif
- **Logo Size:** 200x120px (main), 80x80px (icon)
- **Favicon Size:** 32x32px

## File Structure
```
client/
├── public/
│   ├── favicon.svg           # Current favicon
│   ├── favicon-official.svg  # Official favicon
│   └── favicon.ico           # Fallback favicon
└── src/
    └── assets/
        ├── logo-official.svg      # Official main logo
        ├── logo-official.png      # Official PNG (replace)
        ├── logo-official-white.svg # Official white version
        ├── logo-official-white.png # Official white PNG (replace)
        ├── logo-official-icon.svg  # Official icon only
        ├── logo-official-icon.png  # Official icon PNG (replace)
        ├── logo.svg               # Legacy logo
        ├── logo-white.svg         # Legacy white logo
        ├── logo-icon.svg          # Legacy icon
        └── README.md              # This documentation
```

## Migration Guide

### To use official logo:
1. Replace placeholder PNG files with your official files
2. Update imports in components to use `logo-official.svg`
3. Update favicon reference to use `favicon-official.svg`

### Recommended sizes:
- **Main logo:** 200x120px
- **Icon:** 80x80px  
- **Favicon:** 32x32px 