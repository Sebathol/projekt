// API Master - Main JavaScript
const STORAGE_KEY = 'api-master-keys';
let apiKeys = [];
let currentEditId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadApiKeys();
    setupEventListeners();
    updateStats();
    renderRecentKeys();
    renderAllKeys();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('api-master-sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }
});

// Load API keys from localStorage
function loadApiKeys() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            apiKeys = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading API keys:', e);
            apiKeys = [];
        }
    }
}

// Save API keys to localStorage
function saveApiKeys() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });

    // Mobile menu
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Add API form
    const addForm = document.getElementById('add-api-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddApiKey();
    });

    // Edit API form
    const editForm = document.getElementById('edit-api-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEditApiKey();
    });

    // Search and filter
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    searchInput.addEventListener('input', () => filterApiKeys());
    categoryFilter.addEventListener('change', () => filterApiKeys());

    // Import file input
    const importInput = document.getElementById('import-file-input');
    importInput.addEventListener('change', handleImportFile);
}

// Navigation
function navigateTo(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Show page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`page-${page}`).classList.add('active');

    // Close mobile menu
    document.getElementById('sidebar').classList.remove('active');
}

// Update statistics
function updateStats() {
    const totalKeys = apiKeys.length;
    const activeKeys = apiKeys.filter(k => k.active !== false).length;
    const categories = [...new Set(apiKeys.map(k => k.category))].length;

    document.getElementById('total-keys').textContent = totalKeys;
    document.getElementById('active-keys').textContent = activeKeys;
    document.getElementById('categories').textContent = categories;
}

// Render recent keys on dashboard
function renderRecentKeys() {
    const container = document.getElementById('recent-keys');
    const recent = apiKeys.slice(-3).reverse();

    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <p>Noch keine API-Keys vorhanden</p>
                <button class="btn btn-primary" onclick="navigateTo('add')">Ersten Key hinzufügen</button>
            </div>
        `;
        return;
    }

    container.innerHTML = recent.map(key => createApiCard(key)).join('');
}

// Render all API keys
function renderAllKeys() {
    const container = document.getElementById('api-list');

    if (apiKeys.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔑</span>
                <p>Noch keine API-Keys vorhanden</p>
                <button class="btn btn-primary" onclick="navigateTo('add')">Ersten Key hinzufügen</button>
            </div>
        `;
        return;
    }

    container.innerHTML = apiKeys.map(key => createApiCard(key)).join('');
}

// Filter API keys
function filterApiKeys() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;

    let filtered = apiKeys;

    if (searchTerm) {
        filtered = filtered.filter(key =>
            key.service.toLowerCase().includes(searchTerm) ||
            key.name.toLowerCase().includes(searchTerm) ||
            (key.notes && key.notes.toLowerCase().includes(searchTerm))
        );
    }

    if (category) {
        filtered = filtered.filter(key => key.category === category);
    }

    const container = document.getElementById('api-list');

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <p>Keine API-Keys gefunden</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(key => createApiCard(key)).join('');
}

// Create API card HTML
function createApiCard(key) {
    const categoryClass = key.category || 'other';
    const categoryLabel = getCategoryLabel(key.category);
    const maskedKey = '••••' + key.key.slice(-4);
    const dateAdded = new Date(key.dateAdded).toLocaleDateString('de-DE');

    return `
        <div class="api-card" data-id="${key.id}">
            <div class="api-card-header">
                <div class="api-info-header">
                    <div class="api-service">${escapeHtml(key.service)}</div>
                    <div class="api-name">${escapeHtml(key.name)}</div>
                    <span class="category-badge ${categoryClass}">${categoryLabel}</span>
                </div>
            </div>
            <div class="api-key-display">
                <div class="api-key-hidden" id="key-${key.id}">${maskedKey}</div>
                <button class="copy-btn" onclick="copyApiKey('${key.id}')">📋</button>
            </div>
            ${key.url ? `<div class="api-meta">🔗 ${escapeHtml(key.url)}</div>` : ''}
            ${key.notes ? `<div class="api-meta">📝 ${escapeHtml(key.notes)}</div>` : ''}
            <div class="api-meta">📅 Hinzugefügt: ${dateAdded}</div>
            <div class="api-actions">
                <button class="btn-icon" onclick="showApiKey('${key.id}')">👁️ Anzeigen</button>
                <button class="btn-icon" onclick="editApiKey('${key.id}')">✏️ Bearbeiten</button>
                <button class="btn-icon" onclick="deleteApiKey('${key.id}')">🗑️ Löschen</button>
            </div>
        </div>
    `;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        ai: 'AI/ML',
        payment: 'Payment',
        weather: 'Wetter',
        maps: 'Karten',
        social: 'Social Media',
        other: 'Sonstige'
    };
    return labels[category] || 'Sonstige';
}

