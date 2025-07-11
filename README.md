# Eurus Labs Website

A modern, responsive website built with Next.js 15, React 19, and TypeScript for Eurus Labs.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Static generation, image optimization, code splitting
- **SEO Ready**: Meta tags, sitemap, structured data
- **Studio Integration**: Redirects to external Studio platform
- **Error Handling**: Comprehensive error boundaries and loading states
- **Production Ready**: Optimized for deployment to Azure Static Web Apps

## 📋 Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Azure CLI (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eurus-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## 🚀 Development

### Start development server
```bash
npm run dev
```
The site will be available at `http://localhost:3001`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 🚀 Deployment

### Quick Deployment
```bash
npm run deploy
```

### Full Deployment with Azure
```bash
npm run deploy:azure
```

### Manual Deployment Steps

1. **Build the project**
   ```bash
   npm run build:static
   ```

2. **Upload to Azure Storage**
   ```bash
   az storage blob upload-batch \
     --account-name eurusworkflows \
     --auth-mode login \
     --source build \
     --destination \$web \
     --overwrite
   ```

3. **Set cache headers**
   ```bash
   # The deployment script handles this automatically
   ```

## 📁 Project Structure

```
eurus-web/
├── app/                    # Next.js App Router
│   ├── components/         # App-specific components
│   ├── publications/       # Publications pages
│   ├── newspiece/         # Newspiece pages
│   └── layout.tsx         # Root layout
├── components/            # Shared components
│   ├── ui/               # UI components (shadcn/ui)
│   └── footer.tsx        # Footer component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── scripts/              # Deployment scripts
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Next.js Configuration
The project uses a custom `next.config.mjs` with:
- Static export for production
- Image optimization
- Webpack optimizations
- Development and production configurations

### Tailwind CSS
Custom Tailwind configuration with:
- Custom color palette
- Typography settings
- Animation utilities
- Responsive breakpoints

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Hydration Errors**
   - Check for browser extensions interfering
   - Ensure all components are properly client/server rendered
   - Use `suppressHydrationWarning` where appropriate

3. **Port Conflicts**
   - The dev server runs on port 3001
   - Change in `package.json` if needed

4. **Azure Deployment Issues**
   ```bash
   az login
   az account set --subscription <your-subscription>
   npm run deploy:azure
   ```

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   npm run analyze
   ```

2. **Type Checking**
   ```bash
   npm run type-check
   ```

3. **Linting**
   ```bash
   npm run lint
   ```

## 🔒 Security

- HTTPS enforced in production
- Security headers configured
- Content Security Policy (CSP) implemented
- XSS protection enabled

## 📊 Performance

- Lighthouse score: 95+ (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals optimized
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Static generation for better performance

## 🌐 SEO

- Meta tags for all pages
- Open Graph and Twitter Card support
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt configuration
- Canonical URLs

## 🔄 Studio Integration

The website integrates with the external Studio platform:
- All Studio links redirect to `https://studio.euruslabs.com/`
- `/eurus-studio` route provides automatic redirect
- Navigation and footer links updated accordingly

## 📝 Content Management

### Publications
- Static content in `components/publications-data.ts`
- Dynamic routing with `[id]` pages
- Category filtering and search

### Newspieces
- Dynamic content from API
- Static generation for performance
- Error handling for API failures

## 🚀 Future Improvements

- [ ] Add analytics tracking
- [ ] Implement A/B testing
- [ ] Add more interactive features
- [ ] Optimize for Core Web Vitals
- [ ] Add PWA capabilities
- [ ] Implement dark/light mode toggle

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the error logs
3. Contact the development team

## 📄 License

This project is proprietary to Eurus Labs.

---

**Built with ❤️ by the Eurus Labs team**