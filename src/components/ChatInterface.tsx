
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2, Code, Copy } from "lucide-react";
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
      content: 'Ciao! Sono Lovable, il tuo assistente AI per creare applicazioni web. Dimmi cosa vuoi costruire e ti aiuterò a generare il codice React in tempo reale!',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        content: `Mi dispiace, si è verificato un errore: ${error.message}. Assicurati che la tua API key OpenAI sia configurata correttamente.`,
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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">AI Provider</label>
            <Select value={selectedAI} onValueChange={setSelectedAI}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
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
                <SelectItem value="gpt-4o-mini">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4o">GPT-4</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600">
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
                
                {message.codeBlock && (
                  <div className="mt-3 p-3 bg-gray-100 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span className="text-xs font-medium">Codice Generato</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode(message.codeBlock!)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto bg-white p-2 rounded border">
                      <code>{message.codeBlock}</code>
                    </pre>
                  </div>
                )}
                
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.provider && (
                    <span className="ml-2">• {message.provider}</span>
                  )}
                </p>
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
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600">
                <AvatarFallback>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border shadow-sm p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Generando codice...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        {!user && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Accedi per utilizzare l'AI e salvare i tuoi progetti
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={user 
              ? "Descrivi cosa vuoi creare... (es: 'crea un componente login')" 
              : "Accedi per utilizzare l'AI..."
            }
            className="flex-1"
            disabled={isLoading || !user}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading || !user}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
