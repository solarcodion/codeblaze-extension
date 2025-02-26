const seoPrompt = `# SEO Image Setup

## 1. Favicon Implementation
Please implement the following favicons in exact order (do not change sizes):
- favicon-192.png (192x192) - For Android Chrome
- favicon-96.png (96x96) - For Google TV
- favicon-32.png (32x32) - For default browser icon
- favicon-16.png (16x16) - For default browser icon small

## 2. Social Media Image Requirements
For the uploaded social image:
- Dimensions: 1200x630 pixels (if different size, must maintain 1.91:1 ratio)
- Format: JPG or PNG
- Max file size: 1MB
- Must be used consistently across:
  • Open Graph (Facebook/LinkedIn)
  • Twitter Cards
  • Schema.org structured data

## 3. Image Meta Tags
\`\`\`html
<!-- Favicons -->
<link rel="icon" type="image/png" sizes="192x192" href="[FAVICON_192_URL]">
<link rel="icon" type="image/png" sizes="96x96" href="[FAVICON_96_URL]">
<link rel="icon" type="image/png" sizes="32x32" href="[FAVICON_32_URL]">
<link rel="icon" type="image/png" sizes="16x16" href="[FAVICON_16_URL]">

<!-- Social Media Image -->
<meta property="og:image" content="[SOCIAL_IMAGE_URL]">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="[SOCIAL_IMAGE_URL]">
\`\`\`

Please ensure all image paths are absolute URLs and all images are properly optimized for web use.`; 