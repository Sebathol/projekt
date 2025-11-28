/**
 * Prototype Generator - Brainstorming Mode Script
 * Handles brainstorming chat, PRD generation, and prototype generation
 */

// ============================================
// State Management (Mode-specific)
// ============================================

const brainstormingState = {
    topic: '',
    chatHistory: [],
    prdData: null,
    prototypeData: null,
    currentPhase: 'input', // input, brainstorm, prd, prototype, complete
    prdIterations: 0,
    prototypeIterations: 0
};

// ============================================
// Phase Management
// ============================================

function showPhase(phaseName) {
    // Hide all phases
    document.querySelectorAll('.phase-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target phase
    const phaseElement = document.getElementById(`phase-${phaseName}`);
    if (phaseElement) {
        phaseElement.classList.add('active');
    }

    brainstormingState.currentPhase = phaseName;
    console.log(`📍 Current phase: ${phaseName}`);
}

// ============================================
// Phase 1: Topic Input
// ============================================

const topicInput = document.getElementById('topic-input');

if (topicInput) {
    topicInput.addEventListener('input', function() {
        const count = this.value.length;
        document.getElementById('char-count').textContent = count;

        // Visual feedback
        if (count < 10) {
            this.style.borderColor = '#ef4444';
        } else if (count < 50) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
}

function startBrainstorming() {
    const topic = topicInput.value.trim();

    // Validation
    if (!PG.Validators.isValidTopic(topic)) {
        alert('❌ Bitte geben Sie eine Idee mit mindestens 10 und maximal 500 Zeichen ein.');
        return;
    }

    // Start session
    brainstormingState.topic = topic;
    const sessionId = PG.Session.start('brainstorming', topic);

    // Analytics
    PG.Analytics.trackEvent('brainstorming_started', { topic: topic.substring(0, 50) });

    // Show chat phase
    showPhase('brainstorm');

    // Add initial AI message
    setTimeout(() => {
        addChatMessage('ai', generateInitialAIMessage(topic));
        setTimeout(() => {
            focusChatInput();
        }, 500);
    }, 500);
}

function generateInitialAIMessage(topic) {
    // Simulate AI response - in production, this would call Claude API
    return `
Großartig! 🚀 Ich habe deine Idee verstanden: "${topic}"

Lasse mich ein paar wichtige Fragen stellen, um deine Idee zu strukturieren und zu erweitern:

1. **Zielgruppe**: Wer genau sind deine Nutzer? (z.B. Unternehmen, Einzelpersonen, eine spezifische Altersgruppe)

2. **Problem**: Welches konkrete Problem löst deine Idee für diese Zielgruppe?

3. **Differenzierung**: Was macht deine Lösung besser/anders als existierende Alternativen?

4. **Geschäftsmodell**: Wie möchtest du damit Geld verdienen? (z.B. Abo, One-Time Payment, Freemium, Werbung)

5. **MVP**: Was sind die 3-5 wichtigsten Features für die erste Version?

Bitte beantworte diese Fragen, und ich helfe dir, eine umfassende Geschäftsstrategie zu entwickeln! 💡
    `.trim();
}

// ============================================
// Phase 2: Brainstorming Chat
// ============================================

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-message-avatar';
    avatar.textContent = sender === 'ai' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'chat-message-content';
    content.textContent = message;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);

    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Store in history
    brainstormingState.chatHistory.push({
        sender,
        message,
        timestamp: new Date().toISOString()
    });
}

function focusChatInput() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.focus();
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (!message) {
        alert('❌ Bitte geben Sie eine Nachricht ein.');
        return;
    }

    // Check iteration limit
    if (brainstormingState.chatHistory.length >= PG.CONFIG.maxIterations * 2) {
        alert('⚠️ Du hast das Limit von 8 Chat-Turns erreicht. Du kannst jetzt zur PRD-Generierung übergehen.');
        showContinueButton();
        chatInput.disabled = true;
        return;
    }

    // Add user message
    addChatMessage('user', message);
    chatInput.value = '';
    chatInput.disabled = true;

    // Update counter
    const turnCount = Math.ceil(brainstormingState.chatHistory.length / 2);
    document.getElementById('brainstorm-counter').textContent = `Chat ${turnCount}/8`;

    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message, brainstormingState.topic);
        addChatMessage('ai', aiResponse);
        chatInput.disabled = false;
        focusChatInput();

        // Show continue button if enough iterations
        if (turnCount >= 3) {
            showContinueButton();
        }

        // Analytics
        PG.Analytics.trackChatIteration('brainstorming', turnCount);
    }, 1000 + Math.random() * 2000);
}

