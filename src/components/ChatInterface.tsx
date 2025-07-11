import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2, Code, Copy, Sparkles, Wand2, RefreshCw, Settings, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AIService, Message } from "@/services/aiService";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  provider?: string;
  codeBlock?: string;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string) => void;
  onOpenSettings?: () => void;
}

const ChatInterface = ({ onCodeGenerated, onOpenSettings }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Ciao! Sono Lovable, il tuo assistente AI per creare applicazioni web. Dimmi cosa vuoi costruire e ti aiuterò a generare il codice React in tempo reale! Ora utilizzo Gemini Flash di Google per prestazioni ottimali e gratuite.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [hasApiKey, setHasApiKey] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestedPrompts] = useState([
    "Crea un componente login con form validation",
    "Genera una dashboard con grafici",
    "Fai un componente e-commerce con carrello",
    "Crea una landing page moderna",
    "Costruisci un sistema di chat realtime"
  ]);

  // Check if API key is configured
  useEffect(() => {
    const checkApiKey = () => {
      const settings = localStorage.getItem('lovable-clone-settings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          const hasGemini = parsed.geminiKey && parsed.geminiKey.startsWith('AI') && parsed.geminiKey.length >= 30;
          const hasOpenAI = parsed.openaiKey && parsed.openaiKey.startsWith('sk-') && parsed.openaiKey.length >= 40;
          const hasClaudeKey = parsed.claudeKey && parsed.claudeKey.length > 0;
          
          if (selectedAI === 'gemini') {
            setHasApiKey(hasGemini);
          } else if (selectedAI === 'openai') {
            setHasApiKey(hasOpenAI);
          } else if (selectedAI === 'claude') {
            setHasApiKey(hasClaudeKey);
          }
        } catch (error) {
          setHasApiKey(false);
        }
      } else {
        setHasApiKey(false);
      }
    };

    checkApiKey();
    // Check again when selectedAI changes
  }, [selectedAI]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openGeminiApiPage = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!user) {
      toast.error('Devi essere autenticato per usare l\'AI');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const conversationMessages: Message[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      conversationMessages.push({ role: 'user', content: currentInput });

      console.log('Sending message to AI:', currentInput);

      const response = await AIService.sendMessage(
        conversationMessages, 
        selectedAI, 
        selectedModel
      );

      console.log('AI Response received:', response.content.substring(0, 200) + '...');

      // Extract code from the response
      const extractedCode = AIService.extractCodeFromResponse(response.content);
      console.log('Extracted code:', extractedCode ? extractedCode.substring(0, 200) + '...' : 'No code found');

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        provider: response.provider,
        codeBlock: extractedCode || undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Always generate code for the preview
      if (extractedCode) {
        console.log('Using extracted code for preview');
        onCodeGenerated(extractedCode);
        toast.success("Codice generato e aggiornato nel preview!");
      } else {
        console.log('No code extracted, generating fallback component');
        // Generate fallback component based on user input
        const fallbackCode = AIService.generateSampleComponent(currentInput);
        onCodeGenerated(fallbackCode);
        toast.success("Componente di esempio generato!");
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Mi dispiace, si è verificato un errore: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Show specific error handling for API key issues
      if (error.message.includes('API key') && error.message.includes('non configurata')) {
        toast.error("Configura la tua API key nelle impostazioni per utilizzare l'AI", {
          action: onOpenSettings ? {
            label: "Apri Impostazioni",
            onClick: onOpenSettings
          } : undefined
        });
      } else {
        toast.error("Errore nella comunicazione con l'AI");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Codice copiato negli appunti!");
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const regenerateLastResponse = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      setInputValue(lastUserMessage.content);
      handleSendMessage();
    }
  };

  const applyCodeToPreview = (code: string) => {
    console.log('Applying code to preview:', code.substring(0, 200) + '...');
    onCodeGenerated(code);
    toast.success("Codice applicato al preview!");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Enhanced Header */}
      <div className="p-4 border-b bg-white">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            <Badge variant="secondary" className="text-xs">
              Powered by Gemini Flash
            </Badge>
            {!hasApiKey && (
              <Badge variant="destructive" className="text-xs">
                API Key Required
              </Badge>
            )}
          </div>

          {/* API Key Configuration Alert */}
          {!hasApiKey && user && (
            <Alert className="border-amber-200 bg-amber-50">
              <Settings className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <span>
                    {selectedAI === 'gemini' 
                      ? 'Configura la tua API key Gemini gratuita per iniziare'
                      : `Configura la tua API key ${selectedAI} per iniziare`
                    }
                  </span>
                  <div className="flex gap-2 ml-4">
                    {selectedAI === 'gemini' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openGeminiApiPage}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Ottieni Gratis
                      </Button>
                    )}
                    {onOpenSettings && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenSettings}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Impostazioni
                      </Button>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">AI Provider</label>
            <Select value={selectedAI} onValueChange={setSelectedAI}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Google Gemini (Gratuito)
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    OpenAI
                  </div>
                </SelectItem>
                <SelectItem value="claude">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Anthropic Claude
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Modello</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedAI === 'gemini' && (
                  <>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Gratuito)</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  </>
                )}
                {selectedAI === 'openai' && (
                  <>
                    <SelectItem value="gpt-4o-mini">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4</SelectItem>
                  </>
                )}
                {selectedAI === 'claude' && (
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome message with suggested prompts */}
          {messages.length === 1 && (
            <div className="space-y-4">
              {/* API Key Setup Guide for new users */}
              {!hasApiKey && user && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                    <Sparkles className="w-5 h-5" />
                    Inizia in 2 minuti con Gemini Flash (Gratuito)
                  </h4>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium">Ottieni la tua API key gratuita</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openGeminiApiPage}
                          className="mt-2 text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Vai a Google AI Studio
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="font-medium">Configura l'API key nell'app</p>
                        {onOpenSettings && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenSettings}
                            className="mt-2 text-blue-700 border-blue-300 hover:bg-blue-100"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Apri Impostazioni
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="font-medium">Inizia a creare con l'AI!</p>
                        <p className="text-xs text-blue-600 mt-1">Completamente gratuito, nessuna carta di credito richiesta</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasApiKey && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    Suggerimenti per iniziare
                  </h4>
                  <div className="grid gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        className="text-left p-2 rounded border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Enhanced code block */}
                {message.codeBlock && (
                  <div className="mt-3 p-3 bg-gray-100 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span className="text-xs font-medium">Codice Generato</span>
                        <Badge variant="outline" className="text-xs">
                          React/TypeScript
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(message.codeBlock!)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => applyCodeToPreview(message.codeBlock!)}
                          className="h-6 w-6 p-0"
                          title="Applica al preview"
                        >
                          <Wand2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={regenerateLastResponse}
                          className="h-6 w-6 p-0"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <pre className="text-xs overflow-x-auto bg-white p-2 rounded border max-h-48">
                      <code>{message.codeBlock}</code>
                    </pre>
                  </div>
                )}
                
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  <span>
                    {message.timestamp.toLocaleTimeString()}
                    {message.provider && (
                      <span className="ml-2">• {message.provider}</span>
                    )}
                  </span>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={regenerateLastResponse}
                        className="h-5 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Rigenera
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600">
                  <AvatarFallback>
                    <User className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading state */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <AvatarFallback>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border shadow-sm p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Generando codice con {selectedAI}...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Enhanced input area */}
      <div className="p-4 border-t bg-white">
        {!user && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                Accedi per utilizzare Gemini Flash e salvare i tuoi progetti
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !user 
                  ? "Accedi per utilizzare l'AI..." 
                  : !hasApiKey 
                    ? "Configura prima la tua API key nelle impostazioni..."
                    : "Descrivi cosa vuoi creare..."
              }
              className="pr-12"
              disabled={isLoading || !user || !hasApiKey}
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading || !user || !hasApiKey}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick actions */}
        {user && hasApiKey && (
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              💡 Suggerisci miglioramenti
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              🐛 Correggi errori
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              🎨 Migliora design
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;