// Handle add API key
function handleAddApiKey() {
    const newKey = {
        id: Date.now().toString(),
        service: document.getElementById('api-service').value,
        name: document.getElementById('api-name').value,
        key: document.getElementById('api-key').value,
        category: document.getElementById('api-category').value,
        url: document.getElementById('api-url').value,
        notes: document.getElementById('api-notes').value,
        dateAdded: new Date().toISOString(),
        active: true
    };

    apiKeys.push(newKey);
    saveApiKeys();

    // Reset form
    document.getElementById('add-api-form').reset();

    // Update UI
    updateStats();
    renderRecentKeys();
    renderAllKeys();

    // Show success message
    showNotification('✅ API-Key erfolgreich hinzugefügt!', 'success');

    // Navigate to API list
    setTimeout(() => navigateTo('apis'), 1000);
}

// Show API key
function showApiKey(id) {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;

    const element = document.getElementById(`key-${id}`);
    if (element.classList.contains('api-key-hidden')) {
        element.textContent = key.key;
        element.classList.remove('api-key-hidden');
        setTimeout(() => {
            element.textContent = '••••' + key.key.slice(-4);
            element.classList.add('api-key-hidden');
        }, 5000);
    }
}

// Copy API key
function copyApiKey(id) {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;

    navigator.clipboard.writeText(key.key).then(() => {
        showNotification('📋 API-Key in Zwischenablage kopiert!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('❌ Fehler beim Kopieren', 'danger');
    });
}

// Edit API key
function editApiKey(id) {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;

    currentEditId = id;

    document.getElementById('edit-api-id').value = key.id;
    document.getElementById('edit-api-service').value = key.service;
    document.getElementById('edit-api-name').value = key.name;
    document.getElementById('edit-api-key').value = key.key;
    document.getElementById('edit-api-category').value = key.category;
    document.getElementById('edit-api-url').value = key.url || '';
    document.getElementById('edit-api-notes').value = key.notes || '';

    document.getElementById('edit-modal').classList.add('active');
}

// Handle edit API key
function handleEditApiKey() {
    const id = currentEditId;
    const index = apiKeys.findIndex(k => k.id === id);

    if (index === -1) return;

    apiKeys[index] = {
        ...apiKeys[index],
        service: document.getElementById('edit-api-service').value,
        name: document.getElementById('edit-api-name').value,
        key: document.getElementById('edit-api-key').value,
        category: document.getElementById('edit-api-category').value,
        url: document.getElementById('edit-api-url').value,
        notes: document.getElementById('edit-api-notes').value,
        dateModified: new Date().toISOString()
    };

    saveApiKeys();
    closeEditModal();

    updateStats();
    renderRecentKeys();
    renderAllKeys();

    showNotification('✅ API-Key erfolgreich aktualisiert!', 'success');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    currentEditId = null;
}

// Delete API key
function deleteApiKey(id) {
    if (!confirm('Möchtest du diesen API-Key wirklich löschen?')) return;

    apiKeys = apiKeys.filter(k => k.id !== id);
    saveApiKeys();

    updateStats();
    renderRecentKeys();
    renderAllKeys();

    showNotification('🗑️ API-Key gelöscht', 'info');
}

// Toggle key visibility
function toggleKeyVisibility() {
    const input = document.getElementById('api-key');
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Reset form
function resetForm() {
    document.getElementById('add-api-form').reset();
}

// Export data
function exportData() {
    if (apiKeys.length === 0) {
        showNotification('⚠️ Keine Daten zum Exportieren vorhanden', 'warning');
        return;
    }

    const dataStr = JSON.stringify(apiKeys, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-master-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification('📥 Daten erfolgreich exportiert!', 'success');
}

// Import data
function importData() {
    document.getElementById('import-file-input').click();
}

// Handle import file
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);

            if (!Array.isArray(imported)) {
                throw new Error('Invalid format');
            }

            if (confirm(`${imported.length} API-Keys gefunden. Möchtest du sie importieren? (Bestehende Daten werden überschrieben)`)) {
                apiKeys = imported;
                saveApiKeys();
                updateStats();
                renderRecentKeys();
                renderAllKeys();
                showNotification('📤 Daten erfolgreich importiert!', 'success');
            }
        } catch (err) {
            console.error('Import error:', err);
            showNotification('❌ Fehler beim Importieren. Ungültige Datei.', 'danger');
        }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
}

