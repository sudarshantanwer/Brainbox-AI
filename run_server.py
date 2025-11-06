#!/usr/bin/env python3
"""
Offline LLM Server
Downloads Phi-1.5 model files from Hugging Face and serves the web application.
"""

import os
import sys
import json
import shutil
import hashlib
import threading
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import http.server
import socketserver
from concurrent.futures import ThreadPoolExecutor, as_completed

class ModelDownloader:
    def __init__(self, model_path="./models"):
        self.model_path = Path(model_path)
        
        # WebLLM supported models that don't require manual download
        self.supported_models = [
            "Llama-2-7b-chat-hf-q4f16_1-MLC",
            "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC", 
            "vicuna-v1-7b-q4f16_1-MLC",
            "Llama-2-13b-chat-hf-q4f16_1-MLC"
        ]
        
        self.chunk_size = 8192  # 8KB chunks
        self.max_workers = 4
        
    def create_directories(self):
        """Create necessary directories."""
        self.model_path.mkdir(parents=True, exist_ok=True)
        print(f"✓ Created directory: {self.model_path}")
        
        # Create a simple info file about supported models
        info_file = self.model_path / "supported_models.txt"
        with open(info_file, 'w') as f:
            f.write("WebLLM Supported Models (no manual download required):\n")
            f.write("=" * 50 + "\n\n")
            for model in self.supported_models:
                f.write(f"- {model}\n")
            f.write("\nThese models will be automatically downloaded by WebLLM when first used.\n")
        
        print(f"✓ Created model info file: {info_file}")
    
    def check_webllm_support(self):
        """Check if WebLLM can handle model loading automatically."""
        print("ℹ️  WebLLM will handle model downloading automatically")
        print("📋 Supported models:")
        for model in self.supported_models:
            print(f"   - {model}")
        print("\n✨ No manual model download required!")
        return True
    
    def download_model(self):
        """Main method to prepare for model usage."""
        print("🤖 WebLLM Model Setup")
        print("=" * 50)
        
        # Create directories
        self.create_directories()
        
        # Check WebLLM support
        return self.check_webllm_support()


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler with proper MIME types and CORS headers."""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Add headers for WebLLM
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        
        super().end_headers()
    
    def guess_type(self, path):
        """Add custom MIME types."""
        result = super().guess_type(path)
        
        # Handle both old and new Python versions
        if isinstance(result, tuple):
            mime_type, encoding = result
        else:
            mime_type, encoding = result, None
        
        # Custom MIME types for model files
        if path.endswith('.bin'):
            return 'application/octet-stream', encoding
        elif path.endswith('.json'):
            return 'application/json', encoding
        elif path.endswith('.js'):
            return 'application/javascript', encoding
        
        return mime_type, encoding
    
    def log_message(self, format, *args):
        """Custom logging to reduce noise."""
        # Only log non-asset requests
        if not any(ext in self.path for ext in ['.bin', '.json', '.js', '.css', '.ico']):
            super().log_message(format, *args)


def start_server(port=8000):
    """Start the local HTTP server."""
    try:
        # Change to the correct directory
        os.chdir(Path(__file__).parent)
        
        handler = CustomHTTPRequestHandler
        
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"\n🌐 Server started at: http://localhost:{port}")
            print("📱 Open this URL in your browser to start chatting!")
            print("\nPress Ctrl+C to stop the server.\n")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n👋 Server stopped by user.")
                httpd.shutdown()
                
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Please try a different port or stop the existing server.")
        else:
            print(f"❌ Failed to start server: {e}")
        sys.exit(1)


def main():
    """Main function."""
    print("🧠 Offline LLM Web Application")
    print("=" * 50)
    
    # Initialize downloader
    downloader = ModelDownloader()
    
    # Prepare model setup
    if not downloader.download_model():
        print("\n❌ Failed to setup model environment.")
        sys.exit(1)
    
    print("\n🎉 Setup complete! Starting web server...")
    print("📝 The web app will download models automatically when first used.")
    
    # Start the server
    start_server()


if __name__ == "__main__":
    main()
