import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import apiService from '../services/apiService';
import ExportService from '../services/exportService';
import { validators } from '../utils/validators';
import { MAX_ITERATIONS, SCORING_METRICS } from '../utils/constants';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function IdefinderMode() {
  const navigate = useNavigate();
  const {
    ideafinder,
    setIdefinderTopic,
    setIdefinderIdeas,
    setIdefinderSelectedIdea,
    addIdefinderMessage,
    setIdefinderPRDData,
    setIdefinderPrototypeData,
    setLoading,
    isLoading,
    setToast,
    toast,
  } = useAppStore();

  const [phase, setPhase] = useState('input'); // input, ideas, chat, prd, prototype, complete
  const [charCount, setCharCount] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [prototypePreview, setPrototypePreview] = useState('');
  const [responsiveMode, setResponsiveMode] = useState('desktop');
  const [customizationInput, setCustomizationInput] = useState('');
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ideafinder.chatHistory]);

  // Show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // ===== PHASE 1: TOPIC INPUT =====
  const handleGenerateIdeas = async () => {
    if (!validators.isValidTopic(ideafinder.topic)) {
      showToast('Bitte geben Sie ein Thema mit mindestens 10 Zeichen ein', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.generateIdeas(ideafinder.topic);
      setIdefinderIdeas(response.ideas);
      setPhase('ideas');
    } catch (error) {
      console.error('Error generating ideas:', error);
      showToast('Fehler bei der Ideengenerierung: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PHASE 2: IDEAS DISPLAY & SELECTION =====
  const handleSelectIdea = (idea) => {
    setIdefinderSelectedIdea(idea);
    showToast(`Idee "${idea.title}" ausgewählt`, 'success');
    setPhase('chat');
  };

  // ===== PHASE 3: CHAT EXPANSION =====
  const handleSendMessage = async () => {
    const message = chatInput.trim();
    if (!validators.isValidMessage(message)) {
      showToast('Bitte geben Sie eine Nachricht ein', 'error');
      return;
    }

    if (ideafinder.chatHistory.length >= MAX_ITERATIONS * 2) {
      showToast('Sie haben das Limit von 8 Chat-Turns erreicht', 'warning');
      return;
    }

    // Add user message
    addIdefinderMessage('user', message);
    setChatInput('');
    setLoading(true);

    try {
      const response = await apiService.brainstormChat(
        'session-id',
        message,
        ideafinder.chatHistory,
        ideafinder.selectedIdea?.title || ideafinder.topic
      );

      addIdefinderMessage('ai', response.reply);
    } catch (error) {
      console.error('Chat error:', error);
      showToast('Fehler beim Chat: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== PHASE 4: PRD GENERATION =====
  const handleGeneratePRD = async () => {
    setLoading(true);
    try {
      const response = await apiService.generatePRD(
        ideafinder.topic,
        ideafinder.chatHistory,
        ideafinder.selectedIdea
      );

      setIdefinderPRDData({
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

  // ===== PHASE 5: PROTOTYPE GENERATION =====
  const handleGeneratePrototype = async () => {
    setLoading(true);
    try {
      const response = await apiService.generatePrototype(ideafinder.prdData.content);

      setIdefinderPrototypeData({
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
        ideafinder.prototypeData.html,
        feedback
      );

      setIdefinderPrototypeData({
        ...ideafinder.prototypeData,
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
        mode: 'ideafinder',
        topic: ideafinder.topic,
        selectedIdea: ideafinder.selectedIdea,
        prdData: ideafinder.prdData,
        prototypeData: ideafinder.prototypeData,
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
      ExportService.exportAsSingleHTML(ideafinder.prototypeData.html);
      showToast('✅ HTML-Datei heruntergeladen', 'success');
    } catch (error) {
      showToast('Fehler beim Export: ' + error.message, 'error');
    }
  };

  const handleExportJSON = () => {
    try {
      const sessionData = {
        mode: 'ideafinder',
        topic: ideafinder.topic,
        selectedIdea: ideafinder.selectedIdea,
        prdData: ideafinder.prdData,
        prototypeData: ideafinder.prototypeData,
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
      await ExportService.copyToClipboard(ideafinder.prototypeData.html);
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

  const getPhaseNumber = () => {
    const phaseMap = {
      input: '1',
      ideas: '2',
      chat: '3',
      prd: '4',
      prototype: '5',
      complete: '6',
    };
    return phaseMap[phase] || '1';
  };

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
          <h1 className="text-2xl font-bold">💡 Ideafinder Modus</h1>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Phase {getPhaseNumber()}/6
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* PHASE 1: TOPIC INPUT */}
        {phase === 'input' && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Schritt 1: Thema eingeben</h2>
            <p className="text-gray-600 mb-6">
              Geben Sie ein Thema ein und wir generieren innovative Geschäftsideen für Sie.
            </p>

            <textarea
              value={ideafinder.topic}
              onChange={(e) => {
                setIdefinderTopic(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder="z.B. 'SaaS für Remote Team Collaboration' oder 'Mobile App für Fitness'"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] mb-4 font-mono text-sm"
            />

            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">
                {charCount}/500 Zeichen
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all"
                  style={{ width: `${(charCount / 500) * 100}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateIdeas}
              disabled={isLoading || !validators.isValidTopic(ideafinder.topic)}
              fullWidth
            >
              {isLoading ? 'Generiere Ideen...' : 'Ideen generieren'}
            </Button>
          </div>
        )}

        {/* PHASE 2: IDEAS DISPLAY & SELECTION */}
        {phase === 'ideas' && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Schritt 2: Ideen auswählen</h2>
            <p className="text-gray-600 mb-8">
              Hier sind {ideafinder.generatedIdeas.length} Ideen basierend auf "{ideafinder.topic}".
              Wählen Sie eine aus, um fortzufahren.
            </p>

            {isLoading ? (
              <LoadingSpinner message="Ideen werden generiert..." />
            ) : ideafinder.generatedIdeas.length > 0 ? (
              <div className="space-y-6">
                {ideafinder.generatedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#667eea] hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleSelectIdea(idea)}
                  >
                    {/* Idea Title and Description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                    <p className="text-gray-600 mb-6">{idea.description}</p>

                    {/* Scoring Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      {SCORING_METRICS.map((metric) => {
                        const score = idea.scores[metric.key];
                        const percentage = (score / 10) * 100;
                        return (
                          <div key={metric.key}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {metric.label}
                              </span>
                              <span className="text-sm font-bold text-[#667eea]">{score}/10</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Highlights */}
                    {idea.highlights && idea.highlights.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Highlights:</p>
                        <ul className="space-y-1">
                          {idea.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Select Button */}
                    <button className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:opacity-90 font-medium transition-opacity">
                      Diese Idee auswählen →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Keine Ideen generiert. Versuchen Sie es erneut.</p>
                <Button onClick={() => setPhase('input')} className="mt-4">
                  Zurück
                </Button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 3: CHAT EXPANSION */}
        {phase === 'chat' && (
          <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col h-[calc(100vh-200px)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schritt 3: Idee erweitern</h2>
              <p className="text-gray-600 mb-2">
                Ausgewählte Idee: <strong>{ideafinder.selectedIdea?.title}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Chatten Sie mit unserem KI-Mentor, um Ihre Idee zu expandieren und zu verfeinern.
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {ideafinder.chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Starten Sie ein Gespräch, um Ihre Idee zu erweitern.</p>
                  <p className="text-sm mt-2">Max. 8 Chat-Turns</p>
                </div>
              ) : (
                ideafinder.chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-wrap-word">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Geben Sie Ihre Nachricht ein... (Ctrl+Enter)"
                className="flex-1 h-16 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] font-mono text-sm resize-none"
                disabled={isLoading || ideafinder.chatHistory.length >= MAX_ITERATIONS * 2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim() || ideafinder.chatHistory.length >= MAX_ITERATIONS * 2}
                className="self-end"
              >
                Senden
              </Button>
            </div>

            {ideafinder.chatHistory.length >= MAX_ITERATIONS * 2 && (
              <p className="text-sm text-orange-600 mt-2">⚠️ Chat-Limit von 8 Turns erreicht</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => setPhase('ideas')}
                variant="secondary"
              >
                ← Idee wechseln
              </Button>
              <Button
                onClick={handleGeneratePRD}
                disabled={isLoading}
                className="flex-1"
              >
                PRD generieren →
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 4: PRD DISPLAY */}
        {phase === 'prd' && (
          <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col h-[calc(100vh-200px)]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Schritt 4: Product Requirements Document</h2>

            {/* PRD Content */}
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: md.render(ideafinder.prdData.content),
                }}
              />
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <Button onClick={() => ExportService.exportAsMarkdown(ideafinder.prdData.content)} variant="secondary">
                📄 Markdown
              </Button>
              <Button onClick={handleExportJSON} variant="secondary">
                📦 JSON
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await ExportService.copyToClipboard(ideafinder.prdData.content);
                    showToast('✅ PRD in Zwischenablage kopiert', 'success');
                  } catch (error) {
                    showToast('Fehler beim Kopieren', 'error');
                  }
                }}
                variant="secondary"
              >
                📋 Kopieren
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button onClick={() => setPhase('chat')} variant="secondary">
                ← Chat
              </Button>
              <Button onClick={handleGeneratePrototype} className="flex-1">
                Prototyp generieren →
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 5: PROTOTYPE GENERATION & CUSTOMIZATION */}
        {phase === 'prototype' && (
          <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col h-[calc(100vh-200px)]">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Schritt 5: Frontend-Prototyp</h2>

            {/* Responsive Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setResponsiveMode('mobile')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  responsiveMode === 'mobile'
                    ? 'bg-[#667eea] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📱 Mobile (320px)
              </button>
              <button
                onClick={() => setResponsiveMode('tablet')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  responsiveMode === 'tablet'
                    ? 'bg-[#667eea] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📱 Tablet (768px)
              </button>
              <button
                onClick={() => setResponsiveMode('desktop')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  responsiveMode === 'desktop'
                    ? 'bg-[#667eea] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💻 Desktop
              </button>
            </div>

            {/* Iframe Preview */}
            <div
              className="flex-1 mb-6 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
              style={{
                width: responsiveMode === 'mobile' ? '320px' : responsiveMode === 'tablet' ? '768px' : '100%',
                margin: '0 auto',
              }}
            >
              <iframe
                ref={iframeRef}
                title="Prototype Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            {/* Customization Form */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Prototyp anpassen</h3>
              <textarea
                value={customizationInput}
                onChange={(e) => setCustomizationInput(e.target.value)}
                placeholder="z.B. 'Buttons größer machen' oder 'Farbe zu Dunkelblau ändern'"
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] mb-2 resize-none"
                disabled={isLoading || ideafinder.prototypeData.iterations >= MAX_ITERATIONS}
              />
              <p className="text-sm text-gray-500 mb-3">
                Anpassungen: {ideafinder.prototypeData.iterations}/{MAX_ITERATIONS}
              </p>
              <Button
                onClick={() => {
                  if (customizationInput.trim()) {
                    handleCustomizePrototype(customizationInput);
                    setCustomizationInput('');
                  }
                }}
                disabled={isLoading || !customizationInput.trim() || ideafinder.prototypeData.iterations >= MAX_ITERATIONS}
                className="w-full"
              >
                Anpassen
              </Button>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              <Button onClick={handleExportZIP} variant="secondary">
                📦 ZIP
              </Button>
              <Button onClick={handleExportHTML} variant="secondary">
                🌐 HTML
              </Button>
              <Button onClick={handleCopyCode} variant="secondary">
                📋 Code
              </Button>
              <Button
                onClick={async () => {
                  const sessionData = {
                    mode: 'ideafinder',
                    topic: ideafinder.topic,
                    selectedIdea: ideafinder.selectedIdea,
                    prdData: ideafinder.prdData,
                    prototypeData: ideafinder.prototypeData,
                  };
                  try {
                    await ExportService.exportAsJSON(sessionData);
                    showToast('✅ Sitzung exportiert', 'success');
                  } catch (error) {
                    showToast('Fehler beim Export', 'error');
                  }
                }}
                variant="secondary"
              >
                💾 Session
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button onClick={() => setPhase('prd')} variant="secondary">
                ← PRD
              </Button>
              <Button onClick={() => setPhase('complete')} className="flex-1">
                Fertig! ✨
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 6: COMPLETION */}
        {phase === 'complete' && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-6xl mb-6 animate-bounce">✨</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Fertig!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Ihre Geschäftsidee wurde erfolgreich in einen funktionsfähigen Prototyp umgewandelt.
            </p>

            {/* Deliverables */}
            <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Sie haben erhalten:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#667eea] font-bold mr-3">✓</span>
                  <span><strong>3 innovative Geschäftsideen</strong> mit Marktbewertung</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#667eea] font-bold mr-3">✓</span>
                  <span><strong>Ausgearbeitete Idee</strong> nach KI-Mentoring-Session</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#667eea] font-bold mr-3">✓</span>
                  <span><strong>Umfassendes PRD</strong> mit 10 Abschnitten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#667eea] font-bold mr-3">✓</span>
                  <span><strong>95% produktionsreifer Prototyp</strong> mit anpassbaren Designs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#667eea] font-bold mr-3">✓</span>
                  <span><strong>Mehrere Export-Formate</strong> (ZIP, HTML, JSON, Markdown)</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col md:flex-row">
              <Button onClick={() => navigate('/')} variant="secondary" className="md:flex-1">
                🏠 Zurück zur Startseite
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await handleExportZIP();
                    showToast('✅ Download abgeschlossen', 'success');
                  } catch (error) {
                    showToast('Fehler beim Download', 'error');
                  }
                }}
                className="md:flex-1"
              >
                📥 Download & Fertig
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
