import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/Button';
import ExportService from '../services/exportService';

export default function Completion() {
  const navigate = useNavigate();
  const { brainstorming, ideafinder, currentMode, setToast } = useAppStore();

  const isIdeafinder = currentMode === 'ideafinder';
  const data = isIdeafinder ? ideafinder : brainstorming;

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleExport = async () => {
    try {
      const sessionData = {
        mode: currentMode,
        topic: data.topic,
        ...(isIdeafinder && { selectedIdea: data.selectedIdea }),
        prdData: data.prdData,
        prototypeData: data.prototypeData,
        timestamp: new Date().toISOString(),
      };

      await ExportService.exportAsZIP(sessionData);
      showToast('✅ ZIP-Datei heruntergeladen', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Fehler beim Export: ' + error.message, 'error');
    }
  };

  const getModeTitle = () => {
    if (isIdeafinder) {
      return (
        <>
          <strong>{data.selectedIdea?.title}</strong> - aus 3 generierten Ideen
        </>
      );
    }
    return <strong>{data.topic}</strong>;
  };

  const getDeliverables = () => {
    if (isIdeafinder) {
      return [
        <li key="1" className="flex items-start">
          <span className="text-[#667eea] font-bold mr-3">✓</span>
          <span><strong>3 innovative Geschäftsideen</strong> mit Marktbewertung</span>
        </li>,
        <li key="2" className="flex items-start">
          <span className="text-[#667eea] font-bold mr-3">✓</span>
          <span><strong>Ausgearbeitete Idee</strong> nach KI-Mentoring-Session</span>
        </li>,
        <li key="3" className="flex items-start">
          <span className="text-[#667eea] font-bold mr-3">✓</span>
          <span><strong>Umfassendes PRD</strong> mit 10 Abschnitten</span>
        </li>,
        <li key="4" className="flex items-start">
          <span className="text-[#667eea] font-bold mr-3">✓</span>
          <span><strong>95% produktionsreifer Prototyp</strong> mit anpassbaren Designs</span>
        </li>,
        <li key="5" className="flex items-start">
          <span className="text-[#667eea] font-bold mr-3">✓</span>
          <span><strong>Mehrere Export-Formate</strong> (ZIP, HTML, JSON, Markdown)</span>
        </li>,
      ];
    }

    return [
      <li key="1" className="flex items-start">
        <span className="text-[#667eea] font-bold mr-3">✓</span>
        <span><strong>Erweiterte Geschäftsidee</strong> aus KI-Mentoring-Session</span>
      </li>,
      <li key="2" className="flex items-start">
        <span className="text-[#667eea] font-bold mr-3">✓</span>
        <span><strong>Umfassendes PRD</strong> mit 10 Abschnitten</span>
      </li>,
      <li key="3" className="flex items-start">
        <span className="text-[#667eea] font-bold mr-3">✓</span>
        <span><strong>95% produktionsreifer Prototyp</strong> mit anpassbaren Designs</span>
      </li>,
      <li key="4" className="flex items-start">
        <span className="text-[#667eea] font-bold mr-3">✓</span>
        <span><strong>Mehrere Export-Formate</strong> (ZIP, HTML, JSON, Markdown)</span>
      </li>,
      <li key="5" className="flex items-start">
        <span className="text-[#667eea] font-bold mr-3">✓</span>
        <span><strong>Session-Daten</strong> für zukünftige Referenzen</span>
      </li>,
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">🎉 Projekt erfolgreich erstellt</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          {/* Success Animation */}
          <div className="text-6xl mb-6 animate-bounce">✨</div>

          {/* Main Message */}
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Fertig!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ihre Geschäftsidee{' '}
            {getModeTitle()}
            {' '}
            wurde erfolgreich in einen funktionsfähigen Prototyp umgewandelt.
          </p>

          {/* Project Details */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">📊 Projekt-Details:</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">Modus:</span>
                <span>{isIdeafinder ? '💡 Ideafinder' : '🧠 Brainstorming'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">Original-Thema:</span>
                <span className="text-right max-w-xs">{data.topic}</span>
              </div>
              {isIdeafinder && data.selectedIdea && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-medium">Ausgewählte Idee:</span>
                  <span className="text-right max-w-xs">{data.selectedIdea.title}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium">Chat-Turns:</span>
                <span>{Math.ceil(data.chatHistory.length / 2)}/8</span>
              </div>
              {data.prototypeData?.iterations > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Prototyp-Anpassungen:</span>
                  <span>{data.prototypeData.iterations}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">📦 Sie haben erhalten:</h3>
            <ul className="space-y-3 text-gray-700">
              {getDeliverables()}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-4">🚀 Nächste Schritte:</h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Laden Sie die ZIP-Datei herunter mit allen Dateien</li>
              <li>Öffnen Sie die HTML-Datei in Ihrem Browser zur Vorschau</li>
              <li>Bearbeiten Sie den HTML/CSS-Code nach Ihren Wünschen</li>
              <li>Integrieren Sie Backend-Funktionalität</li>
              <li>Deployen Sie zu Ihrer Hosting-Plattform</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <Button onClick={() => navigate('/')} variant="secondary" className="flex-1">
              🏠 Zur Startseite
            </Button>
            <Button onClick={handleExport} className="flex-1">
              📥 Download & Fertig
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 max-w-2xl mx-auto">
            <p>
              Fragen? Besuchen Sie unsere Dokumentation oder kontaktieren Sie den Support.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
