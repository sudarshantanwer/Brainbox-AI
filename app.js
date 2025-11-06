class OfflineChat {
    constructor() {
        this.engine = null;
        this.isInitialized = false;
        this.isGenerating = false;
        
        this.initializeElements();
        this.setupEventListeners();
        
        // Add some debug logging
        console.log('OfflineChat initialized');
        console.log('WebLLM available:', typeof webllm !== 'undefined');
        
        // WebAssembly works in your browser, so let's skip the check and try loading directly
        console.log('Skipping compatibility check - WebAssembly confirmed working');
        console.log('WebLLM available at init:', typeof webllm !== 'undefined');
        
        // Wait for ES module to load and make webllm available globally
        setTimeout(() => {
            console.log('WebLLM available at model init:', typeof webllm !== 'undefined');
            if (typeof webllm !== 'undefined') {
                this.initializeModel();
            } else {
                console.log('WebLLM still not available, waiting longer...');
                setTimeout(() => {
                    console.log('WebLLM available after extended wait:', typeof webllm !== 'undefined');
                    this.initializeModel();
                }, 2000);
            }
        }, 1500);
    }

    initializeElements() {
        this.chatBox = document.getElementById('chatBox');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.status = document.getElementById('status');
        this.loading = document.getElementById('loading');
        this.chatContainer = document.getElementById('chatContainer');
        this.progressFill = document.getElementById('progressFill');
        this.loadingText = document.getElementById('loadingText');
        
        console.log('Elements initialized:', {
            chatBox: !!this.chatBox,
            status: !!this.status,
            loading: !!this.loading
        });
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
        });
    }

    adjustTextareaHeight() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    async initializeModel() {
        console.log('Starting model initialization...');
        
        try {
            this.updateStatus('Loading WebLLM library...');
            this.showLoading(true);

            // Check if WebLLM is available
            if (typeof webllm === 'undefined') {
                console.error('WebLLM library not loaded');
                throw new Error('WebLLM library failed to load from CDN');
            }

            console.log('WebLLM library loaded successfully');
            console.log('WebLLM object:', webllm);
            console.log('Available methods:', Object.keys(webllm));

            // Log browser information
            const browserInfo = this.getBrowserInfo();
            console.log(`Browser: ${browserInfo.browserName} ${browserInfo.browserVersion}`);

            this.updateStatus('Creating WebLLM engine...');
            this.updateLoadingText('Initializing AI engine...');

            // Create the engine with a simple, reliable model
            const initProgressCallback = (report) => {
                console.log('Model loading progress:', report);
                this.updateProgress(report.progress * 100);
                this.updateLoadingText(report.text || 'Loading model...');
            };

            this.updateLoadingText('Attempting to create WebLLM engine...');
            
            // Try to create the engine with the smallest, most reliable model first
            const models = [
                "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",        // ~600MB - Fastest download
                "Phi-3-mini-4k-instruct-q4f16_1-MLC"          // ~2GB - Better quality
            ];

            console.log('Available models by size:');
            console.log('1. TinyLlama-1.1B (~600MB) - Fast download, basic responses');
            console.log('2. Phi-3-mini (~2GB) - Slower download, better quality');

            let engineCreated = false;
            let lastError = null;
            
            for (const modelId of models) {
                try {
                    this.updateLoadingText(`Trying to load ${modelId}...`);
                    console.log(`Attempting to load model: ${modelId}`);
                    
                    this.engine = await webllm.CreateMLCEngine(
                        modelId,
                        { initProgressCallback }
                    );
                    
                    console.log(`Successfully loaded model: ${modelId}`);
                    engineCreated = true;
                    break;
                } catch (modelError) {
                    console.warn(`Failed to load ${modelId}:`, modelError);
                    lastError = modelError;
                    continue;
                }
            }

            if (!engineCreated) {
                throw new Error(`Failed to load any model. Last error: ${lastError?.message || 'Unknown error'}`);
            }

            this.isInitialized = true;
            this.updateStatus('🎉 Model ready! Start chatting below.');
            this.showLoading(false);
            this.enableChat();
            
            console.log('Model initialization completed successfully');

        } catch (error) {
            console.error('Model initialization failed:', error);
            console.error('Error stack:', error.stack);
            this.updateStatus('❌ Failed to initialize. See console for details.');
            this.updateLoadingText(`Error: ${error.message}`);
            
            // Show user-friendly error message based on the specific error
            this.showSpecificError(error);
        }
    }

    showError(error) {
        this.updateLoadingText('❌ Initialization failed. This could be due to:');
        setTimeout(() => {
            this.updateLoadingText('• Browser compatibility (try Chrome/Firefox)');
        }, 2000);
        setTimeout(() => {
            this.updateLoadingText('• Internet connection required for first load');
        }, 4000);
        setTimeout(() => {
            this.updateLoadingText('• WebAssembly not supported');
        }, 6000);
    }

    updateStatus(message) {
        console.log('Status:', message);
        if (this.status) {
            this.status.textContent = message;
        }
    }

    updateLoadingText(text) {
        console.log('Loading text:', text);
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
    }

    updateProgress(percentage) {
        console.log('Progress:', percentage + '%');
        if (this.progressFill) {
            this.progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
    }

    showLoading(show) {
        if (this.loading && this.chatContainer) {
            if (show) {
                this.loading.classList.add('show');
                this.chatContainer.style.display = 'none';
            } else {
                this.loading.classList.remove('show');
                this.chatContainer.style.display = 'flex';
            }
        }
    }

    enableChat() {
        if (this.chatInput && this.sendButton) {
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }

    async sendMessage() {
        if (!this.isInitialized || this.isGenerating) {
            return;
        }

        const message = this.chatInput.value.trim();
        if (!message) {
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.adjustTextareaHeight();

        // Disable input while generating
        this.isGenerating = true;
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;

        // Show typing indicator
        const typingDiv = this.addMessage('Thinking...', 'typing');

        try {
            // Check if we have a working AI engine or if we're in fallback mode
            if (!this.engine) {
                // Fallback mode - provide helpful message
                typingDiv.remove();
                this.addMessage('I\'m running in compatibility mode and can\'t provide AI responses. Your browser doesn\'t support WebAssembly. Please try updating your browser or using Chrome, Firefox, Safari, or Edge for the full AI experience.', 'ai');
                return;
            }

            // Generate response using WebLLM
            const response = await this.engine.chat.completions.create({
                messages: [{ role: "user", content: message }],
                temperature: 0.7,
                max_tokens: 256,
            });

            // Remove typing indicator
            typingDiv.remove();

            // Add AI response
            const aiMessage = response.choices[0].message.content;
            this.addMessage(aiMessage, 'ai');

        } catch (error) {
            console.error('Generation error:', error);
            typingDiv.remove();
            this.addMessage('Sorry, I encountered an error while generating a response. Please try again.', 'ai');
        } finally {
            // Re-enable input
            this.isGenerating = false;
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'typing') {
            messageDiv.className = 'message typing';
        }
        
        messageDiv.textContent = text;
        this.chatBox.appendChild(messageDiv);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
        
        return messageDiv;
    }

    checkBrowserCompatibility() {
        const compatibility = {
            webassembly: typeof WebAssembly !== 'undefined',
            sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
            worker: typeof Worker !== 'undefined',
            es6: typeof Promise !== 'undefined'
        };
        
        console.log('Browser compatibility check:', compatibility);
        
        // Get detailed browser info
        const browserInfo = this.getBrowserInfo();
        console.log(`Browser: ${browserInfo.browserName} ${browserInfo.browserVersion}`);
        console.log('User Agent:', navigator.userAgent);
        console.log('Platform:', navigator.platform);
        
        // WebAssembly is absolutely required
        if (!compatibility.webassembly) {
            console.error('WebAssembly not supported');
            console.log('WebAssembly type check:', typeof WebAssembly);
            console.log('Window.WebAssembly:', window.WebAssembly);
            return false;
        }
        
        // Check if we can instantiate WebAssembly
        try {
            // Test WebAssembly instantiation
            const wasmCode = new Uint8Array([
                0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
            ]);
            const module = new WebAssembly.Module(wasmCode);
            console.log('WebAssembly instantiation test passed');
            console.log('WebAssembly module created:', module);
        } catch (e) {
            console.error('WebAssembly instantiation failed:', e);
            console.error('Error details:', e.message, e.stack);
            return false;
        }
        
        return true;
    }

    showCompatibilityError() {
        this.updateStatus('❌ Browser not compatible');
        this.showLoading(true);
        this.updateLoadingText('❌ WebAssembly not supported');
        
        // Show detailed compatibility information
        setTimeout(() => {
            this.updateLoadingText('🔧 Quick fix: Try updating your browser or use Chrome');
        }, 2000);
        
        setTimeout(() => {
            this.updateLoadingText('📋 Supported: Chrome 57+, Firefox 52+, Safari 11+, Edge 16+');
        }, 4000);
        
        setTimeout(() => {
            this.updateLoadingText('⚙️ Or enable WebAssembly in browser settings');
        }, 6000);
        
        setTimeout(() => {
            this.updateLoadingText('🔍 Visit /browser-check.html for detailed diagnostics');
        }, 8000);
        
        setTimeout(() => {
            this.showFallbackMode();
        }, 10000);
    }

    showFallbackMode() {
        this.updateLoadingText('Switching to fallback mode...');
        
        setTimeout(() => {
            this.showLoading(false);
            this.updateStatus('⚠️ Running in compatibility mode (no AI)');
            this.enableChat();
            this.isInitialized = true; // Enable basic functionality
            
            // Add a message explaining the situation
            this.addMessage('I\'m sorry, but your browser doesn\'t support the WebAssembly technology required for offline AI. You can still use this interface, but I won\'t be able to provide AI responses. Please try updating your browser or using Chrome, Firefox, Safari, or Edge for the full AI experience.', 'ai');
        }, 2000);
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        
        if (userAgent.includes('Chrome')) {
            browserName = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Firefox')) {
            browserName = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browserName = 'Safari';
            browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (userAgent.includes('Edge')) {
            browserName = 'Edge';
            browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }
        
        return { browserName, browserVersion };
    }

    showSpecificError(error) {
        if (error.message.includes('WebLLM library failed to load')) {
            this.updateLoadingText('❌ WebLLM library failed to load from CDN');
            setTimeout(() => {
                this.updateLoadingText('• Check internet connection');
            }, 2000);
            setTimeout(() => {
                this.updateLoadingText('• Try refreshing the page');
            }, 4000);
        } else if (error.message.includes('Failed to load any model')) {
            this.updateLoadingText('❌ All AI models failed to load');
            setTimeout(() => {
                this.updateLoadingText('• Internet connection required for first-time model download');
            }, 2000);
            setTimeout(() => {
                this.updateLoadingText('• Models are several hundred MB - please be patient');
            }, 4000);
        } else {
            this.updateLoadingText('❌ Unexpected error occurred');
            setTimeout(() => {
                this.updateLoadingText('• Check browser console for technical details');
            }, 2000);
            setTimeout(() => {
                this.updateLoadingText('• Try refreshing the page or restarting browser');
            }, 4000);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing OfflineChat...');
    new OfflineChat();
});

// Add global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Check if WebLLM is loaded
window.addEventListener('load', () => {
    console.log('Window loaded. WebLLM available:', typeof webllm !== 'undefined');
    if (typeof webllm !== 'undefined') {
        console.log('WebLLM version/info:', webllm);
    }
});

// Add global debug functions
function manualWebAssemblyTest() {
    console.log('=== Manual WebAssembly Test ===');
    console.log('Browser:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    
    // Test 1: Check if WebAssembly exists
    console.log('1. WebAssembly exists:', typeof WebAssembly !== 'undefined');
    console.log('   typeof WebAssembly:', typeof WebAssembly);
    console.log('   window.WebAssembly:', window.WebAssembly);
    
    if (typeof WebAssembly === 'undefined') {
        alert('❌ WebAssembly is not available in this browser.\n\nPossible causes:\n• Browser too old\n• WebAssembly disabled\n• Running in restricted mode\n• Enterprise policy blocking it');
        return;
    }
    
    // Test 2: Check WebAssembly methods
    console.log('2. WebAssembly.Module:', typeof WebAssembly.Module);
    console.log('   WebAssembly.Instance:', typeof WebAssembly.Instance);
    console.log('   WebAssembly.instantiate:', typeof WebAssembly.instantiate);
    
    // Test 3: Try to create a simple module
    try {
        const wasmCode = new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
        ]);
        const module = new WebAssembly.Module(wasmCode);
        console.log('3. ✅ WebAssembly module creation succeeded:', module);
        
        // Test 4: Try to instantiate
        const instance = new WebAssembly.Instance(module);
        console.log('4. ✅ WebAssembly instance creation succeeded:', instance);
        
        alert('🎉 SUCCESS! WebAssembly is working perfectly!\n\nThis means the issue might be with:\n• The WebLLM library loading\n• Network restrictions\n• CORS headers\n\nCheck the browser console for more details.');
        
    } catch (error) {
        console.error('3. ❌ WebAssembly module/instance creation failed:', error);
        alert(`❌ WebAssembly test failed!\n\nError: ${error.message}\n\nThis suggests:\n• WebAssembly is disabled in settings\n• Security policies blocking it\n• Browser compatibility issue\n\nTry:\n1. chrome://flags/ → Search "WebAssembly" → Enable\n2. Incognito mode\n3. Different browser`);
    }
}

function openBrowserChecker() {
    window.open('/browser-check.html', '_blank');
}

// Add check for Chrome flags
function checkChromeFlags() {
    if (navigator.userAgent.includes('Chrome')) {
        console.log('Chrome detected. To check WebAssembly flags:');
        console.log('1. Go to: chrome://flags/');
        console.log('2. Search: WebAssembly');
        console.log('3. Make sure all WebAssembly flags are enabled');
    }
}

// Check for enterprise policies
function checkEnterprisePolicies() {
    // Check if we're in a restricted environment
    if (location.protocol === 'file:' || location.hostname === 'localhost') {
        console.log('Running locally - this should work');
    } else {
        console.log('Running on network - check for enterprise restrictions');
    }
    
    // Check for common enterprise policy indicators
    if (typeof chrome !== 'undefined' && chrome.enterprise) {
        console.warn('Enterprise Chrome detected - policies might block WebAssembly');
    }
}
