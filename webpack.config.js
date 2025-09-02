const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

// Function to encode HTML content for source code obfuscation
function encodeHtmlForSourceView(content) {
  // Encode HTML tags and special characters for source code view
  // This will make the source code look encoded while keeping it functional
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '&#10;')
    .replace(/\r/g, '&#13;')
    .replace(/\t/g, '&#9;');
}

// Custom plugin to create encoded HTML for Cloudflare
class CloudflareHtmlEncodePlugin {
  constructor(options = {}) {
    this.options = {
      inputFile: 'index.html',
      outputFile: 'index.html',
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('CloudflareHtmlEncodePlugin', (compilation) => {
      const htmlPath = path.resolve(__dirname, this.options.inputFile);
      const outputPath = path.resolve(__dirname, 'dist', this.options.outputFile);
      
      if (fs.existsSync(htmlPath)) {
        try {
          let htmlContent = fs.readFileSync(htmlPath, 'utf8');
          
          // Create a special encoded version that renders normally but shows encoded in source
          // We'll use a technique that makes the browser render it normally
          // but the source code shows encoded content
          
          // First, encode the entire HTML
          const encodedContent = encodeHtmlForSourceView(htmlContent);
          
          // Create a JavaScript-based HTML renderer that will decode and display the content
          const finalHtml = `<!DOCTYPE html>
                            <html>
                            <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Document</title>
                              <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
                              <link rel="stylesheet" href="styles.css">
                            </head>
                            <body>
                              <div id="app"></div>
                              <script>
                                // Decode and render the HTML content
                                (function() {
                                  const encodedContent = \`${encodedContent}\`;
                                  
                                  // Decode HTML entities
                                  function decodeHtml(html) {
                                    const textarea = document.createElement('textarea');
                                    textarea.innerHTML = html;
                                    return textarea.value;
                                  }
                                  
                                  // Render the decoded content
                                  document.getElementById('app').innerHTML = decodeHtml(encodedContent);
                                })();
                              </script>
                              <script src="jaosua-sdk.js"></script>
                            </body>
                            </html>`;
          
          // Write the encoded HTML to dist folder
          fs.writeFileSync(outputPath, finalHtml);
          console.log(`✅ Cloudflare HTML created: ${this.options.outputFile}`);
          console.log(`   - Renders normally in browser`);
          console.log(`   - Shows encoded HTML in source code`);
        } catch (error) {
          console.error('❌ Error creating Cloudflare HTML:', error.message);
        }
      } else {
        console.warn(`⚠️  HTML file not found: ${htmlPath}`);
      }
    });
  }
}

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "jaosua-sdk.js",
    library: "JaosuaSDK",
    libraryTarget: "umd",
    globalObject: "this",
  },
  mode: "production",
  target: "web",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "firebase-messaging-sw.js",
          to: "firebase-messaging-sw.js",
        },
        {
          from: "styles.css",
          to: "styles.css",
        },
        {
          from: "_headers",
          to: "_headers",
          noErrorOnMissing: true,
        },
      ],
    }),
    new CloudflareHtmlEncodePlugin({
      inputFile: 'index.html',
      outputFile: 'index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
