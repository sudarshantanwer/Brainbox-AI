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
        
        // Start initialization after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeModel();
        }, 500);
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
            this.updateStatus('Checking WebLLM availability...');
            this.showLoading(true);

            // Check if WebLLM is available
            if (typeof webllm === 'undefined') {
                throw new Error('WebLLM library not loaded');
            }

            console.log('WebLLM library loaded successfully');
            this.updateStatus('Initializing WebLLM engine...');
            this.updateLoadingText('Setting up AI model...');

            // Create the engine with a simple, reliable model
            const initProgressCallback = (report) => {
                console.log('Progress:', report);
                this.updateProgress(report.progress * 100);
                this.updateLoadingText(report.text || 'Loading model...');
            };

            this.updateLoadingText('Creating WebLLM engine...');
            
            // Try to create the engine with different models
            const models = [
                "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",
                "Phi-3-mini-4k-instruct-q4f16_1-MLC",
                "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC"
            ];

            let engineCreated = false;
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
                    continue;
                }
            }

            if (!engineCreated) {
                throw new Error('Failed to load any model');
            }

            this.isInitialized = true;
            this.updateStatus('🎉 Model ready! Start chatting below.');
            this.showLoading(false);
            this.enableChat();
            
            console.log('Model initialization completed successfully');

        } catch (error) {
            console.error('Model initialization failed:', error);
            this.updateStatus('❌ Failed to initialize. Check browser console for details.');
            this.updateLoadingText(`Error: ${error.message}`);
            
            // Show user-friendly error message
            this.showError(error);
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
