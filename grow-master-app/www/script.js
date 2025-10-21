// ===========================
// STATE MANAGEMENT
// ===========================

let isPremium = false;
let freeMessagesLeft = 3;
let currentImage = null;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Simulated chat responses for demo
const plantResponses = {
    greeting: "Hallo! 🌱 Ich bin dein Grow Master Assistent. Wie kann ich dir heute bei deinen Pflanzen helfen?",
    watering: "💧 Die meisten Zimmerpflanzen brauchen Wasser, wenn die obersten 2-3 cm der Erde trocken sind. Im Sommer häufiger als im Winter!",
    light: "☀️ Lichtbedarf variiert stark: Sukkulenten lieben direkte Sonne, während Farne und Philodendren indirektes Licht bevorzugen.",
    yellowing: "🍂 Gelbe Blätter können mehrere Ursachen haben: Überwässerung (häufigste Ursache), Nährstoffmangel, zu wenig Licht oder natürliches Altern.",
    fertilizer: "🌿 Dünge während der Wachstumsphase (Frühjahr/Sommer) alle 2-4 Wochen. Im Winter weniger oder gar nicht düngen.",
    pests: "🐛 Häufige Schädlinge: Blattläuse, Spinnmilben, Trauermücken. Bei Befall: Pflanze isolieren, mit Seifenlauge behandeln oder Nützlinge einsetzen.",
    repotting: "🪴 Umtopfen wenn: Wurzeln aus dem Topf wachsen, Wasser schlecht abläuft oder die Pflanze nicht mehr wächst. Beste Zeit: Frühjahr!",
    imageAnalysis: "📸 Danke für das Foto! Ich analysiere deine Pflanze...\n\n",
    default: "Interessante Frage! 🤔 Als Premium-Nutzer könnte ich dir detailliertere Informationen geben. Möchtest du mehr über spezifische Pflanzenarten erfahren?"
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initializeDraggableCompanion();
    updateTrialCounter();
    showCompanionTooltip();

    // Enter key to send message
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Eye tracking (companion follows mouse)
    initializeEyeTracking();
});

// ===========================
// CHAT FUNCTIONS
// ===========================

function startChat() {
    document.getElementById('welcome-section').classList.add('hidden');
    document.getElementById('chat-section').classList.remove('hidden');
    document.getElementById('trial-counter').classList.remove('hidden');

    // Welcome message from bot
    setTimeout(() => {
        addBotMessage(plantResponses.greeting);
    }, 500);
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message && !currentImage) return;

    // Check if user has free messages left or is premium
    if (!isPremium && freeMessagesLeft <= 0) {
        showPaywall();
        return;
    }

    // Add user message
    addUserMessage(message, currentImage);

    // Clear input
    input.value = '';
    if (currentImage) {
        removeImage();
    }

    // Decrease free messages
    if (!isPremium) {
        freeMessagesLeft--;
        updateTrialCounter();
    }

    // Show typing indicator
    showTypingIndicator();

    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message, currentImage !== null);
        addBotMessage(response);

        // Check if trial is over
        if (!isPremium && freeMessagesLeft === 0) {
            setTimeout(() => {
                showPaywall();
            }, 2000);
        }
    }, 1500 + Math.random() * 1000);
}

function addUserMessage(text, image) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';

    let imageHTML = '';
    if (image) {
        imageHTML = `<img src="${image}" alt="Uploaded plant" class="message-image">`;
    }

    messageDiv.innerHTML = `
        <div class="message-content">
            ${text ? `<p class="message-text">${escapeHtml(text)}</p>` : ''}
            ${imageHTML}
        </div>
        <div class="message-avatar">👤</div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';

    messageDiv.innerHTML = `
        <div class="message-avatar">🌱</div>
        <div class="message-content">
            <p class="message-text">${escapeHtml(text)}</p>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Animate companion on bot message
    animateCompanion();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">🌱</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateBotResponse(message, hasImage) {
    const lowerMessage = message.toLowerCase();

    if (hasImage) {
        const diagnoses = [
            "Deine Pflanze sieht gesund aus! 🌿 Die Blätter sind grün und kräftig. Achte darauf, dass die Erde nicht zu nass wird.",
            "Ich sehe leichte Anzeichen von Wassermangel. 💧 Die Blätter wirken etwas schlaff. Gieße sie vorsichtig und überprüfe die Erde.",
            "Diese Pflanze braucht mehr Licht! ☀️ Die Blätter sind etwas blass. Stelle sie näher ans Fenster (aber nicht in direkte Sonne).",
            "Vorsicht! Ich sehe Anzeichen von Überwässerung. 💦 Die Blätter sind gelb/braun an den Rändern. Reduziere das Gießen!",
            "Perfekte Pflege! 👍 Diese Pflanze sieht sehr glücklich aus. Mach weiter so!"
        ];
        return plantResponses.imageAnalysis + diagnoses[Math.floor(Math.random() * diagnoses.length)];
    }

    if (lowerMessage.includes('hallo') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return plantResponses.greeting;
    }
    if (lowerMessage.includes('gieß') || lowerMessage.includes('wasser') || lowerMessage.includes('bewässer')) {
        return plantResponses.watering;
    }
    if (lowerMessage.includes('licht') || lowerMessage.includes('sonne') || lowerMessage.includes('schatten')) {
        return plantResponses.light;
    }
    if (lowerMessage.includes('gelb') || lowerMessage.includes('braun') || lowerMessage.includes('verfärb')) {
        return plantResponses.yellowing;
    }
    if (lowerMessage.includes('dünger') || lowerMessage.includes('düngen') || lowerMessage.includes('nährstoff')) {
        return plantResponses.fertilizer;
    }
    if (lowerMessage.includes('schädling') || lowerMessage.includes('insekt') || lowerMessage.includes('blattlaus')) {
        return plantResponses.pests;
    }
    if (lowerMessage.includes('umtopf') || lowerMessage.includes('topf') || lowerMessage.includes('erde')) {
        return plantResponses.repotting;
    }

    return plantResponses.default;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// IMAGE UPLOAD
