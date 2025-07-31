# Assets Organization

## Logo Files

### Main Logo
- `logo.svg` - Logo principal com texto "CRYPTO ZAP" (fundo bege)
- `logo-white.svg` - Logo com fundo branco para uso em fundos escuros
- `logo-icon.svg` - Apenas o ícone (sem texto) para botões e elementos menores

### Favicon
- `client/public/favicon.svg` - Favicon SVG (32x32)
- `client/public/favicon.ico` - Favicon ICO (substitua pelo arquivo original)

## Usage

### In React Components
```tsx
import logo from '@/assets/logo.svg'
import logoWhite from '@/assets/logo-white.svg'
import logoIcon from '@/assets/logo-icon.svg'

// Use in components
<img src={logo} alt="Crypto Zap Logo" />
```

### In HTML
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
│   ├── favicon.svg      # Browser favicon
│   └── favicon.ico      # Fallback favicon
└── src/
    └── assets/
        ├── logo.svg      # Main logo
        ├── logo-white.svg # White version
        └── logo-icon.svg  # Icon only
``` 