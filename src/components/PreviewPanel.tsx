import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Maximize2, Smartphone, Tablet, Monitor, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";

interface PreviewPanelProps {
  code: string;
}

const PreviewPanel = ({ code }: PreviewPanelProps) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const viewportStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[667px] mx-auto'
  };

  // Create a component from the code string
  const createPreviewComponent = useMemo(() => {
    try {
      console.log('Creating preview component from code:', code.substring(0, 200) + '...');
      
      if (!code || code.trim() === '') {
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Benvenuto in Lovable Clone
              </h2>
              <p className="text-gray-600 mb-4">
                Inizia una conversazione per generare componenti React in tempo reale
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>🤖</span>
                <span>AI-Powered</span>
                <span>•</span>
                <span>Real-time Preview</span>
                <span>•</span>
                <span>Multiple AI APIs</span>
              </div>
            </div>
          </div>
        );
      }

      // Check for specific component patterns and render accordingly
      if (code.includes('CustomButton') || code.includes('Button')) {
        return (
          <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
              Beautiful Button
            </button>
          </div>
        );
      }

      if (code.includes('ProductCard') || code.includes('Card')) {
        return (
          <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-80 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-lg">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">Amazing Product</h3>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">New</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  A beautiful product card with gradient background and smooth animations
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.9)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">€99.99</span>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (code.includes('ContactForm') || code.includes('form')) {
        return (
          <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <div className="w-full max-w-md shadow-xl bg-white rounded-lg">
              <div className="p-6 text-center border-b">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Contact Us
                </h2>
                <p className="text-gray-600 mt-2">
                  We'd love to hear from you. Send us a message!
                </p>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      placeholder="Your message..."
                      rows={4}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      }

      if (code.includes('Dashboard') || code.includes('dashboard')) {
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { title: "Utenti Totali", value: "12,345", change: "+12%" },
                  { title: "Vendite", value: "€45,678", change: "+8%" },
                  { title: "Ordini", value: "1,234", change: "+15%" },
                  { title: "Conversioni", value: "23.4%", change: "+3%" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-green-600 mt-1">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Grafico Vendite</h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Grafico Vendite</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Attività Recenti</h3>
                  <div className="space-y-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Attività {i} completata</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (code.includes('LandingPage') || code.includes('landing')) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Hero Section */}
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Benvenuto nel Futuro
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Crea applicazioni straordinarie con la potenza dell'AI e il design moderno
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg">
                    Inizia Ora
                  </button>
                  <button className="border border-gray-300 px-8 py-3 rounded-lg">
                    Scopri di Più
                  </button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Funzionalità Principali</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white font-bold">{i}</span>
                      </div>
                      <h3 className="font-semibold mb-2">Feature {i}</h3>
                      <p className="text-gray-600">Descrizione della funzionalità avanzata</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      }

      // Try to render a generic component based on the code content
      if (code.includes('export default') || code.includes('const ') || code.includes('function ')) {
        return (
          <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <div className="w-96 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                  ✨ AI Generated Component
                </h2>
              </div>
              <div className="p-6 text-center space-y-4">
                <p className="text-gray-600">
                  Componente generato dall'AI
                </p>
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">
                    ✨ Powered by AI
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  <code>{code.substring(0, 100)}...</code>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Default fallback
      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Componente Generato
            </h2>
            <p className="text-gray-600 mb-4">
              Il tuo componente è stato generato dall'AI
            </p>
            <div className="text-xs text-gray-500 bg-white p-3 rounded border max-w-md">
              <code className="break-all">{code.substring(0, 150)}...</code>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error creating preview component:', error);
      return (
        <div className="flex items-center justify-center h-full bg-red-50">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Errore nel Preview</h3>
            <p className="text-red-600 text-sm mb-4">
              Si è verificato un errore durante il rendering del componente
            </p>
            <div className="text-xs text-gray-600 bg-white p-3 rounded border max-w-md">
              <code className="break-all">{code.substring(0, 100)}...</code>
            </div>
          </div>
        </div>
      );
    }
  }, [code]);

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Live Preview</h3>
          <Badge variant="secondary" className="text-xs">
            React
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md p-1">
            <Button
              variant={viewport === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('desktop')}
              className="h-8 w-8 p-0"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('tablet')}
              className="h-8 w-8 p-0"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewport === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('mobile')}
              className="h-8 w-8 p-0"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className={`${viewportStyles[viewport]} border bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300`}>
          {createPreviewComponent}
        </div>
      </div>

      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </div>
          <span>•</span>
          <span>Viewport: {viewport}</span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default PreviewPanel;