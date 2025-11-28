import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import apiService from '../services/apiService';
import storageService from '../services/storageService';
import ExportService from '../services/exportService';
import { validators } from '../utils/validators';
import { MAX_ITERATIONS } from '../utils/constants';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function BrainstormingMode() {
  const navigate = useNavigate();
  const {
    brainstorming,
    setBrainstormingTopic,
    addBrainstormingMessage,
    setPRDData,
    setPrototypeData,
    setLoading,
    isLoading,
    setToast,
    toast,
  } = useAppStore();

  const [phase, setPhase] = useState('input'); // input, chat, prd, prototype, complete
  const [charCount, setCharCount] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [prototypePreview, setPrototypePreview] = useState('');
  const [responsiveMode, setResponsiveMode] = useState('desktop');
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [brainstorming.chatHistory]);

  // Show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // ===== PHASE 1: TOPIC INPUT =====
  const handleStartBrainstorming = async () => {
    if (!validators.isValidTopic(brainstorming.topic)) {
      showToast('Bitte geben Sie eine Idee mit mindestens 10 Zeichen ein', 'error');
      return;
    }

    setLoading(true);
    try {
      // Start with initial AI message
      const initialPrompt = `
I have this business idea: "${brainstorming.topic}"

Please ask me 5 thoughtful questions to help me expand and structure this idea better. Focus on:
- Target audience
- Problem it solves
- Unique selling proposition
- Business model
- MVP features
      `.trim();

      const response = await apiService.brainstormChat(
        'session-id',
        initialPrompt,
        [],
        brainstorming.topic
      );

      addBrainstormingMessage('ai', response.reply);
      setPhase('chat');
    } catch (error) {
      console.error('Error starting brainstorming:', error);
      showToast('Fehler beim Starten: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PHASE 2: CHAT =====
  const handleSendMessage = async () => {
    const message = chatInput.trim();
    if (!validators.isValidMessage(message)) {
      showToast('Bitte geben Sie eine Nachricht ein', 'error');
      return;
    }

    if (brainstorming.chatHistory.length >= MAX_ITERATIONS * 2) {
      showToast('Sie haben das Limit von 8 Chat-Turns erreicht', 'warning');
      return;
    }

    // Add user message
    addBrainstormingMessage('user', message);
    setChatInput('');
    setLoading(true);

    try {
      const response = await apiService.brainstormChat(
        'session-id',
        message,
        brainstorming.chatHistory,
        brainstorming.topic
      );

      addBrainstormingMessage('ai', response.reply);
    } catch (error) {
      console.error('Chat error:', error);
      showToast('Fehler beim Chat: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PHASE 3: PRD GENERATION =====
  const handleGeneratePRD = async () => {
    setLoading(true);
    try {
      const response = await apiService.generatePRD(
        brainstorming.topic,
        brainstorming.chatHistory
      );

      setPRDData({
        content: response.prdContent,
        generatedAt: new Date().toISOString(),
        iterations: 0,
      });

      setPhase('prd');
    } catch (error) {
      console.error('PRD generation error:', error);
      showToast('Fehler bei PRD-Generierung: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PHASE 4: PROTOTYPE GENERATION =====
  const handleGeneratePrototype = async () => {
    setLoading(true);
    try {
      const response = await apiService.generatePrototype(
        brainstorming.prdData.content
      );

      setPrototypeData({
        html: response.html,
        generatedAt: new Date().toISOString(),
        iterations: 0,
      });

      setPrototypePreview(response.html);
      setPhase('prototype');
    } catch (error) {
      console.error('Prototype generation error:', error);
      showToast('Fehler bei Prototyp-Generierung: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PROTOTYPE CUSTOMIZATION =====
  const handleCustomizePrototype = async (feedback) => {
    setLoading(true);
    try {
      const response = await apiService.customizePrototype(
        brainstorming.prototypeData.html,
        feedback
      );

      setPrototypeData({
        ...brainstorming.prototypeData,
        html: response.html,
      });

      setPrototypePreview(response.html);
      showToast('Prototyp wurde aktualisiert', 'success');
    } catch (error) {
      console.error('Customization error:', error);
      showToast('Fehler bei Anpassung: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== EXPORT FUNCTIONS =====
  const handleExportZIP = async () => {
    try {
      const sessionData = {
        mode: 'brainstorming',
        topic: brainstorming.topic,
        prdData: brainstorming.prdData,
        prototypeData: brainstorming.prototypeData,
      };

      await ExportService.exportAsZIP(sessionData);
      showToast('✅ ZIP-Datei heruntergeladen', 'success');
    } catch (error) {
      console.error('Export ZIP error:', error);
      showToast('Fehler beim Export: ' + error.message, 'error');
    }
  };

  const handleExportHTML = () => {
    try {
      ExportService.exportAsSingleHTML(brainstorming.prototypeData.html);
      showToast('✅ HTML-Datei heruntergeladen', 'success');
    } catch (error) {
      showToast('Fehler beim Export: ' + error.message, 'error');
    }
  };

  const handleExportJSON = () => {
    try {
      const sessionData = {
        mode: 'brainstorming',
        topic: brainstorming.topic,
        prdData: brainstorming.prdData,
        prototypeData: brainstorming.prototypeData,
        timestamp: new Date().toISOString(),
      };

      ExportService.exportAsJSON(sessionData);
      showToast('✅ JSON-Datei heruntergeladen', 'success');
    } catch (error) {
      showToast('Fehler beim Export: ' + error.message, 'error');
    }
  };

  const handleCopyCode = async () => {
    try {
      await ExportService.copyToClipboard(brainstorming.prototypeData.html);
      showToast('✅ Code in Zwischenablage kopiert', 'success');
    } catch (error) {
      showToast('Fehler beim Kopieren: ' + error.message, 'error');
    }
  };

  // Render iframe content
  useEffect(() => {
    if (iframeRef.current && prototypePreview) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(prototypePreview);
      iframeDoc.close();
    }
  }, [prototypePreview]);

  // Loading state for generation
  if (isLoading && (phase === 'prd' || phase === 'prototype')) {
    return (
      <LoadingSpinner
        message={
          phase === 'prd'
            ? 'PRD wird generiert...'
            : 'Frontend-Prototyp wird generiert...'
        }
        tips={['Dies dauert ca. 5-15 Sekunden']}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:opacity-80 text-lg"
          >
            ← Zurück
          </button>
          <h1 className="text-2xl font-bold">🧠 Brainstorming Modus</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Phase {phase === 'input' ? '1' : phase === 'chat' ? '2' : phase === 'prd' ? '3' : '4'}/4
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* PHASE 1: TOPIC INPUT */}
        {phase === 'input' && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Schritt 1: Deine Idee eingeben</h2>
            <p className="text-gray-600 mb-6">
              Beschreibe deine Geschäftsidee detailliert. Je mehr Details, desto besser!
            </p>

            <textarea
              value={brainstorming.topic}
              onChange={(e) => {
                setBrainstormingTopic(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder="Z.B.: Ich möchte eine Fitness-App mit AI-powered Workout-Vorschlägen und Social-Features..."
              maxLength={500}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#667eea] focus:outline-none mb-2 h-32 font-mono text-sm"
            />
            <div className="text-right text-gray-500 text-sm mb-6">
              {charCount}/500 Zeichen
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartBrainstorming}
              disabled={!validators.isValidTopic(brainstorming.topic) || isLoading}
            >
              {isLoading ? 'Wird gestartet...' : 'Brainstorming starten 🚀'}
            </Button>

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h4 className="font-bold text-blue-900 mb-2">💡 Tipps für beste Ergebnisse:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Sei spezifisch - Allgemeine Ideen führen zu allgemeinen Ergebnissen</li>
                <li>✓ Nenne dein Ziel-Publikum</li>
                <li>✓ Erwähne deinen Unique Selling Point</li>
                <li>✓ Mindestens 10-15 Wörter sind ideal</li>
              </ul>
            </div>
          </div>
        )}

        {/* PHASE 2: CHAT */}
        {phase === 'chat' && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Schritt 2: Ideen expandieren</h2>
            <p className="text-gray-600 mb-6">
              Chat {Math.ceil(brainstorming.chatHistory.length / 2)}/{MAX_ITERATIONS}
            </p>

            {/* Chat Messages */}
            <div className="border-2 border-gray-300 rounded-lg h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
              {brainstorming.chatHistory.map((msg, idx) => (
                <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSendMessage();
                }
              }}
              placeholder="Deine Antwort..."
              maxLength={2000}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#667eea] focus:outline-none mb-3 h-20 font-mono text-sm"
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={!validators.isValidMessage(chatInput) || isLoading || brainstorming.chatHistory.length >= MAX_ITERATIONS * 2}
                className="flex-1"
              >
                Senden
              </Button>
            </div>

            {brainstorming.chatHistory.length >= MAX_ITERATIONS * 2 ? (
              <Button
                variant="primary"
                fullWidth
                onClick={handleGeneratePRD}
                disabled={isLoading}
                className="mt-4"
              >
                Zu PRD Generation →
              </Button>
            ) : null}
          </div>
        )}

        {/* PHASE 3: PRD */}
        {phase === 'prd' && brainstorming.prdData && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Schritt 3: PRD Review</h2>

            <div className="border-2 border-gray-300 rounded-lg p-6 mb-6 bg-gray-50 max-h-96 overflow-y-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(brainstorming.prdData.content),
                }}
                className="prose prose-sm max-w-none"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                variant="secondary"
                onClick={() => ExportService.exportAsMarkdown(brainstorming.prdData.content)}
                className="flex-1"
              >
                📄 Markdown
              </Button>
              <Button
                variant="secondary"
                onClick={() => ExportService.exportAsJSON(brainstorming.prdData)}
                className="flex-1"
              >
                💾 JSON
              </Button>
              <Button
                variant="secondary"
                onClick={() => ExportService.copyToClipboard(brainstorming.prdData.content)}
                className="flex-1"
              >
                📋 Kopieren
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setPhase('chat')}
                className="flex-1"
              >
                ← Zurück
              </Button>
              <Button
                variant="primary"
                onClick={handleGeneratePrototype}
                disabled={isLoading}
                className="flex-1"
              >
                Zum Prototyp →
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 4: PROTOTYPE */}
        {phase === 'prototype' && brainstorming.prototypeData && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Schritt 4: Prototyp-Vorschau</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Preview */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-900">Vorschau</label>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                  <div className="flex gap-2 p-2 bg-gray-200">
                    <button
                      onClick={() => setResponsiveMode('mobile')}
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        responsiveMode === 'mobile'
                          ? 'bg-[#667eea] text-white'
                          : 'bg-gray-300'
                      }`}
                    >
                      📱 Mobile
                    </button>
                    <button
                      onClick={() => setResponsiveMode('tablet')}
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        responsiveMode === 'tablet'
                          ? 'bg-[#667eea] text-white'
                          : 'bg-gray-300'
                      }`}
                    >
                      📖 Tablet
                    </button>
                    <button
                      onClick={() => setResponsiveMode('desktop')}
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        responsiveMode === 'desktop'
                          ? 'bg-[#667eea] text-white'
                          : 'bg-gray-300'
                      }`}
                    >
                      🖥️ Desktop
                    </button>
                  </div>
                  <iframe
                    ref={iframeRef}
                    className={`w-full bg-white ${
                      responsiveMode === 'mobile'
                        ? 'h-96'
                        : responsiveMode === 'tablet'
                        ? 'h-full'
                        : 'h-screen'
                    }`}
                    title="Prototype Preview"
                    sandbox="allow-same-origin allow-popups"
                  />
                </div>
              </div>

              {/* Customization */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Anpassungen</label>
                <textarea
                  id="customize-feedback"
                  placeholder="Z.B.: Buttons größer machen / Farbe ändern..."
                  maxLength={500}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#667eea] focus:outline-none h-32 font-mono text-sm mb-2"
                />
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    const feedback = document.getElementById('customize-feedback').value;
                    if (feedback.trim()) {
                      handleCustomizePrototype(feedback);
                      document.getElementById('customize-feedback').value = '';
                    }
                  }}
                  disabled={isLoading}
                >
                  Anpassen
                </Button>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Code exportieren:</h3>
                <div className="space-y-2">
                  <Button variant="secondary" fullWidth onClick={handleExportZIP}>
                    📦 ZIP Download
                  </Button>
                  <Button variant="secondary" fullWidth onClick={handleExportHTML}>
                    📄 HTML
                  </Button>
                  <Button variant="secondary" fullWidth onClick={handleCopyCode}>
                    📋 Code kopieren
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Session speichern:</h3>
                <div className="space-y-2">
                  <Button variant="secondary" fullWidth onClick={handleExportJSON}>
                    💾 Als JSON
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => showToast('Share-Funktion kommt in Phase 2', 'info')}
                  >
                    🔗 Teilen
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setPhase('prd')}
                className="flex-1"
              >
                ← Zurück zu PRD
              </Button>
              <Button
                variant="primary"
                onClick={() => setPhase('complete')}
                className="flex-1"
              >
                Fertig ✨
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 5: COMPLETION */}
        {phase === 'complete' && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Glückwunsch!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Dein Prototyp ist fertig und bereit zum Download.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8 text-left rounded">
              <h3 className="font-bold text-green-900 mb-3">✅ Was du erhalten hast:</h3>
              <ul className="text-green-800 space-y-2">
                <li>✓ Strukturierte Geschäftsidee (aus Brainstorming)</li>
                <li>✓ Professionelles PRD</li>
                <li>✓ Funktionaler Frontend-Prototyp</li>
                <li>✓ Alles responsive & optimization</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/')}
              >
                Neue Idee
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => {
                  handleExportZIP();
                  setTimeout(() => navigate('/'), 2000);
                }}
              >
                Download & Fertig
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
