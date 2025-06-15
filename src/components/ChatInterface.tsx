
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiProvider?: string;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string) => void;
}

const ChatInterface = ({ onCodeGenerated }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Ciao! Sono il tuo assistente AI. Puoi chiedermi di creare o modificare componenti React, e vedrái i risultati in tempo reale nel preview.',
      timestamp: new Date(),
      aiProvider: 'system'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('openai');
  const [apiKey, setApiKey] = useState('');

  const generateSampleCode = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('button') || lowerPrompt.includes('bottone')) {
      return `import { Button } from "@/components/ui/button";

const CustomButton = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Button 
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        onClick={() => alert('Button clicked!')}
      >
        Beautiful Button
      </Button>
    </div>
  );
};

export default CustomButton;`;
    }
    
    if (lowerPrompt.includes('card') || lowerPrompt.includes('scheda')) {
      return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const ProductCard = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-80 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">Amazing Product</CardTitle>
            <Badge variant="secondary">New</Badge>
          </div>
          <CardDescription>
            A beautiful product card with gradient background and smooth animations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.9)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-purple-600">$99.99</span>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
              Add to Cart
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;`;
    }
    
    if (lowerPrompt.includes('form') || lowerPrompt.includes('modulo')) {
      return `import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, User, MessageSquare } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted! ' + JSON.stringify(formData));
  };

  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Contact Us
          </CardTitle>
          <CardDescription>
            We'd love to hear from you. Send us a message!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Your name"
                className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Your message..."
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            >
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;`;
    }

    // Default component
    return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const GeneratedComponent = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Card className="w-96 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            This component was generated based on your request: "{prompt}"
          </p>
          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <p className="text-sm font-medium text-purple-800">
              ✨ Powered by AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedComponent;`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Ho generato un componente basato sulla tua richiesta: "${inputValue}". Il codice è stato aggiornato nel preview!`,
        timestamp: new Date(),
        aiProvider: selectedAI
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Generate and send code to preview
      const generatedCode = generateSampleCode(inputValue);
      onCodeGenerated(generatedCode);
      
      setIsLoading(false);
      toast.success("Componente generato con successo!");
    }, 1500);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">AI Provider</label>
            <Select value={selectedAI} onValueChange={setSelectedAI}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona AI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="local">Local AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">API Key (optional)</label>
            <Input
              type="password"
              placeholder="Inserisci la tua API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.aiProvider && message.aiProvider !== 'system' && (
                    <span className="ml-2">• {message.aiProvider}</span>
                  )}
                </p>
              </div>
              {message.type === 'user' && (
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
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Descrivi cosa vuoi creare... (es: 'crea un button', 'fai una card')"
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
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
