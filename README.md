# 🧠 Brainbox AI - Offline AI Chat Application

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

A fully offline AI chat application that runs entirely in your browser using WebLLM. No server-side processing, no API keys required, and complete privacy - all AI inference happens locally on your device.

## 🌟 Features

- **🔒 100% Private**: All AI processing happens locally in your browser
- **🌐 Offline Capable**: Works without internet connection (after initial model download)
- **⚡ Fast Response**: No network latency for AI responses
- **🎨 Modern UI**: Beautiful, responsive chat interface
- **📱 Mobile Friendly**: Works on desktop, tablet, and mobile devices
- **🤖 Multiple Models**: Support for various AI models (TinyLlama, Phi-3, etc.)
- **🔧 Browser Compatibility**: Automatic WebAssembly and browser feature detection

## 🚀 Live Demo

🌐 **[Try it live on Render](https://brainbox-ai-mppg.onrender.com)**

*Note: First load may take a few minutes as the AI model downloads to your browser.*

## 📋 Requirements

### Browser Requirements
- **Modern Browser**: Chrome 90+, Firefox 89+, Safari 14+, Edge 90+
- **WebAssembly Support**: Required for AI model execution
- **SharedArrayBuffer**: Required for optimal performance
- **HTTPS**: Required for some WebLLM features

### System Requirements
- **RAM**: 4GB+ recommended (models run in browser memory)
- **Storage**: 1-4GB free space (for model caching)
- **Internet**: Required for initial model download only

## 🛠️ Installation & Setup

### Option 1: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/sudarshantanwer/Brainbox-AI.git
   cd Brainbox-AI
   ```

2. **Start the server**
   ```bash
   python run_server.py
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Option 2: Deploy to Render

1. **Fork this repository** to your GitHub account

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repository
   - Configuration will be automatically detected from `render.yaml`

3. **Access your deployed app**
   - Your app will be available at `https://your-app-name.onrender.com`

### Option 3: Deploy to Other Platforms

- **Vercel**: Use for static deployment
- **Netlify**: For static hosting
- **Railway**: Similar to Render
- **GitHub Pages**: For static version only

## 📁 Project Structure

```
Brainbox-AI/
├── 📄 index.html              # Main web interface
├── 🎨 app.js                  # Frontend JavaScript logic
├── 🐍 run_server.py           # Python HTTP server
├── ⚙️ render.yaml             # Render deployment config
├── 📋 requirements.txt        # Python dependencies
├── 📚 README.md               # This file
├── 🚀 DEPLOYMENT.md           # Detailed deployment guide
├── 🔍 browser-check.html      # Browser compatibility checker
├── 📂 lib/                    # WebLLM library files
│   ├── web-llm.js
│   ├── web-llm-umd.js
│   └── webllm-global.js
└── 📂 models/                 # Model information
    └── supported_models.txt
```

## 🔧 Technical Architecture

### Frontend Components
- **HTML/CSS**: Modern, responsive UI with glassmorphism design
- **JavaScript**: WebLLM integration and chat functionality
- **WebLLM**: Machine learning inference in the browser
- **WebAssembly**: High-performance model execution

### Backend Components
- **Python HTTP Server**: Serves static files with proper MIME types
- **CORS Headers**: Configured for WebLLM compatibility
- **Cross-Origin Headers**: Required for SharedArrayBuffer support

### AI Models
- **TinyLlama-1.1B**: Lightweight model for quick responses
- **Phi-3-mini-4k**: More capable model for complex queries
- **Automatic Fallback**: Tries smaller models first, then larger ones

## 🎯 Usage

1. **First Visit**
   - The app will automatically download an AI model to your browser
   - This may take 2-5 minutes depending on your internet speed
   - Progress is shown with a loading bar

2. **Chatting**
   - Type your message in the input box
   - Press Enter or click the send button
   - AI responses are generated locally in your browser

3. **Offline Use**
   - After the initial model download, the app works offline
   - Models are cached in your browser for future use

## ⚙️ Configuration

### Environment Variables (Render)
```yaml
PORT: 10000                    # Automatically set by Render
PYTHON_VERSION: 3.11.4        # Python version
```

### Model Configuration
Models are automatically selected based on device capabilities:
- **Low-end devices**: TinyLlama-1.1B (faster, less capable)
- **High-end devices**: Phi-3-mini-4k (slower, more capable)

### Browser Settings
For optimal performance, ensure:
- **JavaScript enabled**
- **WebAssembly enabled**
- **Sufficient RAM available**
- **Hardware acceleration enabled**

## 🔒 Privacy & Security

- **No Data Collection**: No user data is sent to external servers
- **Local Processing**: All AI inference happens in your browser
- **No API Keys**: No external AI services required
- **HTTPS Support**: Secure connection for production deployments
- **No Logging**: Chat conversations are not stored or logged

## 🐛 Troubleshooting

### Common Issues

**"WebLLM library not loaded"**
- Refresh the page
- Check internet connection for initial load
- Try a different browser

**"Model initialization failed"**
- Ensure sufficient RAM (4GB+ recommended)
- Close other browser tabs to free memory
- Try using a smaller model

**Slow Performance**
- Close unnecessary browser tabs
- Use a device with more RAM
- Try the TinyLlama model for faster responses

**Browser Compatibility Issues**
- Use the built-in browser checker: Click "🔍 Open Browser Checker"
- Update your browser to the latest version
- Enable WebAssembly in browser settings

### Browser-Specific Issues

**Safari**
- Enable "Develop" menu → "Experimental Features" → "WebAssembly"
- Ensure SharedArrayBuffer is enabled

**Firefox**
- Set `dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled` to `true`
- Set `javascript.options.shared_memory` to `true`

**Chrome/Edge**
- Usually works out of the box
- Ensure hardware acceleration is enabled

## 🛡️ Deployment Security

### Production Considerations
- **HTTPS Required**: WebLLM requires secure contexts
- **CORS Configuration**: Properly configured for all origins
- **Content Security Policy**: Consider adding CSP headers
- **Resource Limits**: Monitor memory usage on hosting platform

### Render-Specific Notes
- **Free Tier Limitations**: Apps sleep after 15 minutes of inactivity
- **Cold Starts**: First request may take 30+ seconds
- **Memory Limits**: 512MB RAM on free tier
- **Build Time**: Initial deployment may take 5-10 minutes

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Test on multiple browsers
- Update documentation for new features
- Ensure backward compatibility

## 📚 Resources

- **WebLLM Documentation**: [https://webllm.mlc.ai/](https://webllm.mlc.ai/)
- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **WebAssembly Guide**: [https://webassembly.org/](https://webassembly.org/)
- **Browser Compatibility**: [https://caniuse.com/wasm](https://caniuse.com/wasm)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WebLLM Team**: For making browser-based AI possible
- **MLC LLM**: For the underlying ML compilation technology
- **Hugging Face**: For model hosting and distribution
- **Render**: For easy deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sudarshantanwer/Brainbox-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sudarshantanwer/Brainbox-AI/discussions)
- **Email**: [Your Email]

---

<div align="center">

**Made with ❤️ for Privacy-First AI**

*No servers, no tracking, just pure AI in your browser*

[🌟 Star this repo](https://github.com/sudarshantanwer/Brainbox-AI) • [🐛 Report Bug](https://github.com/sudarshantanwer/Brainbox-AI/issues) • [💡 Request Feature](https://github.com/sudarshantanwer/Brainbox-AI/issues)

</div>