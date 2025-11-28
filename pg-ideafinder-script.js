/**
 * Prototype Generator - Ideafinder Mode Script
 * Handles idea generation, selection, and workflow
 */

// ============================================
// State Management (Mode-specific)
// ============================================

const ideafinderState = {
    topic: '',
    generatedIdeas: [],
    selectedIdea: null,
    chatHistory: [],
    prdData: null,
    prototypeData: null,
    currentPhase: 'topic-input',
    prdIterations: 0,
    prototypeIterations: 0
};

// ============================================
// Phase Management
// ============================================

function showPhase(phaseName) {
    document.querySelectorAll('.phase-section').forEach(section => {
        section.classList.remove('active');
    });

    const phaseElement = document.getElementById(`phase-${phaseName}`);
    if (phaseElement) {
        phaseElement.classList.add('active');
    }

    ideafinderState.currentPhase = phaseName;
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

        if (count < 10) {
            this.style.borderColor = '#ef4444';
        } else if (count < 50) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
}

function generateIdeas() {
    const topic = topicInput.value.trim();

    if (!PG.Validators.isValidTopic(topic)) {
        alert('❌ Bitte geben Sie ein Thema mit mindestens 10 und maximal 500 Zeichen ein.');
        return;
    }

    ideafinderState.topic = topic;
    const sessionId = PG.Session.start('ideafinder', topic);

    PG.Analytics.trackEvent('ideafinder_started', { topic: topic.substring(0, 50) });

    showPhase('generating');

    // Simulate idea generation
    setTimeout(() => {
        createIdeas();
        showPhase('ideas');
    }, 3000 + Math.random() * 7000);
}

// ============================================
// Phase 2: Idea Generation
// ============================================

function createIdeas() {
    const ideas = [
        {
            id: 1,
            number: 1,
            title: 'AI-powered Service für ' + ideafinderState.topic.split(' ')[0],
            description: 'Ein SaaS-Tool, das künstliche Intelligenz nutzt, um Prozesse zu automatisieren und zu optimieren.',
            scores: {
                marktPotenzial: 8,
                umsetzung: 6,
                relevanz: 8,
                risiko: 7,
                nutzen: 8
            },
            highlights: ['Trendig', 'Hoher ROI', 'Mittleres Risiko']
        },
        {
            id: 2,
            number: 2,
            title: 'Community-Plattform für ' + ideafinderState.topic.split(' ')[0] + ' Enthusiasten',
            description: 'Eine Networking- und Wissensteiligungs-Plattform für eine spezifische Community mit Monetisierung durch Premium-Features.',
            scores: {
                marktPotenzial: 7,
                umsetzung: 5,
                relevanz: 7,
                risiko: 5,
                nutzen: 7
            },
            highlights: ['Viral Potential', 'User-generated Content', 'Niedriges Risiko']
        },
        {
            id: 3,
            number: 3,
            title: 'Mobile-First B2B Lösung für ' + ideafinderState.topic,
            description: 'Eine spezialisierte Anwendung für Unternehmen, optimiert für mobile Nutzer mit Offline-Funktionalität.',
            scores: {
                marktPotenzial: 9,
                umsetzung: 7,
                relevanz: 8,
                risiko: 6,
                nutzen: 9
            },
            highlights: ['Hohes Marktpotenzial', 'Skalierbar', 'B2B Fokus']
        }
    ];

    ideafinderState.generatedIdeas = ideas;
    displayIdeas(ideas);

    PG.Storage.save('ideafinder_ideas', ideas);
    PG.Analytics.trackEvent('ideas_generated', { count: ideas.length });
}

function displayIdeas(ideas) {
    const container = document.getElementById('ideas-container');
    if (!container) return;

    container.innerHTML = '';

    ideas.forEach(idea => {
        const card = createIdeaCard(idea);
        container.appendChild(card);
    });
}

