// API Master - Simple Design with Claude API
// Powered by Claude API (Anthropic)

const STORAGE_KEY = 'api-master-key';
const CHAT_HISTORY_KEY = 'api-master-chat';
let apiKey = null;
let chatHistory = [];
let requestCount = 0;
let messageCount = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    checkSetup();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('api-master-sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('SW registration failed:', err));
    }
});

// Load data from localStorage
function loadData() {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
        apiKey = storedKey;
    }

    const storedChat = localStorage.getItem(CHAT_HISTORY_KEY);
    if (storedChat) {
        try {
            const data = JSON.parse(storedChat);
            chatHistory = data.messages || [];
            requestCount = data.requestCount || 0;
            messageCount = data.messageCount || 0;
        } catch (e) {
            console.error('Error loading chat:', e);
        }
    }
}

// Save data to localStorage
function saveKey(key) {
    localStorage.setItem(STORAGE_KEY, key);
    apiKey = key;
}

function saveChat() {
    const data = {
        messages: chatHistory,
        requestCount: requestCount,
        messageCount: messageCount
    };
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(data));
}

// Setup event listeners
function setupEventListeners() {
    const saveKeyBtn = document.getElementById('save-key-btn');
    const sendBtn = document.getElementById('send-btn');
    const promptInput = document.getElementById('prompt-input');
    const settingsBtn = document.getElementById('settings-btn');

    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', handleSaveKey);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }

    if (promptInput) {
        promptInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
}

// Check if setup is needed
function checkSetup() {
    const setupSection = document.getElementById('setup-section');
    const chatSection = document.getElementById('chat-section');

    if (apiKey) {
        setupSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        renderChat();
        updateStats();
    } else {
        setupSection.classList.remove('hidden');
        chatSection.classList.add('hidden');
    }
}

// Handle save API key
function handleSaveKey() {
    const input = document.getElementById('api-key-input');
    const key = input.value.trim();

    if (!key) {
        alert('Bitte gib einen gültigen API-Key ein!');
        return;
    }

    if (!key.startsWith('sk-ant-')) {
        if (!confirm('Der Key sieht nicht wie ein Claude API-Key aus. Trotzdem fortfahren?')) {
            return;
        }
    }

    saveKey(key);
    checkSetup();
    input.value = '';
}

// Handle send message
async function handleSendMessage() {
    const input = document.getElementById('prompt-input');
    const prompt = input.value.trim();

    if (!prompt) {
        return;
    }

    if (!apiKey) {
        alert('Bitte zuerst API-Key eingeben!');
        return;
    }

    // Disable input
    input.value = '';
    input.disabled = true;
    setLoading(true);

    // Add user message
    addMessage('user', prompt);

    // Show typing indicator
    const typingId = showTyping();

    try {
        // Call Claude API
        const response = await callClaudeAPI(prompt);

        // Remove typing
        removeTyping(typingId);

        // Add AI response
        addMessage('assistant', response);

        // Update stats
        requestCount++;
        updateStats();
        saveChat();

    } catch (error) {
        console.error('API Error:', error);
        removeTyping(typingId);

        let errorMsg = 'Fehler bei der API-Anfrage. ';
        if (error.message.includes('401')) {
            errorMsg += 'Ungültiger API-Key. Bitte überprüfe deinen Key in den Einstellungen.';
        } else if (error.message.includes('429')) {
            errorMsg += 'Rate Limit erreicht. Bitte warte einen Moment.';
        } else {
            errorMsg += error.message;
        }

        alert(errorMsg);
    }

    // Enable input
    input.disabled = false;
    input.focus();
    setLoading(false);
}

// Call Claude API
async function callClaudeAPI(prompt) {
    const model = document.getElementById('model-select').value;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            system: 'Du bist API Master, ein hilfreicher KI-Assistent powered by Claude API. Du hilfst bei Code, technischen Fragen und Problemlösungen. Antworte auf Deutsch, es sei denn der Nutzer kommuniziert in einer anderen Sprache.'
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(\`API Error (\${response.status}): \${error.error?.message || 'Unknown error'}\`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// Add message to chat
function addMessage(role, content) {
    const message = {
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    };

    chatHistory.push(message);
    messageCount++;

    renderMessage(message);
    scrollToBottom();
    saveChat();
    updateStats();
}

// Render message
function renderMessage(message) {
    const container = document.getElementById('chat-container');

    // Remove welcome message
    const welcome = container.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = \`message message-\${message.role}\`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const role = document.createElement('div');
    role.className = 'message-role';
    role.textContent = message.role === 'user' ? 'Du' : '🤖 API Master';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = formatMessage(message.content);

    bubble.appendChild(role);
    bubble.appendChild(content);
    messageDiv.appendChild(bubble);

    container.appendChild(messageDiv);
}

// Format message (basic markdown support)
function formatMessage(text) {
    let formatted = escapeHtml(text);

    // Code blocks
    formatted = formatted.replace(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>');

    // Inline code
    formatted = formatted.replace(/\`([^\`]+)\`/g, '<code>$1</code>');

    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Render all chat messages
function renderChat() {
    if (chatHistory.length === 0) return;

    const container = document.getElementById('chat-container');

    // Remove welcome
    const welcome = container.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    chatHistory.forEach(msg => renderMessage(msg));
    scrollToBottom();
}

// Show typing indicator
function showTyping() {
    const container = document.getElementById('chat-container');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-ai';
    typingDiv.id = 'typing-' + Date.now();

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    bubble.appendChild(typing);
    typingDiv.appendChild(bubble);
    container.appendChild(typingDiv);

    scrollToBottom();

    return typingDiv.id;
}

// Remove typing indicator
function removeTyping(id) {
    const typing = document.getElementById(id);
    if (typing) {
        typing.remove();
    }
}

// Set loading state
function setLoading(isLoading) {
    const sendBtn = document.getElementById('send-btn');
    const sendText = document.getElementById('send-text');
    const sendLoading = document.getElementById('send-loading');

    if (isLoading) {
        sendBtn.disabled = true;
        sendText.classList.add('hidden');
        sendLoading.classList.remove('hidden');
    } else {
        sendBtn.disabled = false;
        sendText.classList.remove('hidden');
        sendLoading.classList.add('hidden');
    }
}

// Update stats
function updateStats() {
    const requestCountEl = document.getElementById('request-count');
    const messageCountEl = document.getElementById('message-count');

    if (requestCountEl) requestCountEl.textContent = requestCount;
    if (messageCountEl) messageCountEl.textContent = messageCount;
}

// Scroll to bottom
function scrollToBottom() {
    const container = document.getElementById('chat-container');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Settings functions
function openSettings() {
    const modal = document.getElementById('settings-modal');
    const keyDisplay = document.getElementById('current-key-display');

    if (apiKey) {
        keyDisplay.value = '••••••' + apiKey.slice(-8);
    }

    modal.classList.remove('hidden');
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('hidden');
}

function showKey() {
    const keyDisplay = document.getElementById('current-key-display');
    if (keyDisplay.type === 'password') {
        keyDisplay.type = 'text';
        keyDisplay.value = apiKey;
        setTimeout(() => {
            keyDisplay.type = 'password';
            keyDisplay.value = '••••••' + apiKey.slice(-8);
        }, 3000);
    }
}

function changeApiKey() {
    if (!confirm('Möchtest du den API-Key wirklich ändern? Der Chat bleibt erhalten.')) {
        return;
    }

    apiKey = null;
    localStorage.removeItem(STORAGE_KEY);
    closeSettings();
    checkSetup();
}

function clearChat() {
    if (!confirm('Möchtest du den gesamten Chat-Verlauf löschen?')) {
        return;
    }

    chatHistory = [];
    messageCount = 0;
    requestCount = 0;

    saveChat();
    updateStats();

    const container = document.getElementById('chat-container');
    container.innerHTML = \`
        <div class="welcome-message">
            <h3>👋 Willkommen!</h3>
            <p>Ich bin dein KI-Assistent powered by Claude API.</p>
            <p>Stelle mir eine Frage!</p>
        </div>
    \`;

    closeSettings();
}

function exportChat() {
    if (chatHistory.length === 0) {
        alert('Kein Chat vorhanden zum Exportieren.');
        return;
    }

    const data = {
        messages: chatHistory,
        exportDate: new Date().toISOString(),
        requestCount: requestCount,
        messageCount: messageCount
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = \`api-master-chat-\${Date.now()}.json\`;
    link.click();

    URL.revokeObjectURL(url);
    alert('Chat erfolgreich exportiert!');
}

// Click outside modal to close
window.addEventListener('click', (e) => {
    const modal = document.getElementById('settings-modal');
    if (e.target === modal) {
        closeSettings();
    }
});