// Clear all data
function clearAllData() {
    if (!confirm('⚠️ ACHTUNG: Alle API-Keys werden unwiderruflich gelöscht! Fortfahren?')) return;

    if (!confirm('Bist du dir wirklich sicher? Diese Aktion kann nicht rückgängig gemacht werden!')) return;

    apiKeys = [];
    saveApiKeys();

    updateStats();
    renderRecentKeys();
    renderAllKeys();

    showNotification('🗑️ Alle Daten gelöscht', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== CLAUDE AI ASSISTANT - CLAUDE API INTEGRATION =====

let chatHistory = [];
let selectedClaudeKey = null;
let aiRequestCount = 0;
let aiMessageCount = 0;

// Initialize AI Agent on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAIChatHistory();
    updateAIKeyDropdown();
    checkAISetup();
});

// Load chat history from localStorage
function loadAIChatHistory() {
    const stored = localStorage.getItem('ai-chat-history');
    if (stored) {
        try {
            chatHistory = JSON.parse(stored);
            renderChatHistory();
        } catch (e) {
            console.error('Error loading chat history:', e);
            chatHistory = [];
        }
    }
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('ai-chat-history', JSON.stringify(chatHistory));
}

// Update AI Key dropdown
function updateAIKeyDropdown() {
    const select = document.getElementById('claude-api-select');
    if (!select) return;

    // Filter for Claude/Anthropic API keys
    const claudeKeys = apiKeys.filter(key =>
        key.service.toLowerCase().includes('claude') ||
        key.service.toLowerCase().includes('anthropic')
    );

    // Clear and populate dropdown
    select.innerHTML = '<option value="">-- Bitte wählen --</option>';

    claudeKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key.id;
        option.textContent = `${key.service} - ${key.name}`;
        select.appendChild(option);
    });

    // Auto-select if only one key
    if (claudeKeys.length === 1) {
        select.value = claudeKeys[0].id;
        selectClaudeKey();
    }
}

// Check if AI is properly set up
function checkAISetup() {
    const alert = document.getElementById('ai-setup-alert');
    if (!alert) return;

    const claudeKeys = apiKeys.filter(key =>
        key.service.toLowerCase().includes('claude') ||
        key.service.toLowerCase().includes('anthropic')
    );

    if (claudeKeys.length === 0) {
        alert.style.display = 'block';
    } else {
        alert.style.display = 'none';
    }
}

// Select Claude API key
function selectClaudeKey() {
    const select = document.getElementById('claude-api-select');
    const keyId = select.value;

    if (!keyId) {
        selectedClaudeKey = null;
        return;
    }

    const key = apiKeys.find(k => k.id === keyId);
    if (key) {
        selectedClaudeKey = key;
        showNotification('✅ Claude API-Key ausgewählt!', 'success');
    }
}