function createIdeaCard(idea) {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.id = `idea-${idea.id}`;

    const scoresHTML = Object.entries(idea.scores)
        .map(([key, value]) => {
            const label = formatScoreLabel(key);
            const scoreColor = value >= 8 ? 'high' : value >= 5 ? 'medium' : 'low';
            return `
                <div class="score-row">
                    <div class="score-label">${label}</div>
                    <div class="score-bar">
                        <div class="score-fill ${scoreColor}" style="width: ${(value / 10) * 100}%"></div>
                    </div>
                    <div class="score-value">${value}/10</div>
                </div>
            `;
        })
        .join('');

    const highlightsHTML = idea.highlights
        .map(h => {
            let badgeClass = 'summary-badge';
            if (h.includes('Risiko') || h.includes('Nachteil')) {
                badgeClass += ' risk';
            } else if (h.includes('Herausforderung') || h.includes('Komplex')) {
                badgeClass += ' caution';
            } else {
                badgeClass += ' positive';
            }
            return `<span class="${badgeClass}">${h}</span>`;
        })
        .join('');

    card.innerHTML = `
        <div class="idea-header">
            <div class="idea-number">${idea.number}</div>
            <div class="idea-title">
                <h3>${idea.title}</h3>
            </div>
        </div>

        <p class="idea-description">${idea.description}</p>

        <div class="idea-summary">
            ${highlightsHTML}
        </div>

        <div class="idea-scores">
            ${scoresHTML}
        </div>

        <div class="idea-actions">
            <button class="idea-select-btn" onclick="selectIdea(${idea.id})">
                Diese Idee wählen
            </button>
            <button class="idea-details-btn" onclick="showIdeaDetails(${idea.id})">
                Details
            </button>
        </div>
    `;

    return card;
}

function formatScoreLabel(key) {
    const labels = {
        marktPotenzial: '🎯 Marktpotenzial',
        umsetzung: '🔧 Umsetzung',
        relevanz: '📈 Relevanz',
        risiko: '⚠️ Risiko',
        nutzen: '💡 Nutzen'
    };
    return labels[key] || key;
}

function selectIdea(ideaId) {
    const idea = ideafinderState.generatedIdeas.find(i => i.id === ideaId);
    if (!idea) return;

    // Visual feedback
    document.querySelectorAll('.idea-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(`idea-${ideaId}`).classList.add('selected');

    ideafinderState.selectedIdea = idea;

    // Show expansion phase
    setTimeout(() => {
        showPhase('expansion');
        initializeExpansionChat(idea);
    }, 500);

    PG.Analytics.trackEvent('idea_selected', { ideaTitle: idea.title.substring(0, 50) });
}

function showIdeaDetails(ideaId) {
    const idea = ideafinderState.generatedIdeas.find(i => i.id === ideaId);
    if (!idea) return;

    const detailsText = `
Idee: ${idea.title}

Beschreibung: ${idea.description}

Marktpotenzial: ${idea.scores.marktPotenzial}/10
Umsetzungskomplexität: ${idea.scores.umsetzung}/10
Relevanz & Trends: ${idea.scores.relevanz}/10
Risikobewertung: ${idea.scores.risiko}/10
Nutzen/Value: ${idea.scores.nutzen}/10

Highlights: ${idea.highlights.join(', ')}

Durchschnittlicher Score: ${(
        (idea.scores.marktPotenzial + idea.scores.umsetzung + idea.scores.relevanz + idea.scores.risiko + idea.scores.nutzen) / 5
    ).toFixed(1)}/10
    `;

    alert(detailsText);
}

function backToIdeasSelection() {
    showPhase('ideas');
}

// ============================================
// Phase 3: Idea Expansion (Chat)
// ============================================

function initializeExpansionChat(idea) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';

        const initialMessage = `
Großartig! 🎉 Du hast diese Idee ausgewählt:

**${idea.title}**

${idea.description}

Jetzt möchte ich mit dir diese Idee verfeinern und strukturieren. Lass mich ein paar Fragen stellen:

1. **Konkurrenzanalyse**: Kennst du bereits existierende Lösungen? Wie würde deine Lösung anders sein?

2. **Go-to-Market**: Wie stellst du dir die Vermarktung vor? (z.B. B2B, B2C, Direct, Partnerships)

3. **Monetisierung**: Wie verdienst du Geld? (z.B. Subscription, One-time, Freemium)

4. **MVP Features**: Was sind die TOP 3-5 Features für die erste Version?

Beantworte diese Fragen, und ich helfe dir, ein professionelles PRD zu erstellen! 🚀
        `.trim();

        addChatMessage('ai', initialMessage);
        setTimeout(() => {
            focusChatInput();
        }, 500);
    }
}

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
    chatMessages.scrollTop = chatMessages.scrollHeight;

    ideafinderState.chatHistory.push({
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

    if (ideafinderState.chatHistory.length >= PG.CONFIG.maxIterations * 2) {
        alert('⚠️ Du hast das Limit von 8 Chat-Turns erreicht.');
        showContinueButton();
        chatInput.disabled = true;
        return;
    }

    addChatMessage('user', message);
    chatInput.value = '';
    chatInput.disabled = true;

    const turnCount = Math.ceil(ideafinderState.chatHistory.length / 2);
    document.getElementById('expansion-counter').textContent = `Chat ${turnCount}/8`;

    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage('ai', aiResponse);
        chatInput.disabled = false;
        focusChatInput();

        if (turnCount >= 3) {
            showContinueButton();
        }

        PG.Analytics.trackChatIteration('ideafinder', turnCount);
    }, 1000 + Math.random() * 2000);
}

