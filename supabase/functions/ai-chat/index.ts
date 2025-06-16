import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, provider = 'gemini', model = 'gemini-1.5-flash', stream = false, apiKeys = {} } = await req.json();

    console.log('Received request:', { provider, model, hasApiKeys: !!apiKeys });
    console.log('API Keys received:', { 
      hasGemini: !!apiKeys.geminiKey, 
      hasOpenAI: !!apiKeys.openaiKey, 
      hasClaude: !!apiKeys.claudeKey 
    });

    // Get API keys from request body (passed from frontend) or environment variables
    const geminiApiKey = apiKeys.geminiKey || Deno.env.get('GEMINI_API_KEY');
    const openAIApiKey = apiKeys.openaiKey || Deno.env.get('OPENAI_API_KEY');
    const claudeApiKey = apiKeys.claudeKey || Deno.env.get('CLAUDE_API_KEY');

    const systemMessage = {
      role: 'system',
      content: `You are Lovable, an AI editor that creates and modifies web applications. You assist users by chatting with them and generating React components and code in real-time. You understand that users can see a live preview of their application. 

Your responses should:
1. Be conversational and helpful
2. Generate practical React components with TypeScript
3. Use Tailwind CSS for styling
4. Include proper imports and exports
5. Be production-ready code
6. Focus on modern React patterns with hooks
7. Respond in Italian when the user writes in Italian

When generating components, make them:
- Responsive and accessible
- Well-styled with Tailwind
- Functional and interactive
- Properly typed with TypeScript`
    };

    // Handle different AI providers
    if (provider === 'gemini') {
      console.log('Processing Gemini request, API key available:', !!geminiApiKey);
      
      if (!geminiApiKey) {
        console.error('Gemini API key not found');
        return new Response(
          JSON.stringify({ 
            error: 'API key Gemini non configurata. Ottieni la tua API key gratuita su https://makersuite.google.com/app/apikey e configurala nelle impostazioni.' 
          }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Convert messages to Gemini format
      const geminiMessages = [systemMessage, ...messages];
      
      // Combine all messages into a single prompt for Gemini
      const prompt = geminiMessages.map(msg => {
        if (msg.role === 'system') return `Sistema: ${msg.content}`;
        if (msg.role === 'user') return `Utente: ${msg.content}`;
        if (msg.role === 'assistant') return `Assistente: ${msg.content}`;
        return msg.content;
      }).join('\n\n');

      console.log('Making request to Gemini API...');

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      });

      console.log('Gemini API response status:', response.status);

      const data = await response.json();
      console.log('Gemini API response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.error('Gemini API Error:', data);
        let errorMessage = 'Errore nella comunicazione con Gemini';
        
        if (data.error?.message) {
          if (data.error.message.includes('API_KEY_INVALID')) {
            errorMessage = 'API key Gemini non valida. Verifica che sia corretta nelle impostazioni.';
          } else if (data.error.message.includes('QUOTA_EXCEEDED')) {
            errorMessage = 'Quota Gemini superata. Riprova più tardi o verifica i limiti del tuo account.';
          } else {
            errorMessage = `Errore Gemini: ${data.error.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Convert Gemini response to OpenAI format for compatibility
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      console.log('Generated content length:', content.length);
      
      const geminiResponse = {
        choices: [{
          message: {
            content: content
          }
        }]
      };

      return new Response(JSON.stringify(geminiResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (provider === 'openai') {
      if (!openAIApiKey) {
        return new Response(
          JSON.stringify({ error: 'API key OpenAI non configurata. Configurala nelle impostazioni.' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...messages],
          stream,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (stream) {
        return new Response(response.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API request failed');
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (provider === 'claude') {
      if (!claudeApiKey) {
        return new Response(
          JSON.stringify({ error: 'API key Claude non configurata. Configurala nelle impostazioni.' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Claude API implementation would go here
      return new Response(
        JSON.stringify({ error: 'Integrazione Claude in arrivo' }), 
        { 
          status: 501, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Provider AI non supportato' }), 
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});