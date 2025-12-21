/**
 * Prototype Generator - Main Script
 * Handles navigation, mode selection, and workflow management
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    appName: 'Prototype Generator',
    version: '1.0.0',
    maxIterations: 8,
    storagePrefix: 'pg_',
    modes: {
        brainstorming: 'brainstorming',
        ideafinder: 'ideafinder'
    }
};

// ============================================
// State Management
// ============================================

const state = {
    currentMode: null,
    currentPhase: null, // 'idle', 'input', 'expansion', 'prd', 'prototype', 'export'
    iterations: 0,
    ideas: [],
    selectedIdea: null,
    brainstormingHistory: [],
    generatedPRD: null,
    generatedPrototype: null,
    sessionData: {}
};

// ============================================
// Mode Selection
// ============================================

function startMode(mode) {
    console.log(`Starting ${mode} mode...`);
    state.currentMode = mode;

    if (mode === 'brainstorming') {
        loadBrainstormingMode();
    } else if (mode === 'ideafinder') {
        loadIdefinderMode();
    }
}

function loadBrainstormingMode() {
    console.log('Loading Brainstorming Mode');
    window.location.href = 'pg-brainstorming.html';
}

function loadIdefinderMode() {
    console.log('Loading Ideafinder Mode');
    window.location.href = 'pg-ideafinder.html';
}

// ============================================
// Smooth Scrolling
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// Storage Management
// ============================================

const Storage = {
    /**
     * Save data to browser Local Storage
     */
    save(key, data) {
        try {
            const fullKey = CONFIG.storagePrefix + key;
            localStorage.setItem(fullKey, JSON.stringify(data));
            console.log(`✅ Saved to storage: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error saving to storage:`, error);
            return false;
        }
    },

    /**
     * Load data from browser Local Storage
     */
    load(key) {
        try {
            const fullKey = CONFIG.storagePrefix + key;
            const data = localStorage.getItem(fullKey);
            if (data) {
                console.log(`✅ Loaded from storage: ${key}`);
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error(`❌ Error loading from storage:`, error);
            return null;
        }
    },

    /**
     * Delete data from Local Storage
     */
    delete(key) {
        try {
            const fullKey = CONFIG.storagePrefix + key;
            localStorage.removeItem(fullKey);
            console.log(`✅ Deleted from storage: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error deleting from storage:`, error);
            return false;
        }
    },

    /**
     * Clear all Prototype Generator data
     */
    clearAll() {
        try {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CONFIG.storagePrefix)) {
                    localStorage.removeItem(key);
                }
            }
            console.log('✅ All Prototype Generator data cleared');
            return true;
        } catch (error) {
            console.error(`❌ Error clearing storage:`, error);
            return false;
        }
    }
};

// ============================================
// Session Management
// ============================================

const Session = {
    /**
     * Start a new session
     */
    start(mode, topic) {
        const sessionId = Date.now().toString();
        state.sessionData = {
            id: sessionId,
            mode: mode,
            topic: topic,
            startTime: new Date().toISOString(),
            iterations: 0,
            phases: []
        };
        Storage.save('current_session', state.sessionData);
        return sessionId;
    },

    /**
     * Update current session
     */
    update(data) {
        state.sessionData = { ...state.sessionData, ...data };
        Storage.save('current_session', state.sessionData);
    },

    /**
     * Get current session
     */
    getCurrent() {
        return state.sessionData;
    },

    /**
     * Save session as complete
     */
    complete() {
        const completedSession = {
            ...state.sessionData,
            endTime: new Date().toISOString(),
            prd: state.generatedPRD,
            prototype: state.generatedPrototype
        };

        // Get history
        const history = Storage.load('sessions_history') || [];
        history.push(completedSession);
        Storage.save('sessions_history', history);

        console.log('✅ Session completed and saved');
        return completedSession;
    }
};

// ============================================
// Iteration Management
// ============================================

const Iterations = {
    /**
     * Check if we can perform another iteration
     */
    canContinue(phase = 'any') {
        return state.iterations < CONFIG.maxIterations;
    },

    /**
     * Increment iteration counter
     */
    increment() {
        state.iterations++;
        Session.update({ iterations: state.iterations });
    },

    /**
     * Get remaining iterations
     */
    getRemaining() {
        return CONFIG.maxIterations - state.iterations;
    },

    /**
     * Get iteration display (e.g., "Chat 3/8")
     */
    getDisplay(phaseLabel = 'Chat') {
        return `${phaseLabel} ${state.iterations + 1}/${CONFIG.maxIterations}`;
    }
};

// ============================================
// Validation
// ============================================

const Validators = {
    /**
     * Validate topic input
     */
    isValidTopic(topic) {
        if (!topic || typeof topic !== 'string') return false;
        const trimmed = topic.trim();
        return trimmed.length >= 10 && trimmed.length <= 500;
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate URL
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
};

// ============================================
// Utilities
// ============================================

const Utils = {
    /**
     * Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    },

    /**
     * Format date/time
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Copy text to clipboard
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('✅ Copied to clipboard'))
            .catch(error => console.error('❌ Copy failed:', error));
    },

    /**
     * Download file
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// ============================================
// Analytics
// ============================================

const Analytics = {
    /**
     * Track event
     */
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            data: data
        };

        console.log(`📊 Event: ${eventName}`, data);

        // Could be extended to send to analytics service
        // For now, just log to console
        return event;
    },

    /**
     * Track mode selection
     */
    trackModeSelection(mode) {
        this.trackEvent('mode_selected', { mode });
    },

    /**
     * Track chat iteration
     */
    trackChatIteration(mode, iteration) {
        this.trackEvent('chat_iteration', { mode, iteration });
    },

    /**
     * Track PRD generation
     */
    trackPRDGeneration(mode) {
        this.trackEvent('prd_generated', { mode });
    },

    /**
     * Track prototype generation
     */
    trackPrototypeGeneration() {
        this.trackEvent('prototype_generated');
    }
};

// ============================================
// Error Handling
// ============================================

function handleError(error, context = 'Unknown') {
    console.error(`❌ Error in ${context}:`, error);
    Analytics.trackEvent('error', { context, message: error.message });

    // Show user-friendly error message
    alert(`Es ist ein Fehler aufgetreten: ${error.message || 'Bitte versuchen Sie es später erneut.'}`);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log(`🚀 ${CONFIG.appName} v${CONFIG.version} loaded`);

    // Add click handlers to mode cards
    const brainstormCard = document.getElementById('brainstorm-card');
    const ideafinderCard = document.getElementById('ideafinder-card');

    if (brainstormCard) {
        brainstormCard.addEventListener('click', () => startMode('brainstorming'));
    }

    if (ideafinderCard) {
        ideafinderCard.addEventListener('click', () => startMode('ideafinder'));
    }

    // Track page view
    Analytics.trackEvent('page_view', { page: 'home' });
});

// ============================================
// Export for use in other modules
// ============================================

window.PG = {
    CONFIG,
    state,
    startMode,
    Storage,
    Session,
    Iterations,
    Validators,
    Utils,
    Analytics,
    handleError
};

console.log('✅ Prototype Generator framework loaded');