function generateAIResponse(userMessage) {
    const responses = [
        'Sehr aufschlussreich! Das gibt mir ein besseres Bild. Und wie sieht dein ideal Kunde aus?',
        'Gut! Das ist eine solide Basis. Kannst du mir mehr über die technischen Anforderungen erzählen?',
        'Interessant! Das macht Sinn. Wie stellst du dir die Priorisierung vor?',
        'Danke für diese Details! Gibt es weitere Features, die wichtig sind?',
        'Das ist eine gute Grundlage. Möchtest du noch etwas hinzufügen?',
        'Perfekt! Ich habe jetzt genug Informationen. Wir können zur PRD-Generierung übergehen.'
    ];

    const index = Math.min(Math.floor(ideafinderState.chatHistory.length / 2 - 1), responses.length - 1);
    return responses[index];
}

function showContinueButton() {
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn && continueBtn.style.display === 'none') {
        continueBtn.style.display = 'block';
    }
}

function continueToPRD() {
    if (ideafinderState.chatHistory.length < 2) {
        alert('⚠️ Bitte führe mindestens einen Chat-Austausch durch.');
        return;
    }

    showPhase('prd-generating');

    setTimeout(() => {
        generatePRDFromIdea();
        showPhase('prd');
    }, 3000 + Math.random() * 7000);
}

// ============================================
// Phase 4: PRD Generation
// ============================================