// Send AI message
async function sendAIMessage() {
    const input = document.getElementById('ai-prompt-input');
    const prompt = input.value.trim();

    if (!prompt) {
        showNotification('⚠️ Bitte gib eine Nachricht ein', 'warning');
        return;
    }

    if (!selectedClaudeKey) {
        showNotification('⚠️ Bitte wähle zuerst einen Claude API-Key aus', 'warning');
        return;
    }

    // Clear input
    input.value = '';

    // Add user message
    addMessageToChat('user', prompt);

    // Show loading state
    setAILoading(true);

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        // Call Claude API
        const response = await callClaudeAPI(prompt);

        // Remove typing indicator
        removeTypingIndicator(typingId);

        // Add AI response
        addMessageToChat('assistant', response);

        // Update stats
        aiRequestCount++;
        updateAIStats();

        setAILoading(false);

    } catch (error) {
        console.error('AI Error:', error);
        removeTypingIndicator(typingId);
        setAILoading(false);

        let errorMessage = 'Fehler bei der Anfrage an Claude API. ';
        if (error.message.includes('401')) {
            errorMessage += 'Ungültiger API-Key. Bitte überprüfe deinen Claude API-Key.';
        } else if (error.message.includes('429')) {
            errorMessage += 'Rate Limit erreicht. Bitte warte einen Moment.';
        } else {
            errorMessage += error.message;
        }

        showNotification(`❌ ${errorMessage}`, 'danger');
    }
}

// Call Claude API
async function callClaudeAPI(prompt) {
    const model = document.getElementById('ai-model-select').value;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': selectedClaudeKey.key,
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
            system: 'Du bist der Claude AI Assistant, ein hilfreicher KI-Assistent powered by Claude API. Du hilfst Entwicklern bei Code, API-Dokumentation, technischen Fragen und Problemlösungen. Antworte auf Deutsch, es sei denn der Nutzer kommuniziert in einer anderen Sprache.'
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error (${response.status}): ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// Add message to chat
function addMessageToChat(role, content) {
    const message = {
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    };

    chatHistory.push(message);
    saveChatHistory();

    aiMessageCount++;
    updateAIStats();

    renderMessage(message);
    scrollChatToBottom();
}

// Render single message
function renderMessage(message) {
    const container = document.getElementById('chat-messages');

    // Remove welcome message if exists
    const welcome = container.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${message.role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const header = document.createElement('div');
    header.className = 'message-header';
    header.textContent = message.role === 'user' ? 'Du' : '🤖 Claude AI Assistant';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = formatMessage(message.content);

    bubble.appendChild(header);
    bubble.appendChild(content);
    messageDiv.appendChild(bubble);

    container.appendChild(messageDiv);
}

// Format message content (simple markdown-like formatting)
function formatMessage(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);

    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

// Render chat history
function renderChatHistory() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    if (chatHistory.length === 0) return;

    // Remove welcome message
    const welcome = container.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    chatHistory.forEach(message => {
        renderMessage(message);
    });

    scrollChatToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-ai';
    typingDiv.id = 'typing-indicator-' + Date.now();

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    bubble.appendChild(typing);
    typingDiv.appendChild(bubble);
    container.appendChild(typingDiv);

    scrollChatToBottom();

    return typingDiv.id;
}

// Remove typing indicator
function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
        indicator.remove();
    }
}

// Set AI loading state
function setAILoading(isLoading) {
    const sendBtn = document.getElementById('send-ai-btn');
    const sendText = document.getElementById('send-btn-text');
    const sendLoading = document.getElementById('send-btn-loading');

    if (isLoading) {
        sendBtn.disabled = true;
        sendText.style.display = 'none';
        sendLoading.style.display = 'inline';
    } else {
        sendBtn.disabled = false;
        sendText.style.display = 'inline';
        sendLoading.style.display = 'none';
    }
}

// Update AI stats
function updateAIStats() {
    const requestCount = document.getElementById('ai-request-count');
    const messageCount = document.getElementById('ai-message-count');

    if (requestCount) requestCount.textContent = aiRequestCount;
    if (messageCount) messageCount.textContent = aiMessageCount;
}

// Clear AI chat
function clearAIChat() {
    if (!confirm('Möchtest du den gesamten Chat-Verlauf löschen?')) return;

    chatHistory = [];
    saveChatHistory();

    const container = document.getElementById('chat-messages');
    container.innerHTML = `
        <div class="welcome-message">
            <h3>👋 Willkommen beim Claude AI Assistant!</h3>
            <p>Ich bin dein KI-Assistent, powered by Claude API von Anthropic.</p>
            <p><strong>Ich kann dir helfen bei:</strong></p>
            <ul>
                <li>📝 Code-Generierung und Debugging</li>
                <li>💡 API-Dokumentation erklären</li>
                <li>🔍 Technische Fragen beantworten</li>
                <li>🛠️ Entwicklungs-Probleme lösen</li>
                <li>📊 Daten analysieren</li>
            </ul>
            <p>Stelle mir eine Frage, um zu starten!</p>
        </div>
    `;

    aiMessageCount = 0;
    updateAIStats();

    showNotification('🗑️ Chat gelöscht', 'info');
}

