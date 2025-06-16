import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2, Code, Copy, Sparkles, Wand2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AIService, Message } from "@/services/aiService";
import { toast } from "sonner";

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  provider?: string;
  codeBlock?: string;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string) => void;
}

const ChatInterface = ({ onCodeGenerated }: ChatInterfaceProps) => {
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
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestedPrompts] = useState([
    "Crea un componente login con form validation",
    "Genera una dashboard con grafici",
    "Fai un componente e-commerce con carrello",
    "Crea una landing page moderna",
    "Costruisci un sistema di chat realtime"
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setInputValue('');

    try {
      const conversationMessages: Message[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      conversationMessages.push({ role: 'user', content: inputValue });

      const response = await AIService.sendMessage(
        conversationMessages, 
        selectedAI, 
        selectedModel
      );

      const extractedCode = AIService.extractCodeFromResponse(response.content);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        provider: response.provider,
        codeBlock: extractedCode || undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (extractedCode) {
        onCodeGenerated(extractedCode);
        toast.success("Codice generato e aggiornato nel preview!");
      } else {
        // Generate fallback component based on user input
        const fallbackCode = AIService.generateSampleComponent(inputValue);
        onCodeGenerated(fallbackCode);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Mi dispiace, si è verificato un errore: ${error.message}. Assicurati che la tua API key Gemini sia configurata correttamente nelle impostazioni.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Errore nella comunicazione con l'AI");
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
          </div>

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
                  <span className="text-sm text-gray-500">Generando codice con Gemini Flash...</span>
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
              placeholder={user 
                ? "Descrivi cosa vuoi creare..." 
                : "Accedi per utilizzare l'AI..."
              }
              className="pr-12"
              disabled={isLoading || !user}
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
            disabled={!inputValue.trim() || isLoading || !user}
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
        {user && (
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