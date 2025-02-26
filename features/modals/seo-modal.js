// SEO Modal Module
window.SEOModal = {
  // Helper function to generate different favicon sizes
  async generateFaviconSizes(originalImage) {
    console.log('Starting favicon generation for sizes:', [16, 32, 48, 96, 144, 192]);
    const sizes = [16, 32, 48, 96, 144, 192];
    const favicons = {};
    
    for (const size of sizes) {
      console.log(`Processing size ${size}x${size}`);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;
      
      // Use better quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and resize image
      ctx.drawImage(originalImage, 0, 0, size, size);
      console.log(`Drew image at ${size}x${size}`);
      
      // Get data URL for preview
      const dataUrl = canvas.toDataURL('image/png');
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      console.log(`Created blob for ${size}x${size}, size: ${blob.size} bytes`);
      
      // Create file from blob
      const file = new File([blob], `favicon-${size}x${size}.png`, { type: 'image/png' });
      console.log(`Created file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      
      favicons[size] = {
        size: size,
        file: file,
        dataUrl: dataUrl
      };
      console.log(`Created data URL for ${size}x${size}`);
    }
    
    console.log('Completed favicon generation:', favicons);
    return favicons;
  },

  create() {
    const modal = document.createElement('div');
    modal.id = 'lovify-seo-modal';
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity overflow-y-auto py-8';
    modal.innerHTML = `
      <div class="bg-[#18181B]/90 backdrop-blur-sm rounded-lg border border-zinc-700/50 shadow-xl w-full max-w-7xl mx-4 max-h-[calc(100vh-4rem)]">
        <div class="p-4 border-b border-zinc-700/50">
          <h2 class="text-lg font-medium">SEO Settings</h2>
        </div>
        
        <div class="flex">
          <!-- Left side - Form -->
          <div class="w-1/2 p-6 border-r border-zinc-700/50 space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1">Page Title</label>
              <input type="text" class="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm" placeholder="Enter page title">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Meta Description</label>
              <textarea class="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm h-20" placeholder="Enter meta description"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Favicon</label>
              <div class="flex items-start gap-4">
                <div class="flex-1">
                  <label class="flex flex-col items-center justify-center w-full h-24 bg-zinc-800 border border-zinc-700 border-dashed rounded-md cursor-pointer hover:bg-zinc-800/70">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6" id="upload-placeholder">
                      <svg class="w-8 h-8 mb-2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <p class="text-sm text-zinc-500">Upload favicon</p>
                    </div>
                    <div class="hidden items-center justify-center w-full h-full" id="preview-container">
                      <div class="space-y-2">
                        <div class="flex items-center justify-center">
                          <img id="favicon-preview-192" class="w-12 h-12 rounded" src="" alt="192x192">
                          <img id="favicon-preview-96" class="w-8 h-8 mx-2 rounded" src="" alt="96x96">
                          <img id="favicon-preview-32" class="w-6 h-6 rounded" src="" alt="32x32">
                        </div>
                        <p class="text-xs text-zinc-500 text-center">Preview at different sizes</p>
                      </div>
                    </div>
                    <input type="file" class="hidden" id="favicon-upload" accept="image/*">
                  </label>
                </div>
                <div class="space-y-2">
                  <p class="text-xs text-zinc-500">Recommended:</p>
                  <ul class="text-xs text-zinc-500 list-disc pl-4">
                    <li>Square image (1:1)</li>
                    <li>At least 192x192 pixels</li>
                    <li>PNG format preferred</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">OG Image</label>
              <div class="flex items-start gap-4">
                <div class="flex-1">
                  <label class="flex flex-col items-center justify-center w-full h-32 bg-zinc-800 border border-zinc-700 border-dashed rounded-md cursor-pointer hover:bg-zinc-800/70">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6" id="og-upload-placeholder">
                      <svg class="w-8 h-8 mb-2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <p class="text-sm text-zinc-500">Upload OG image</p>
                    </div>
                    <div class="hidden w-full h-full" id="og-preview-container">
                      <img id="og-preview" class="w-full h-full object-cover rounded" src="" alt="OG Preview">
                    </div>
                    <input type="file" class="hidden" id="og-upload" accept="image/*">
                  </label>
                </div>
                <div class="space-y-2">
                  <p class="text-xs text-zinc-500">Recommended:</p>
                  <ul class="text-xs text-zinc-500 list-disc pl-4">
                    <li>1200x630 pixels (will be auto-resized)</li>
                    <li>Less than 1MB</li>
                    <li>JPG or PNG format</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Google Analytics</label>
              <div class="space-y-4">
                <textarea class="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm h-24 font-mono" placeholder="Paste your Google Analytics script tag here"></textarea>
                <div class="text-xs text-zinc-500 space-y-2">
                  <p>To get your Google Analytics script:</p>
                  <ol class="list-decimal pl-4 space-y-1">
                    <li>Go to <a href="https://analytics.google.com" target="_blank" class="text-violet-400 hover:underline">analytics.google.com</a></li>
                    <li>Go to Admin > Property Settings > Tracking Info > Tracking Code</li>
                    <li>Copy the entire <span class="font-mono text-zinc-400">&lt;script&gt;</span> tag provided</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side - Previews -->
          <div class="w-1/2 p-6 space-y-6 bg-zinc-950/30 backdrop-blur-sm">
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-zinc-400">Preview URL</h3>
              <div class="flex h-12 w-full items-center justify-between overflow-hidden rounded-t-xl border border-border bg-background px-3">
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center gap-[4px] px-1.5 text-sm">
                    <p class="callout text-muted-foreground" id="preview-domain">preview--retro-terminal-blocks.lovable.app</p>
                    <p class="callout text-muted-foreground">/</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-sm font-medium text-zinc-400">Social Media Preview</h3>
              <div id="social-preview" class="hidden">
                <div class="bg-white rounded-md overflow-hidden text-black">
                  <div class="aspect-[1200/630] w-full relative bg-black flex items-center justify-center">
                    <img id="social-preview-img" class="w-full h-full object-contain" src="" alt="Social Preview">
                  </div>
                  <div class="p-3 border-t border-gray-200">
                    <div class="text-[14px] font-medium text-[#1d2129] line-clamp-2" id="social-preview-title"></div>
                    <div class="text-[12px] text-[#606770] mt-1 line-clamp-2" id="social-preview-desc"></div>
                    <div class="text-[12px] text-[#606770] mt-1 uppercase" id="social-preview-url"></div>
                  </div>
                </div>
              </div>
              <div id="social-preview-placeholder" class="bg-zinc-800 rounded-md p-4 text-zinc-500 text-sm text-center h-[400px] flex items-center justify-center">
                Upload an OG image to see how your content will appear on social media
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-sm font-medium text-zinc-400">Google Search Preview</h3>
              <div id="google-preview" class="bg-white rounded-md p-4 text-black hidden">
                <div class="google-preview-title text-[20px] font-normal hover:underline cursor-pointer leading-[1.3]" id="google-preview-title"></div>
                <div class="google-preview-url text-[14px] leading-[1.3] mt-1" id="google-preview-url"></div>
                <div class="google-preview-desc text-[14px] leading-[1.6] mt-[2px]" id="google-preview-desc"></div>
              </div>
              <div id="google-preview-placeholder" class="bg-zinc-800 rounded-md p-4 text-zinc-500 text-sm text-center">
                Add a title and description to see how your page will appear in search results
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-zinc-700/50 flex justify-end gap-2">
          <button class="px-4 py-2 text-sm font-medium rounded-md hover:bg-zinc-800" data-action="cancel">Cancel</button>
          <button class="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 rounded-md" data-action="generate">Generate</button>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Handle favicon upload
    const faviconUpload = modal.querySelector('#favicon-upload');
    const uploadPlaceholder = modal.querySelector('#upload-placeholder');
    const previewContainer = modal.querySelector('#preview-container');
    let faviconData = null;

    // Handle OG image upload
    const ogUpload = modal.querySelector('#og-upload');
    const ogUploadPlaceholder = modal.querySelector('#og-upload-placeholder');
    const ogPreviewContainer = modal.querySelector('#og-preview-container');
    const socialPreview = modal.querySelector('#social-preview');
    const googlePreview = modal.querySelector('#google-preview');
    let ogImageData = null;

    // Update preview function
    const updatePreviews = () => {
      const title = modal.querySelector('input[placeholder="Enter page title"]').value || 'Your Page Title';
      const description = modal.querySelector('textarea[placeholder="Enter meta description"]').value || 'Your page description will appear here. Make it compelling and informative to attract more clicks!';
      const domain = 'preview--retro-terminal-blocks.lovable.app';

      // Update preview domain
      modal.querySelector('#preview-domain').textContent = domain;

      // Update social preview
      modal.querySelector('#social-preview-title').textContent = title;
      modal.querySelector('#social-preview-desc').textContent = description;
      modal.querySelector('#social-preview-url').textContent = domain;

      // Update Google preview
      modal.querySelector('#google-preview-title').textContent = title;
      modal.querySelector('#google-preview-url').textContent = `https://${domain}`;
      modal.querySelector('#google-preview-desc').textContent = description;

      // Show/hide preview placeholders
      const hasContent = title || description;
      modal.querySelector('#google-preview').style.display = hasContent ? 'block' : 'none';
      modal.querySelector('#google-preview-placeholder').style.display = hasContent ? 'none' : 'block';
    };

    // Add input listeners for live preview updates
    modal.querySelector('input[placeholder="Enter page title"]').addEventListener('input', updatePreviews);
    modal.querySelector('textarea[placeholder="Enter meta description"]').addEventListener('input', updatePreviews);

    faviconUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      console.log('File selected:', file.name, 'type:', file.type, 'size:', file.size);

      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          console.log('File read successfully');
          const base64 = e.target.result;
          
          // Create an image element to get dimensions
          const img = new Image();
          img.onload = async () => {
            console.log('Image loaded, dimensions:', img.width, 'x', img.height);
            // Generate different favicon sizes
            faviconData = await this.generateFaviconSizes(img);
            
            // Update previews using data URLs
            console.log('Updating preview images');
            modal.querySelector('#favicon-preview-192').src = faviconData[192].dataUrl;
            modal.querySelector('#favicon-preview-96').src = faviconData[96].dataUrl;
            modal.querySelector('#favicon-preview-32').src = faviconData[32].dataUrl;
            
            uploadPlaceholder.style.display = 'none';
            previewContainer.style.display = 'flex';
            console.log('Preview container updated');
          };
          img.src = base64;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing favicon:', error);
      }
    });

    ogUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target.result;
          
          // Create an image element
          const img = new Image();
          img.onload = async () => {
            // Create a canvas to resize the image to the correct OG dimensions
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1200;
            canvas.height = 630;
            
            // Use better quality settings
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Calculate dimensions to maintain aspect ratio and center
            const scale = Math.min(1200 / img.width, 630 / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (1200 - scaledWidth) / 2;
            const y = (630 - scaledHeight) / 2;
            
            // Fill background with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw and resize image centered
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // Get data URL for preview
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.95);
            
            // Create a file from the resized image
            const response = await fetch(resizedBase64);
            const blob = await response.blob();
            ogImageData = new File([blob], 'og-image.jpg', { type: 'image/jpeg' });
            
            // Update previews
            const ogPreview = modal.querySelector('#og-preview');
            const socialPreviewImg = modal.querySelector('#social-preview-img');
            
            // Set the source and ensure images are loaded
            ogPreview.src = resizedBase64;
            socialPreviewImg.src = resizedBase64;
            
            // Wait for images to load
            await Promise.all([
              new Promise(resolve => ogPreview.onload = resolve),
              new Promise(resolve => socialPreviewImg.onload = resolve)
            ]);
            
            // Show previews
            ogUploadPlaceholder.style.display = 'none';
            ogPreviewContainer.style.display = 'block';
            socialPreview.style.display = 'block';
            modal.querySelector('#social-preview-placeholder').style.display = 'none';
            
            updatePreviews();
          };
          img.src = base64;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing OG image:', error);
      }
    });

    modal.querySelector('[data-action="generate"]').addEventListener('click', () => {
      console.log('Generate button clicked');
      const textarea = document.querySelector('textarea');
      if (!textarea) {
        console.log('No textarea found');
        return;
      }

      // Get values from inputs
      const title = modal.querySelector('input[placeholder="Enter page title"]').value;
      const description = modal.querySelector('textarea[placeholder="Enter meta description"]').value;
      const gaScript = modal.querySelector('textarea[placeholder="Paste your Google Analytics script tag here"]').value;
      const domain = modal.querySelector('#preview-domain').textContent;

      console.log('Form values:', { title, description });

      // Generate the SEO configuration
      let seoConfig = "I'd like to set up SEO and metadata for my project. Here's what I need:\n\n";
      
      // Basic Metadata
      seoConfig += "1. Basic Metadata\n";
      seoConfig += "Please update the following:\n";
      if (title) seoConfig += `- Page Title: "${title}"\n`;
      if (description) seoConfig += `- Meta Description: "${description}"\n`;
      seoConfig += `- Site URL: https://${domain}\n\n`;
      
      // Favicon Setup
      if (faviconData) {
        seoConfig += "2. Favicon Setup\n";
        seoConfig += "I've attached favicon images for these sizes:\n";
        seoConfig += "- 192x192 (favicon-192x192.png)\n";
        seoConfig += "- 96x96 (favicon-96x96.png)\n";
        seoConfig += "- 32x32 (favicon-32x32.png)\n";
        seoConfig += "- 16x16 (favicon-16x16.png)\n\n";
        
        seoConfig += "Implementation:\n";
        seoConfig += "```html\n";
        seoConfig += "<!-- Favicons -->\n";
        seoConfig += '<link rel="icon" type="image/png" sizes="192x192" href="favicon-192x192.png">\n';
        seoConfig += '<link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">\n';
        seoConfig += '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">\n';
        seoConfig += '<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">\n';
        seoConfig += "```\n\n";
      }

      // Social Media Optimization
      seoConfig += "3. Social Media Optimization\n";
      if (ogImageData) {
        seoConfig += "I've attached an image (og-image.jpg) optimized for social media sharing (1200x630 pixels).\n\n";
      }
      seoConfig += "Please set up:\n";
      seoConfig += "```html\n";
      seoConfig += "<!-- Open Graph Tags -->\n";
      seoConfig += `<meta property="og:title" content="${title}">\n`;
      seoConfig += `<meta property="og:description" content="${description}">\n`;
      seoConfig += '<meta property="og:type" content="website">\n';
      seoConfig += `<meta property="og:url" content="https://${domain}">\n`;
      if (ogImageData) {
        seoConfig += '<meta property="og:image" content="og-image.jpg">\n';
        seoConfig += '<meta property="og:image:width" content="1200">\n';
        seoConfig += '<meta property="og:image:height" content="630">\n';
      }
      seoConfig += "\n<!-- Twitter Card Tags -->\n";
      seoConfig += '<meta name="twitter:card" content="summary_large_image">\n';
      seoConfig += `<meta name="twitter:title" content="${title}">\n`;
      seoConfig += `<meta name="twitter:description" content="${description}">\n`;
      if (ogImageData) {
        seoConfig += '<meta name="twitter:image" content="og-image.jpg">\n';
      }
      seoConfig += "```\n\n";

      // Analytics
      if (gaScript) {
        seoConfig += "4. Analytics\n";
        seoConfig += "Please add this analytics script before the closing </head> tag:\n";
        seoConfig += "```html\n";
        seoConfig += gaScript + "\n";
        seoConfig += "```\n\n";
      }

      // Structured Data
      seoConfig += "5. Structured Data\n";
      seoConfig += "Add Schema.org markup appropriate for my site type:\n";
      seoConfig += "```json\n";
      seoConfig += "{\n";
      seoConfig += '  "@context": "https://schema.org",\n';
      seoConfig += '  "@type": "WebApplication",\n';
      seoConfig += `  "name": "${title}",\n`;
      seoConfig += `  "description": "${description}",\n`;
      seoConfig += `  "url": "https://${domain}",\n`;
      if (ogImageData) {
        seoConfig += '  "image": "og-image.jpg",\n';
      }
      seoConfig += '  "applicationCategory": "WebApplication"\n';
      seoConfig += "}\n";
      seoConfig += "```\n\n";

      // Additional Notes
      seoConfig += "Additional Notes:\n";
      if (faviconData) {
        seoConfig += "- Favicon files are attached with the specified filenames\n";
      }
      if (ogImageData) {
        seoConfig += "- OG image is attached as og-image.jpg\n";
      }
      seoConfig += "- Please ensure all meta tags are properly encoded\n";
      seoConfig += "- Implement the schema.org markup in a <script type=\"application/ld+json\"> tag\n";

      // Create a DataTransfer object for all files
      const dataTransfer = new DataTransfer();
      
      // Add favicon files if they exist
      if (faviconData) {
        Object.values(faviconData).forEach(data => {
          dataTransfer.items.add(data.file);
        });
      }
      
      // Add OG image if it exists
      if (ogImageData) {
        dataTransfer.items.add(ogImageData);
      }

      // Find and update the file input
      const attachButton = document.querySelector('button:has(svg.lucide-image-plus)');
      if (attachButton) {
        const fileInput = attachButton.closest('div')?.querySelector('input[type="file"]');
        if (fileInput && dataTransfer.files.length > 0) {
          fileInput.files = dataTransfer.files;
          fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Update textarea value
      console.log('Updating textarea with SEO config');
      textarea.value = seoConfig;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.focus();
      
      modal.classList.remove('active');
      console.log('Modal closed');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        console.log('Modal closed by outside click');
        modal.classList.remove('active');
      }
    });

    return modal;
  },

  addStyles() {
    if (!document.querySelector('#lovify-seo-styles')) {
      const style = document.createElement('style');
      style.id = 'lovify-seo-styles';
      style.textContent = `
        #lovify-seo-modal.active {
          opacity: 1;
          pointer-events: auto;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        #lovify-seo-modal .bg-background {
          background-color: rgba(24, 24, 27, 0.9) !important;
          backdrop-filter: blur(8px);
        }

        #lovify-seo-modal .text-muted-foreground {
          color: rgb(161, 161, 170) !important;
        }

        #lovify-seo-modal .border-border {
          border-color: rgba(39, 39, 42, 0.5) !important;
        }

        /* Google Preview Specific Styles */
        #lovify-seo-modal #google-preview {
          background-color: white !important;
          color: black !important;
        }

        #lovify-seo-modal .google-preview-title {
          color: #1a0dab !important;
          font-family: arial, sans-serif !important;
        }

        #lovify-seo-modal .google-preview-url {
          color: #006621 !important;
          font-family: arial, sans-serif !important;
        }

        #lovify-seo-modal .google-preview-desc {
          color: #545454 !important;
          font-family: arial, sans-serif !important;
        }

        #lovify-seo-modal #google-preview * {
          text-align: left !important;
        }
      `;
      document.head.appendChild(style);
      console.log('Added SEO modal styles');
    }
  }
}; 