// Handle AI input keydown
function handleAIInputKeydown(event) {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        sendAIMessage();
    }
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Override original setup listeners to include AI updates
const originalSetupEventListeners = setupEventListeners;
setupEventListeners = function() {
    originalSetupEventListeners();

    // Update AI dropdown when navigating to AI page
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.dataset.page === 'ai-agent') {
                setTimeout(() => {
                    updateAIKeyDropdown();
                    checkAISetup();
                }, 100);
            }
        });
    });
};

// Override add API key handler to update AI dropdown
const originalHandleAddApiKey = handleAddApiKey;
handleAddApiKey = function() {
    originalHandleAddApiKey();
    updateAIKeyDropdown();
    checkAISetup();
};


// ===== INTELLIGENT HELP SYSTEM =====

// Smart Tooltip System
const SmartTooltipSystem = {
    tooltip: null,
    currentElement: null,
    hoverTimeout: null,
    hoverDelay: 800, // 800ms delay before showing tooltip

    init() {
        this.tooltip = document.getElementById('smart-tooltip');
        this.setupListeners();
    },

    setupListeners() {
        // Add hover listeners to all elements with data-help
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('[data-help]');
            if (element) {
                this.handleHoverStart(element);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('[data-help]');
            if (element) {
                this.handleHoverEnd(element);
            }
        });
    },

    handleHoverStart(element) {
        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Set new timeout
        this.hoverTimeout = setTimeout(() => {
            this.showTooltip(element);
            this.updateInfoPanel(element);
        }, this.hoverDelay);
    },

    handleHoverEnd(element) {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        this.hideTooltip();
    },

    showTooltip(element) {
        const help = element.getAttribute('data-help');
        const detail = element.getAttribute('data-help-detail');
        const tip = element.getAttribute('data-help-tip');

        if (!help) return;

        // Update tooltip content
        const tooltipIcon = this.tooltip.querySelector('.tooltip-icon');
        const tooltipTitle = this.tooltip.querySelector('.tooltip-title');
        const tooltipContent = this.tooltip.querySelector('.tooltip-content');
        const tooltipTip = this.tooltip.querySelector('.tooltip-tip');

        // Get icon from element or use default
        const iconSpan = element.querySelector('.nav-icon, .help-icon, .logo-icon');
        tooltipIcon.textContent = iconSpan ? iconSpan.textContent : 'ℹ️';
        tooltipTitle.textContent = help;
        tooltipContent.textContent = detail || help;

        if (tip) {
            tooltipTip.textContent = tip;
            tooltipTip.style.display = 'block';
        } else {
            tooltipTip.style.display = 'none';
        }

        // Position tooltip
        this.positionTooltip(element);

        // Show tooltip
        this.tooltip.classList.add('show');
        this.currentElement = element;
    },

    positionTooltip(element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        // Calculate position (above element by default)
        let top = rect.top - tooltipRect.height - 16;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Adjust if tooltip goes off screen
        if (top < 10) {
            top = rect.bottom + 16;
            this.tooltip.querySelector('.tooltip-arrow').style.display = 'none';
        } else {
            this.tooltip.querySelector('.tooltip-arrow').style.display = 'block';
        }

        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        this.tooltip.style.top = top + 'px';
        this.tooltip.style.left = left + 'px';
    },

    hideTooltip() {
        this.tooltip.classList.remove('show');
        this.currentElement = null;
    },

    updateInfoPanel(element) {
        const infoPanel = document.getElementById('info-panel');
        const content = document.getElementById('info-panel-content');
        
        const help = element.getAttribute('data-help');
        const detail = element.getAttribute('data-help-detail');
        const tip = element.getAttribute('data-help-tip');

        if (help && detail) {
            let html = '<div class="info-section"><h4>' + help + '</h4><p>' + detail + '</p>';
            if (tip) {
                html += '<p style="margin-top: 12px; color: #10b981; font-weight: 500;">' + tip + '</p>';
            }
            html += '</div>';
            content.innerHTML = html;
            
            // Show info panel if not already shown
            if (!infoPanel.classList.contains('show')) {
                setTimeout(() => infoPanel.classList.add('show'), 300);
            }
        }
    }
};