function generatePRDFromIdea() {
    const idea = ideafinderState.selectedIdea;

    const prdContent = `# Product Requirements Document (PRD)
## ${idea.title}

**Generiert von Prototype Generator - Ideafinder Mode**
**Datum:** ${new Date().toLocaleDateString('de-DE')}

### Executive Summary

Basierend auf der AI-generierten Geschäftsidee und dem Brainstorming haben wir folgende Anforderungen strukturiert:

**Idee:** ${idea.title}
**Beschreibung:** ${idea.description}

### Vision & Ziele

Die Produktvision ist es, [VISION]. Die Kernziele sind:
- Zielgruppe effektiv erreichen
- Problem nachhaltig lösen
- Profitabel wachsen

### Zielbenutzer & Personas

- **Primäre Zielgruppe:** [Aus Brainstorming]
- **Sekundäre Zielgruppe:** [Optional]

### Features (MVP)

Geplante Kern-Features basierend auf dem Brainstorming:
1. Feature 1
2. Feature 2
3. Feature 3
4. Feature 4
5. Feature 5

### Geschäftsmodell

[Definiert im Brainstorming]

### Marktanalyse

**Marktpotenzial:** ${idea.scores.marktPotenzial}/10
**Umsetzungskomplexität:** ${idea.scores.umsetzung}/10
**Relevanz & Trends:** ${idea.scores.relevanz}/10
**Risikobewertung:** ${idea.scores.risiko}/10
**Nutzen/Value:** ${idea.scores.nutzen}/10

Durchschnittlicher Score: ${(
        (idea.scores.marktPotenzial + idea.scores.umsetzung + idea.scores.relevanz + idea.scores.risiko + idea.scores.nutzen) / 5
    ).toFixed(1)}/10

### Erfolgskennzahlen

- Benutzeraufnahme
- Retention Rate
- Revenue pro Benutzer
- Market Share

### Timeline

- **Phase 1 (Woche 1-2):** Setup & Grundstruktur
- **Phase 2 (Woche 3-4):** Core Features
- **Phase 3 (Woche 5-6):** Testing & Optimierung
- **Phase 4 (Woche 7):** Launch

---

*PRD erstellt mit Prototype Generator - Ideafinder Mode*
`;

    ideafinderState.prdData = {
        content: prdContent,
        generatedAt: new Date().toISOString(),
        iterations: 0
    };

    const prdElement = document.getElementById('prd-content');
    if (prdElement) {
        prdElement.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; font-family: var(--font-primary);">${escapeHtml(prdContent)}</pre>`;
    }

    PG.Analytics.trackPRDGeneration('ideafinder');
    PG.Storage.save('ideafinder_prd', ideafinderState.prdData);
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
        alert('❌ Bitte geben Sie Feedback ein.');
        return;
    }

    if (ideafinderState.prdIterations >= PG.CONFIG.maxIterations) {
        alert('⚠️ Limit erreicht.');
        return;
    }

    ideafinderState.prdIterations++;
    document.getElementById('prd-iteration-counter').textContent = `Optimierung ${ideafinderState.prdIterations}/8`;

    console.log('📝 PRD Optimization:', feedback);
    alert('✅ PRD wird optimiert...');
    document.getElementById('prd-feedback').value = '';
}