function generateAIResponse(userMessage, topic) {
    // Simulate varying AI responses based on turn count
    const responses = [
        `Sehr gut! Das ist eine wichtige Information. Kannst du mir noch mehr über die Umsetzung erzählen?`,
        `Interessant! Das gibt mir ein besseres Bild. Wie stellst du dir die Konkurrenz vor?`,
        `Das macht Sinn. Was ist dein Unique Selling Point (USP) - was macht dich anders?`,
        `Danke für diese Details! Wie möchtest du mit deinen Nutzern interagieren?`,
        `Das ist eine solide Grundlage. Gibt es spezifische Funktionen, die du priorisieren möchtest?`,
        `Perfekt! Ich habe jetzt eine gute Übersicht über deine Idee. Möchtest du noch etwas hinzufügen, bevor wir zum PRD-Generator gehen?`
    ];

    const index = Math.min(brainstormingState.chatHistory.length / 2 - 1, responses.length - 1);
    return responses[Math.floor(index)] || responses[responses.length - 1];
}

function showContinueButton() {
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn && continueBtn.style.display === 'none') {
        continueBtn.style.display = 'block';
    }
}

function continueToPRD() {
    if (brainstormingState.chatHistory.length < 2) {
        alert('⚠️ Bitte führe mindestens ein komplettes Chat-Austausch (Frage & Antwort) durch.');
        return;
    }

    showPhase('prd-generating');

    // Simulate PRD generation
    setTimeout(() => {
        generatePRD();
        showPhase('prd');
    }, 3000 + Math.random() * 7000);
}

// ============================================
// Phase 3: PRD Generation
// ============================================

function generatePRD() {
    // Create a structured PRD from the topic and chat history
    const prdContent = `# Product Requirements Document (PRD)
## ${brainstormingState.topic.substring(0, 50)}...

**Generiert von Prototype Generator**
**Datum:** ${new Date().toLocaleDateString('de-DE')}

### Executive Summary

Basierend auf dem Brainstorming-Prozess haben wir folgende Geschäftsidee strukturiert:

${brainstormingState.topic}

### Vision & Ziele

Die Produktvision ist es, [VISION] zu schaffen. Die Kernziele sind:
- Zielgruppe erreichen
- Problem effektiv lösen
- Nachhaltig wachsen

### Zielbenutzer

**Primäre Zielgruppe:** [Aus Brainstorming]
**Sekundäre Zielgruppe:** [Optional]
**Bedarf:** [Aus Chat]

### Features (MVP)

Basierend auf dem Brainstorming sind folgende Kern-Features geplant:

1. **Core Feature 1** - Beschreibung
2. **Core Feature 2** - Beschreibung
3. **Core Feature 3** - Beschreibung
4. **Core Feature 4** - Beschreibung
5. **Core Feature 5** - Beschreibung

### Nicht-funktionale Anforderungen

- **Performance:** Schnelle Ladezeiten, optimiert
- **Security:** Datenschutz, sichere Authentifizierung
- **Scalability:** Wachstumsfähig

### Geschäftsmodell

[Aus Brainstorming definiert]

### Metriken & KPIs

- Benutzeraufnahme
- Retention Rate
- Revenue pro Benutzer

### Timeline

- **Phase 1 (Woche 1-2):** Setup & Grundstruktur
- **Phase 2 (Woche 3-4):** Core Features
- **Phase 3 (Woche 5-6):** Testing & Optimierung
- **Phase 4 (Woche 7):** Launch

---

*PRD erstellt mit Prototype Generator - AI-powered Ideation & Prototyping*
`;

    brainstormingState.prdData = {
        content: prdContent,
        generatedAt: new Date().toISOString(),
        iterations: 0
    };

    // Display PRD
    const prdContent_element = document.getElementById('prd-content');
    if (prdContent_element) {
        prdContent_element.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; font-family: var(--font-primary);">${escapeHtml(prdContent)}</pre>`;
    }

    // Analytics
    PG.Analytics.trackPRDGeneration('brainstorming');
    PG.Storage.save('brainstorming_prd', brainstormingState.prdData);
}

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

