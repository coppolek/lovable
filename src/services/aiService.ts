import { supabase } from '@/integrations/supabase/client';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
}

export class AIService {
  static async sendMessage(
    messages: Message[], 
    provider: string = 'gemini', 
    model: string = 'gemini-1.5-flash'
  ): Promise<AIResponse> {
    // Get API keys from localStorage
    const settings = localStorage.getItem('lovable-clone-settings');
    let apiKeys = {};
    
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        apiKeys = {
          geminiKey: parsed.geminiKey,
          openaiKey: parsed.openaiKey,
          claudeKey: parsed.claudeKey
        };
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }

    // Check if the required API key is available
    if (provider === 'gemini' && !apiKeys.geminiKey) {
      throw new Error('API key Gemini non configurata. Vai nelle Impostazioni e clicca su "Ottieni API Key Gratuita" per configurare Gemini Flash.');
    }
    if (provider === 'openai' && !apiKeys.openaiKey) {
      throw new Error('API key OpenAI non configurata. Vai nelle Impostazioni per configurarla.');
    }
    if (provider === 'claude' && !apiKeys.claudeKey) {
      throw new Error('API key Claude non configurata. Vai nelle Impostazioni per configurarla.');
    }

    console.log('Sending request with provider:', provider, 'model:', model);

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages,
        provider,
        model,
        stream: false,
        apiKeys, // Pass API keys to the edge function
      },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Errore nella comunicazione: ${error.message}`);
    }

    if (data.error) {
      console.error('AI service error:', data.error);
      throw new Error(data.error);
    }

    return {
      content: data.choices[0].message.content,
      provider,
      model,
    };
  }

  static async sendStreamMessage(
    messages: Message[], 
    provider: string = 'gemini', 
    model: string = 'gemini-1.5-flash',
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // Get API keys from localStorage
    const settings = localStorage.getItem('lovable-clone-settings');
    let apiKeys = {};
    
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        apiKeys = {
          geminiKey: parsed.geminiKey,
          openaiKey: parsed.openaiKey,
          claudeKey: parsed.claudeKey
        };
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages,
        provider,
        model,
        stream: true,
        apiKeys, // Pass API keys to the edge function
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Handle streaming response
    const reader = data?.getReader();
    if (!reader) {
      throw new Error('No reader available for streaming');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }

  static extractCodeFromResponse(content: string): string | null {
    console.log('Extracting code from response:', content.substring(0, 200) + '...');
    
    // Try multiple patterns to extract code
    const patterns = [
      // Standard code blocks with language
      /```(?:typescript|tsx|jsx|javascript|ts|js|react)\n([\s\S]*?)```/gi,
      // Code blocks without language
      /```\n([\s\S]*?)```/gi,
      // Code blocks with just language
      /```(?:typescript|tsx|jsx|javascript|ts|js|react)([\s\S]*?)```/gi,
    ];

    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        // Get the largest code block (most likely to be the main component)
        let longestMatch = '';
        matches.forEach(match => {
          const code = match.replace(/```(?:typescript|tsx|jsx|javascript|ts|js|react)?\n?/gi, '').replace(/```$/g, '').trim();
          if (code.length > longestMatch.length) {
            longestMatch = code;
          }
        });
        
        if (longestMatch) {
          console.log('Extracted code:', longestMatch.substring(0, 200) + '...');
          return longestMatch;
        }
      }
    }

    // If no code blocks found, try to detect React component patterns
    const reactPatterns = [
      // Look for component definitions
      /(?:const|function|export\s+(?:default\s+)?(?:const|function))\s+\w+\s*[=:]?\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*{|{)/gi,
      // Look for JSX return statements
      /return\s*\(\s*<[\s\S]*?>\s*[\s\S]*?<\/[\s\S]*?>\s*\)/gi,
    ];

    for (const pattern of reactPatterns) {
      if (pattern.test(content)) {
        // If we detect React patterns, return the whole content as it might be a component
        console.log('Detected React patterns, using full content as code');
        return content.trim();
      }
    }

    console.log('No code extracted from response');
    return null;
  }

  static generateSampleComponent(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('button')) {
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

    if (lowerPrompt.includes('card') || lowerPrompt.includes('prodotto')) {
      return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductCard = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-80 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            Amazing Product
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">New</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;`;
    }

    if (lowerPrompt.includes('form') || lowerPrompt.includes('contatto')) {
      return `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactForm = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Contact Us
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We'd love to hear from you. Send us a message!
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input 
                type="text" 
                placeholder="Your name"
                className="transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input 
                type="email" 
                placeholder="your@email.com"
                className="transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea 
                placeholder="Your message..."
                rows={4}
                className="transition-all duration-200"
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
    
    // Default component for other requests
    return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeneratedComponent = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Card className="w-96 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            ✨ AI Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Component generated from: "${prompt}"
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
  }
}