function downloadPRDMarkdown() {
    if (!ideafinderState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    PG.Utils.downloadFile(
        ideafinderState.prdData.content,
        `PRD_${Date.now()}.md`,
        'text/markdown'
    );
}

function downloadPRDJSON() {
    if (!ideafinderState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    const json = JSON.stringify(ideafinderState.prdData, null, 2);
    PG.Utils.downloadFile(
        json,
        `PRD_${Date.now()}.json`,
        'application/json'
    );
}

function copyPRDClipboard() {
    if (!ideafinderState.prdData) {
        alert('❌ PRD nicht verfügbar');
        return;
    }

    PG.Utils.copyToClipboard(ideafinderState.prdData.content);
    alert('✅ PRD kopiert');
}

function backToExpansion() {
    showPhase('expansion');
}

// ============================================
// Prototype Generation
// ============================================

function continueToPrototype() {
    showPhase('prototype-generating');

    setTimeout(() => {
        generatePrototype();
        showPhase('prototype');
    }, 5000 + Math.random() * 10000);
}

function generatePrototype() {
    const idea = ideafinderState.selectedIdea;

    const prototypeHTML = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${idea.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }

        header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .section {
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
            background: #f9fafb;
            border-radius: 10px;
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

        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
        }

        footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 2rem;
            text-align: center;
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 1.75rem;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>${idea.title}</h1>
        <p>${idea.description}</p>
    </header>

    <div class="container">
        <section class="section">
            <h2>Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>✨ Feature 1</h3>
                    <p>Erste wichtige Funktion</p>
                </div>
                <div class="feature-card">
                    <h3>🎯 Feature 2</h3>
                    <p>Zweite wichtige Funktion</p>
                </div>
                <div class="feature-card">
                    <h3>🚀 Feature 3</h3>
                    <p>Dritte wichtige Funktion</p>
                </div>
            </div>
        </section>

        <section class="cta">
            <h2>Bereit zu starten?</h2>
            <button class="btn">Jetzt beginnen</button>
        </section>
    </div>

    <footer>
        <p>&copy; 2025 Generiert mit Prototype Generator</p>
    </footer>
</body>
</html>`;

    ideafinderState.prototypeData = {
        html: prototypeHTML,
        generatedAt: new Date().toISOString(),
        iterations: 0
    };

    const iframe = document.getElementById('prototype-iframe');
    if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(prototypeHTML);
        iframeDoc.close();
    }

    PG.Analytics.trackPrototypeGeneration();
    PG.Storage.save('ideafinder_prototype', ideafinderState.prototypeData);
}

function customizePrototype() {
    const feedback = document.getElementById('prototype-feedback').value.trim();

    if (!feedback) {
        alert('❌ Bitte geben Sie Anpassungen ein.');
        return;
    }

    if (ideafinderState.prototypeIterations >= PG.CONFIG.maxIterations) {
        alert('⚠️ Limit erreicht.');
        return;
    }

    ideafinderState.prototypeIterations++;
    document.getElementById('prototype-iteration-counter').textContent = `Anpassung ${ideafinderState.prototypeIterations}/8`;

    console.log('🎨 Customization:', feedback);
    alert('✅ Prototyp wird angepasst...');
    document.getElementById('prototype-feedback').value = '';
}

function backToPRD() {
    showPhase('prd');
}

// ============================================
// Export & Navigation
// ============================================

function downloadAsZIP() {
    alert('📦 ZIP wird vorbereitet...');
}

function downloadAsSingleHTML() {
    if (!ideafinderState.prototypeData) {
        alert('❌ Prototyp nicht verfügbar');
        return;
    }

    PG.Utils.downloadFile(
        ideafinderState.prototypeData.html,
        `Prototype_${Date.now()}.html`,
        'text/html'
    );
}

function copyCodeClipboard() {
    if (!ideafinderState.prototypeData) {
        alert('❌ Prototyp nicht verfügbar');
        return;
    }

    PG.Utils.copyToClipboard(ideafinderState.prototypeData.html);
    alert('✅ Code kopiert');
}

function downloadAsJSON() {
    const sessionData = {
        topic: ideafinderState.topic,
        selectedIdea: ideafinderState.selectedIdea,
        chatHistory: ideafinderState.chatHistory,
        prd: ideafinderState.prdData,
        prototype: ideafinderState.prototypeData,
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
    alert('🔗 Sharing wird vorbereitet...');
}

function finishWorkflow() {
    showPhase('complete');
    PG.Session.complete();
    PG.Analytics.trackEvent('ideafinder_workflow_completed', {
        topic: ideafinderState.topic.substring(0, 50),
        selectedIdea: ideafinderState.selectedIdea.title.substring(0, 50)
    });
}

function startNewWorkflow() {
    window.location.href = 'pg-index.html';
}

function goToHome() {
    window.location.href = 'pg-index.html';
}

function goBack() {
    if (ideafinderState.currentPhase === 'topic-input') {
        window.location.href = 'pg-index.html';
    } else if (ideafinderState.currentPhase === 'generating') {
        showPhase('topic-input');
    } else if (ideafinderState.currentPhase === 'ideas') {
        showPhase('topic-input');
    } else if (ideafinderState.currentPhase === 'expansion') {
        backToIdeasSelection();
    } else if (ideafinderState.currentPhase === 'prd') {
        backToExpansion();
    } else if (ideafinderState.currentPhase === 'prototype') {
        backToPRD();
    }
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Ideafinder Mode loaded');

    if (topicInput) {
        topicInput.focus();
    }
});

setInterval(() => {
    PG.Storage.save('ideafinder_state', ideafinderState);
}, 30000);