// ===========================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Bild ist zu groß! Maximal 5MB erlaubt.');
        return;
    }

    // Check if premium for image analysis
    if (!isPremium) {
        showPaywall();
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        document.getElementById('preview-img').src = currentImage;
        document.getElementById('image-preview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImage = null;
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('image-upload').value = '';
}

// ===========================
// DRAGGABLE COMPANION
// ===========================

function initializeDraggableCompanion() {
    const companion = document.getElementById('chatbot-companion');
    const avatar = document.getElementById('companion-avatar');

    // Mouse events
    avatar.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    // Touch events for mobile
    avatar.addEventListener('touchstart', startDraggingTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', stopDragging);
}

function startDragging(e) {
    draggedElement = document.getElementById('chatbot-companion');
    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    draggedElement.style.cursor = 'grabbing';

    // Hide tooltip while dragging
    document.getElementById('companion-tooltip').classList.add('hidden');
}

function startDraggingTouch(e) {
    e.preventDefault();
    draggedElement = document.getElementById('chatbot-companion');
    const touch = e.touches[0];
    const rect = draggedElement.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    // Hide tooltip while dragging
    document.getElementById('companion-tooltip').classList.add('hidden');
}

function drag(e) {
    if (!draggedElement) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Keep within viewport
    const maxX = window.innerWidth - draggedElement.offsetWidth;
    const maxY = window.innerHeight - draggedElement.offsetHeight;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    draggedElement.style.left = boundedX + 'px';
    draggedElement.style.top = boundedY + 'px';
    draggedElement.style.right = 'auto';
    draggedElement.style.bottom = 'auto';
}

function dragTouch(e) {
    if (!draggedElement) return;
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;

    // Keep within viewport
    const maxX = window.innerWidth - draggedElement.offsetWidth;
    const maxY = window.innerHeight - draggedElement.offsetHeight;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    draggedElement.style.left = boundedX + 'px';
    draggedElement.style.top = boundedY + 'px';
    draggedElement.style.right = 'auto';
    draggedElement.style.bottom = 'auto';
}

function stopDragging() {
    if (draggedElement) {
        draggedElement.style.cursor = 'move';
        draggedElement = null;
    }
}

function animateCompanion() {
    const companion = document.getElementById('companion-avatar');
    companion.style.transform = 'scale(1.2)';
    setTimeout(() => {
        companion.style.transform = 'scale(1)';
    }, 300);
}

function showCompanionTooltip() {
    setTimeout(() => {
        const tooltip = document.getElementById('companion-tooltip');
        tooltip.classList.remove('hidden');

        // Hide after 5 seconds
        setTimeout(() => {
            tooltip.classList.add('hidden');
        }, 5000);
    }, 2000);
}

// ===========================
// EYE TRACKING
// ===========================

function initializeEyeTracking() {
    document.addEventListener('mousemove', (e) => {
        const leftPupil = document.querySelector('.left-eye .pupil');
        const rightPupil = document.querySelector('.right-eye .pupil');

        if (!leftPupil || !rightPupil) return;

        const companion = document.getElementById('companion-avatar');
        const rect = companion.getBoundingClientRect();
        const companionX = rect.left + rect.width / 2;
        const companionY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const angle = Math.atan2(mouseY - companionY, mouseX - companionX);
        const distance = Math.min(3, Math.hypot(mouseX - companionX, mouseY - companionY) / 100);

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        leftPupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        rightPupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
}

// ===========================
// PREMIUM / PAYWALL
// ===========================

function showPaywall() {
    document.getElementById('paywall-overlay').classList.remove('hidden');
}

function closePaywall() {
    document.getElementById('paywall-overlay').classList.add('hidden');
}

function purchasePremium() {
    // In a real app, this would integrate with Stripe/Apple Pay/Google Pay
    // For demo purposes, we'll simulate the purchase

    alert('🎉 Vielen Dank für dein Interesse!\n\nIn der finalen Version würdest du jetzt zur sicheren Zahlungsseite weitergeleitet.\n\nFür diese Demo schalte ich Premium jetzt kostenlos frei!');

    isPremium = true;
    freeMessagesLeft = Infinity;
    updateTrialCounter();
    closePaywall();

    // Update premium badge
    const badge = document.querySelector('.premium-badge');
    badge.innerHTML = '<span class="badge-icon">✓</span> Premium Aktiv';
    badge.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
    badge.style.color = 'white';

    // Show confirmation message
    setTimeout(() => {
        addBotMessage('🎉 Willkommen bei Premium! Du hast jetzt unbegrenzten Zugang zu allen Features, inklusive Pflanzenanalyse per Foto und unbegrenzten Chat-Nachrichten. Viel Spaß! 🌱');
    }, 500);
}

function updateTrialCounter() {
    const counter = document.getElementById('trial-counter');
    const text = document.getElementById('trial-text');

    if (isPremium) {
        counter.classList.add('hidden');
        return;
    }

    if (freeMessagesLeft > 0) {
        text.textContent = `Kostenlos: ${freeMessagesLeft} ${freeMessagesLeft === 1 ? 'Nachricht' : 'Nachrichten'} übrig`;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

// ===========================
// SERVICE WORKER REGISTRATION
// ===========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
