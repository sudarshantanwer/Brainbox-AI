#!/usr/bin/env python3
"""
Download WebLLM library locally as fallback
"""

import os
import urllib.request
import urllib.error

def download_webllm():
    """Download WebLLM library to serve locally."""
    
    print("🔄 Downloading WebLLM library as fallback...")
    
    # Create lib directory
    lib_dir = "./lib"
    os.makedirs(lib_dir, exist_ok=True)
    
    # WebLLM URLs to try
    urls = [
        "https://unpkg.com/@mlc-ai/web-llm@latest/dist/index.js",
        "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@latest/dist/index.js",
        "https://unpkg.com/@mlc-ai/web-llm/dist/index.js"
    ]
    
    for url in urls:
        try:
            print(f"Trying to download from: {url}")
            
            with urllib.request.urlopen(url, timeout=30) as response:
                content = response.read()
                
                # Save to local file
                local_path = os.path.join(lib_dir, "web-llm.js")
                with open(local_path, 'wb') as f:
                    f.write(content)
                
                print(f"✅ Successfully downloaded WebLLM to: {local_path}")
                print(f"📦 File size: {len(content)} bytes")
                
                return True
                
        except Exception as e:
            print(f"❌ Failed to download from {url}: {e}")
            continue
    
    print("❌ Failed to download WebLLM from all sources")
    return False

if __name__ == "__main__":
    download_webllm()
