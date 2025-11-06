// WebLLM ES Module to Global Wrapper
import * as webllmModule from './web-llm.js';

// Make webllm available globally
window.webllm = webllmModule;
console.log('WebLLM made available globally:', typeof window.webllm !== 'undefined');
