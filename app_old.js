class OfflineChat {
    constructor() {
        this.chat = null;
        this.isInitialized = false;
        this.isGenerating = false;
        
        this.initializeElements();
        this.setupEventListeners();
        
        // Add debug logging
        console.log('OfflineChat initialized');
        console.log('WebLLM available:', typeof webllm !== 'undefined');
        
        this.initializeModel();
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
        try {
            this.updateStatus('Initializing WebLLM...');
            this.showLoading(true);

            this.updateStatus('Loading model into browser...');
            this.updateLoadingText('Initializing WebLLM engine...');

            // Initialize the chat engine using new WebLLM API
            const engine = await webllm.CreateMLCEngine(
                "Llama-3-8B-Instruct-q4f32_1-MLC",
                {
                    initProgressCallback: (progress) => {
                        this.updateProgress(progress.progress * 100);
                        this.updateLoadingText(`Loading: ${progress.text || 'Preparing model...'}`);
                    }
                }
            );
            
            this.chat = engine;

            this.isInitialized = true;
            this.updateStatus('Model ready! Start chatting below.');
            this.showLoading(false);
            this.enableChat();

        } catch (error) {
            console.error('Failed to initialize model:', error);
            this.updateStatus('❌ Failed to load model. Check console for details.');
            this.updateLoadingText(`Error: ${error.message}`);
            
            // Try the simple WebLLM demo approach
            setTimeout(() => {
                this.trySimpleLoad();
            }, 2000);
        }
    }

    async trySimpleLoad() {
        try {
            this.updateLoadingText('Trying alternative model...');
            this.updateStatus('Attempting to load Phi-3 model...');

            // Try a smaller, more reliable model
            const engine = await webllm.CreateMLCEngine(
                "Phi-3-mini-4k-instruct-q4f16_1-MLC",
                {
                    initProgressCallback: (progress) => {
                        this.updateProgress(progress.progress * 100);
                        this.updateLoadingText(`Loading: ${progress.text || 'Preparing model...'}`);
                    }
                }
            );
            
            this.chat = engine;
            this.isInitialized = true;
            this.updateStatus('Model ready! Start chatting below.');
            this.showLoading(false);
            this.enableChat();

        } catch (error) {
            console.error('Simple load also failed:', error);
            this.updateStatus('❌ WebLLM initialization failed. This might be due to browser compatibility.');
            this.updateLoadingText('Please ensure you\'re using a modern browser with WebAssembly support. Try Chrome or Firefox.');
        }
    }

    async tryAlternativeLoad() {
        try {
            this.updateLoadingText('Trying smaller model...');
            this.updateStatus('Attempting to load TinyLlama model...');

            // Try an even smaller model
            const engine = await webllm.CreateMLCEngine(
                "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",
                {
                    initProgressCallback: (progress) => {
                        this.updateProgress(progress.progress * 100);
                        this.updateLoadingText(`Loading: ${progress.text || 'Preparing model...'}`);
                    }
                }
            );
            
            this.chat = engine;
            this.isInitialized = true;
            this.updateStatus('Model ready! Start chatting below.');
            this.showLoading(false);
            this.enableChat();

        } catch (error) {
            console.error('Alternative load also failed:', error);
            setTimeout(() => {
                this.trySimpleLoad();
            }, 2000);
        }
    }

    async checkModelExists() {
        // No longer need to check local files since we're using WebLLM's built-in models
        return true;
    }

    updateStatus(message) {
        this.status.textContent = message;
    }

    updateLoadingText(text) {
        this.loadingText.textContent = text;
    }

    updateProgress(percentage) {
        this.progressFill.style.width = `${percentage}%`;
    }

    showLoading(show) {
        if (show) {
            this.loading.classList.add('show');
            this.chatContainer.style.display = 'none';
        } else {
            this.loading.classList.remove('show');
            this.chatContainer.style.display = 'flex';
        }
    }

    enableChat() {
        this.chatInput.disabled = false;
        this.sendButton.disabled = false;
        this.chatInput.focus();
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
            // Generate response using new WebLLM API
            const response = await this.chat.chat.completions.create({
                messages: [{ role: "user", content: message }],
                temperature: 0.7,
                max_tokens: 256
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
    new OfflineChat();
});

// Handle page visibility changes to pause/resume if needed
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - conserving resources');
    } else {
        console.log('Page visible - resuming normal operation');
    }
});
