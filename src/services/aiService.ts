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
      throw new Error(error.message);
    }

    if (data.error) {
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
    // Extract code blocks from AI response
    const codeBlockRegex = /```(?:typescript|tsx|jsx|javascript|ts|js)?\n([\s\S]*?)```/;
    const match = content.match(codeBlockRegex);
    return match ? match[1].trim() : null;
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
    
    // Default component for other requests
    return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GeneratedComponent = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Card className="w-96 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ AI Generated Component
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Component generated from: "${prompt}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedComponent;`;
  }
}