function optimizePRD() {
    const feedback = document.getElementById('prd-feedback').value.trim();

    if (!feedback) {
        alert('❌ Bitte geben Sie Feedback zur PRD-Optimierung ein.');
        return;
    }

    if (brainstormingState.prdIterations >= PG.CONFIG.maxIterations) {
        alert('⚠️ Du hast das Limit von 8 Optimierungen erreicht.');
        return;
    }

    brainstormingState.prdIterations++;
    document.getElementById('prd-iteration-counter').textContent = `Optimierung ${brainstormingState.prdIterations}/8`;

    // In production, this would call AI to refine the PRD
    console.log('📝 PRD Optimization request:', feedback);

    alert('✅ PRD wird optimiert... (Demo)');

    document.getElementById('prd-feedback').value = '';
}

function downloadPRDMarkdown() {
    if (!brainstormingState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    PG.Utils.downloadFile(
        brainstormingState.prdData.content,
        `PRD_${Date.now()}.md`,
        'text/markdown'
    );
}

function downloadPRDJSON() {
    if (!brainstormingState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    const json = JSON.stringify(brainstormingState.prdData, null, 2);
    PG.Utils.downloadFile(
        json,
        `PRD_${Date.now()}.json`,
        'application/json'
    );
}

function copyPRDClipboard() {
    if (!brainstormingState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    PG.Utils.copyToClipboard(brainstormingState.prdData.content);
    alert('✅ PRD in Zwischenablage kopiert');
}

// ============================================
// Phase 4: Prototype Generation
// ============================================

function continueToPrototype() {
    showPhase('prototype-generating');

    // Simulate prototype generation
    setTimeout(() => {
        generatePrototype();
        showPhase('prototype');
    }, 5000 + Math.random() * 10000);
}

function generatePrototype() {
    // Generate basic HTML prototype
    const prototypeHTML = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brainstormingState.topic.substring(0, 40)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .features {
            padding: 4rem 2rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .feature-card {
            padding: 2rem;
            border-radius: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .feature-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }

        .cta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
            margin: 4rem 0;
            border-radius: 10px;
        }

        .cta h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }

        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 2rem;
            text-align: center;
            margin-top: 4rem;
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 1.75rem;
            }

            .cta h2 {
                font-size: 1.5rem;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>🚀 ${brainstormingState.topic.substring(0, 40)}</h1>
        <p>Generiert mit Prototype Generator</p>
    </header>

    <div class="container">
        <section class="features">
            <h2>Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>✨ Feature 1</h3>
                    <p>Erste wichtige Funktion deines Produkts</p>
                </div>
                <div class="feature-card">
                    <h3>🎯 Feature 2</h3>
                    <p>Zweite wichtige Funktion deines Produkts</p>
                </div>
                <div class="feature-card">
                    <h3>🚀 Feature 3</h3>
                    <p>Dritte wichtige Funktion deines Produkts</p>
                </div>
            </div>
        </section>

        <section class="cta">
            <h2>Bereit zu starten?</h2>
            <button class="btn">Jetzt beginnen</button>
        </section>
    </div>

    <footer>
        <p>&copy; 2025 Generiert mit Prototype Generator by Ai Storm Create</p>
    </footer>
</body>
</html>`;

    brainstormingState.prototypeData = {
        html: prototypeHTML,
        generatedAt: new Date().toISOString(),
        iterations: 0
    };

    // Load prototype in iframe
    const iframe = document.getElementById('prototype-iframe');
    if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(prototypeHTML);
        iframeDoc.close();
    }

    // Analytics
    PG.Analytics.trackPrototypeGeneration();
    PG.Storage.save('brainstorming_prototype', brainstormingState.prototypeData);
}

function customizePrototype() {
    const feedback = document.getElementById('prototype-feedback').value.trim();

    if (!feedback) {
        alert('❌ Bitte geben Sie Anpassungen an.');
        return;
    }

    if (brainstormingState.prototypeIterations >= PG.CONFIG.maxIterations) {
        alert('⚠️ Du hast das Limit von 8 Anpassungen erreicht.');
        return;
    }

    brainstormingState.prototypeIterations++;
    document.getElementById('prototype-iteration-counter').textContent = `Anpassung ${brainstormingState.prototypeIterations}/8`;

    console.log('🎨 Prototype customization request:', feedback);
    alert('✅ Prototyp wird angepasst... (Demo)');

    document.getElementById('prototype-feedback').value = '';
}

// ============================================
// Export Functions
// ============================================

function downloadAsZIP() {
    alert('📦 ZIP-Download wird vorbereitet... (Funktioniert in Vollversion)');
    // In production, this would create a ZIP file with all assets
}

function downloadAsSingleHTML() {
    if (!brainstormingState.prototypeData) {
        alert('❌ Prototyp nicht verfügbar');
        return;
    }

    PG.Utils.downloadFile(
        brainstormingState.prototypeData.html,
        `Prototype_${Date.now()}.html`,
        'text/html'
    );
}

function copyCodeClipboard() {
    if (!brainstormingState.prototypeData) {
        alert('❌ Prototyp nicht verfügbar');
        return;
    }

    PG.Utils.copyToClipboard(brainstormingState.prototypeData.html);
    alert('✅ Code in Zwischenablage kopiert');
}

function downloadAsJSON() {
    const sessionData = {
        topic: brainstormingState.topic,
        chatHistory: brainstormingState.chatHistory,
        prd: brainstormingState.prdData,
        prototype: brainstormingState.prototypeData,
        generatedAt: new Date().toISOString()
    };

    const json = JSON.stringify(sessionData, null, 2);
    PG.Utils.downloadFile(
        json,
        `Session_${Date.now()}.json`,
        'application/json'
    );
}

function shareSession() {
    alert('🔗 Session Sharing wird vorbereitet... (Funktioniert in Vollversion)');
}

// ============================================
// Navigation Functions
// ============================================

function goBack() {
    if (brainstormingState.currentPhase === 'input') {
        window.location.href = 'pg-index.html';
    } else if (brainstormingState.currentPhase === 'brainstorm') {
        showPhase('input');
    } else if (brainstormingState.currentPhase === 'prd') {
        backToBrainstorm();
    } else if (brainstormingState.currentPhase === 'prototype') {
        backToPRD();
    }
}

function backToBrainstorm() {
    showPhase('brainstorm');
}

function backToPRD() {
    showPhase('prd');
}

function finishWorkflow() {
    showPhase('complete');

    // Save completed session
    PG.Session.complete();
    PG.Analytics.trackEvent('workflow_completed', {
        mode: 'brainstorming',
        topic: brainstormingState.topic.substring(0, 50)
    });
}

function startNewWorkflow() {
    window.location.href = 'pg-index.html';
}

function goToHome() {
    window.location.href = 'pg-index.html';
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Brainstorming Mode loaded');

    // Restore from storage if available
    const savedState = PG.Storage.load('brainstorming_state');
    if (savedState) {
        Object.assign(brainstormingState, savedState);
        console.log('📁 Restored brainstorming state from storage');
    }

    // Set initial focus
    if (topicInput) {
        topicInput.focus();
    }
});

// Auto-save state periodically
setInterval(() => {
    PG.Storage.save('brainstorming_state', brainstormingState);
}, 30000); // Every 30 seconds
