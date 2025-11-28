import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Button from '../components/Button';
import { MODES, FEATURES, PERSONAS } from '../utils/constants';

export default function Home() {
  const navigate = useNavigate();
  const { startSession } = useAppStore();

  const handleStartMode = (mode) => {
    startSession(mode, '');
    navigate(`/${mode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-full text-sm font-semibold">
              🚀 AI-powered • Instant • 95% Production Ready
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Von der Idee zum Prototyp
            <br />
            <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-transparent bg-clip-text">
              in Minuten, nicht Wochen
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Verwandle deine Geschäftsidee mit AI in einen professionellen, funktionalen Frontend-Prototyp.
            Perfekt für Startups, Designer und Product Manager.
          </p>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Brainstorming Card */}
            <div
              onClick={() => handleStartMode(MODES.BRAINSTORMING)}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#667eea] hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Brainstorming Modus</h3>
              <p className="text-gray-600 mb-6">
                Du hast eine grobe Idee? Der AI-Agent erweitert und strukturiert sie mit dir in bis zu 8 Chat-Turns.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>✨</span> Idee erweitern
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📝</span> PRD generieren
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>💻</span> Prototyp erzeugen
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleStartMode(MODES.BRAINSTORMING)}
              >
                Brainstorming starten
              </Button>
            </div>

            {/* Ideafinder Card */}
            <div
              onClick={() => handleStartMode(MODES.IDEAFINDER)}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#764ba2] hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ideenfinder Modus</h3>
              <p className="text-gray-600 mb-6">
                Brauchst du Inspiration? Das System generiert 3 Geschäftsideen mit Marktanalyse und Scoring.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>🎯</span> 3 Ideen generiert
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>📊</span> Markt-Scoring
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span>🚀</span> Sofort umsetzbar
                </div>
              </div>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleStartMode(MODES.IDEAFINDER)}
              >
                Ideen entdecken
              </Button>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            ⏱️ Gesamter Workflow: &lt; 30 Minuten • 🔒 Keine Registrierung • 💾 Alles wird lokal gespeichert
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Was du bekommst</h2>
            <p className="text-gray-600 text-lg">Professionelle Output auf jedem Schritt</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Wie es funktioniert</h2>

          <div className="grid md:grid-cols-5 gap-4 md:gap-2">
            {[
              { num: '1', title: 'Idee eingeben', emoji: '💭' },
              { num: '2', title: 'Mit AI expandieren', emoji: '🤖' },
              { num: '3', title: 'PRD generieren', emoji: '📋' },
              { num: '4', title: 'Prototyp erzeugen', emoji: '💻' },
              { num: '5', title: 'Exportieren', emoji: '📦' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full flex items-center justify-center font-bold mb-3">
                  {step.num}
                </div>
                <div className="text-3xl mb-2">{step.emoji}</div>
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Für wen ist das?</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {PERSONAS.map((persona, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border-l-4 border-[#667eea]">
                <div className="text-4xl mb-3">{persona.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{persona.title}</h3>
                <p className="text-gray-600 text-sm">{persona.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Häufige Fragen</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Brauche ich Programmier-Kenntnisse?',
                a: 'Nein! Prototype Generator ist vollständig benutzerfreundlich. Der AI generiert und erklärt den Code.',
              },
              {
                q: 'Wie gut sind die generierten Prototypen?',
                a: '95% produktionsreif: Debugged, Responsive, Accessible, Performance-optimiert. Perfekt für Demos und MVPs.',
              },
              {
                q: 'Kann ich den Code weiterbearbeiten?',
                a: 'Ja! Exportiere als ZIP oder HTML und nutze deinen Code-Editor. Der Code ist gut kommentiert.',
              },
              {
                q: 'Wie lange dauert der Prozess?',
                a: 'Durchschnittlich 20-30 Minuten von Idee bis exportierter Prototyp.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#667eea]">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 Prototype Generator. Made with ❤️ by Ai Storm Create.</p>
        </div>
      </footer>
    </div>
  );
}