// Info Panel Management
const InfoPanelManager = {
    panel: null,
    isVisible: false,

    init() {
        this.panel = document.getElementById('info-panel');
        this.setupListeners();
        this.loadTip();
        
        // Show panel on first visit
        if (!localStorage.getItem('help-panel-seen')) {
            setTimeout(() => this.show(), 1000);
            localStorage.setItem('help-panel-seen', 'true');
        }
    },

    setupListeners() {
        const closeBtn = document.getElementById('info-panel-close');
        closeBtn.addEventListener('click', () => this.hide());
    },

    show() {
        this.panel.classList.add('show');
        this.isVisible = true;
    },

    hide() {
        this.panel.classList.remove('show');
        this.isVisible = false;
    },

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    },

    loadTip() {
        const tips = [
            "Halte die Maus über Elemente für detaillierte Erklärungen!",
            "Nutze Shortcuts wie '?' für Hilfe oder 'N' für neuen Key!",
            "Exportiere deine Keys regelmäßig als Backup in den Einstellungen.",
            "Claude 3.5 Sonnet bietet die beste Balance zwischen Geschwindigkeit und Intelligenz.",
            "Organisiere deine Keys mit aussagekräftigen Namen und Kategorien.",
            "Klicke einfach auf eine Key-Card um sie in die Zwischenablage zu kopieren!",
            "Das Dashboard zeigt dir alle wichtigen Statistiken auf einen Blick.",
            "Alle deine API-Keys werden nur lokal gespeichert - niemals auf einem Server!",
            "Nutze die Suchfunktion um Keys schnell zu finden.",
            "Du kannst die App als PWA auf deinem Smartphone installieren!"
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        document.getElementById('current-tip').textContent = randomTip;
    }
};

// Help Modal Management
const HelpModalManager = {
    modal: null,

    init() {
        this.modal = document.getElementById('help-modal');
        this.setupListeners();
    },

    setupListeners() {
        // Help button click
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.open());
        }

        // Tab switching
        const tabs = document.querySelectorAll('.help-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Close on click outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    },

    open() {
        this.modal.classList.add('active');
    },

    close() {
        this.modal.classList.remove('active');
    },

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.help-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        // Update active content
        document.querySelectorAll('.help-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById('help-' + tabName).classList.add('active');
    }
};

// Keyboard Shortcuts
const KeyboardShortcuts = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case '?':
                    e.preventDefault();
                    HelpModalManager.open();
                    break;
                
                case 'Escape':
                    HelpModalManager.close();
                    closeEditModal();
                    break;
                
                case 'i':
                case 'I':
                    e.preventDefault();
                    InfoPanelManager.toggle();
                    break;
                
                case 'n':
                case 'N':
                    e.preventDefault();
                    navigateTo('add');
                    break;
            }

            // Ctrl+K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    navigateTo('apis');
                }
            }
        });
    }
};

// Close Help Modal Function (called from HTML)
function closeHelpModal() {
    HelpModalManager.close();
}

// Initialize Help System
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for main app to load
    setTimeout(() => {
        SmartTooltipSystem.init();
        InfoPanelManager.init();
        HelpModalManager.init();
        KeyboardShortcuts.init();
        
        console.log('✅ Intelligentes Hilfe-System geladen!');
    }, 500);
});

// Export for external use
window.HelpSystem = {
    showTooltip: (element) => SmartTooltipSystem.showTooltip(element),
    hideTooltip: () => SmartTooltipSystem.hideTooltip(),
    showInfoPanel: () => InfoPanelManager.show(),
    hideInfoPanel: () => InfoPanelManager.hide(),
    openHelp: () => HelpModalManager.open(),
    closeHelp: () => HelpModalManager.close()
};
