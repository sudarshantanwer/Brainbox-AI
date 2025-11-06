# 🚀 Quick Browser Setup Guide

## The Problem
Your browser doesn't support WebAssembly, which is required for offline AI to work.

## ✅ Quick Solutions (try in order):

### 1. **Update Your Browser** (Easiest)
- **Chrome**: Go to `chrome://settings/help` → Update automatically
- **Firefox**: Go to `about:support` → Check for updates
- **Edge**: Go to `edge://settings/help` → Update automatically
- **Safari**: Update through macOS System Updates

### 2. **Download Latest Browser** (Recommended)
- **Chrome**: https://www.google.com/chrome/ (Best compatibility)
- **Firefox**: https://www.mozilla.org/firefox/
- **Edge**: https://www.microsoft.com/edge

### 3. **Enable WebAssembly** (If disabled)

**Chrome/Edge:**
1. Type `chrome://flags/` in address bar
2. Search "WebAssembly"
3. Set to "Enabled"
4. Restart browser

**Firefox:**
1. Type `about:config` in address bar
2. Search `javascript.options.wasm`
3. Set to `true`
4. Restart browser

### 4. **Check Security Software**
- Disable browser extensions temporarily
- Try incognito/private mode
- Check if antivirus is blocking WebAssembly

## 🔍 Diagnostic Tool
Visit: `http://localhost:8000/browser-check.html`

This will show exactly what's wrong and provide specific solutions.

## 📋 Minimum Requirements
- **Chrome 57+** (March 2017)
- **Firefox 52+** (March 2017)  
- **Safari 11+** (September 2017)
- **Edge 16+** (Fall 2017)

## ⚡ Quick Test
After updating, try: `http://localhost:8000`

---
**Still having issues?** The diagnostic tool will provide detailed, browser-specific solutions!
