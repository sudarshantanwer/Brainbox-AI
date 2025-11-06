# 🧠 Brainbox AI - Offline AI Chat Application

An intelligent offline chat application powered by WebLLM that runs entirely in your browser without requiring external API keys or internet connectivity after initial setup.

## ✨ Features

- 🤖 **Offline AI Chat**: Chat with AI models that run locally in your browser
- 🚀 **No API Keys**: No external dependencies or API keys required
- 📱 **Browser-based**: Works on any modern browser
- 🔒 **Privacy-focused**: All conversations stay in your browser
- ⚡ **Fast**: WebAssembly-powered inference
- 🎯 **Multiple Models**: TinyLlama (600MB) and Phi-3-mini (2GB) support

## 🚀 Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment Steps:

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/yourusername/brainbox-ai.git
   cd brainbox-ai
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select this repository
   - Render will auto-detect the configuration

3. **Configuration** (Auto-detected from `render.yaml`)
   - **Build Command**: `echo 'No build required - static files only'`
   - **Start Command**: `python server.py`
   - **Environment**: Python 3.9+

## 🛠️ Local Development

### Prerequisites
- Python 3.7+ (no additional packages required)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/brainbox-ai.git
cd brainbox-ai

# Start the development server
python3 run_server.py

# Or start the production server
python3 server.py
```

Visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
brainbox-ai/
├── index.html          # Main UI
├── app.js             # Core application logic
├── server.py          # Production server (Render)
├── run_server.py      # Development server
├── requirements.txt   # Python dependencies (none!)
├── render.yaml        # Render deployment config
├── lib/
│   └── web-llm.js    # WebLLM library (5.7MB)
└── models/           # Model info (no actual models stored)
```

## 🧠 How It Works

1. **WebLLM Integration**: Uses WebLLM library for browser-based AI inference
2. **Model Download**: AI models are downloaded automatically to browser storage on first use
3. **WebAssembly**: Leverages WebAssembly for fast, offline AI processing
4. **CORS Headers**: Properly configured for cross-origin requests

## 🎯 Supported Models

- **TinyLlama-1.1B** (~600MB) - Fast download, good for basic conversations
- **Phi-3-mini** (~2GB) - Better quality responses, slower initial download

## 🌐 Browser Compatibility

- ✅ Chrome 57+
- ✅ Firefox 52+  
- ✅ Safari 11+
- ✅ Edge 16+

## 📝 Usage

1. Open the application in your browser
2. Wait for the AI model to download (first time only)
3. Start chatting with the AI
4. All conversations remain private in your browser

## 🔧 Configuration

### Environment Variables (Render)
- `PORT`: Automatically set by Render
- `PYTHON_VERSION`: Set to 3.9 in render.yaml

### Custom Model Configuration
Edit the `models` array in `app.js` to use different WebLLM models:

```javascript
const models = [
    "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",
    "Phi-3-mini-4k-instruct-q4f16_1-MLC"
];
```

## 🚨 Important Notes

- **First Load**: Initial model download may take 2-3 minutes depending on your internet speed
- **Storage**: Models are cached in browser storage (IndexedDB)
- **Privacy**: All AI processing happens locally - no data sent to external servers
- **Performance**: Better performance on devices with more RAM

## 🐛 Troubleshooting

### Model Won't Load
- Check browser console for errors
- Ensure WebAssembly is enabled
- Try refreshing the page
- Clear browser cache if needed

### Slow Performance
- Try using TinyLlama model first
- Close other browser tabs
- Ensure sufficient RAM available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [WebLLM](https://github.com/mlc-ai/web-llm) - Browser-based LLM inference
- [MLC AI](https://mlc.ai/) - Machine Learning Compilation
- [Render](https://render.com/) - Easy deployment platform

---

**Built with ❤️ for privacy-focused AI conversations**
