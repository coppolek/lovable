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
    const requestBody = await req.json();
    const { messages, provider = 'gemini', model = 'gemini-1.5-flash', stream = false, apiKeys = {} } = requestBody;

    console.log('=== AI Chat Function Debug ===');
    console.log('Received request:', { provider, model, stream });
    console.log('API Keys received:', { 
      hasGemini: !!apiKeys.geminiKey, 
      hasOpenAI: !!apiKeys.openaiKey, 
      hasClaude: !!apiKeys.claudeKey,
      geminiKeyLength: apiKeys.geminiKey ? apiKeys.geminiKey.length : 0
    });
    console.log('Messages count:', messages?.length);

    // Get API keys from request body (passed from frontend) or environment variables
    const geminiApiKey = apiKeys.geminiKey || Deno.env.get('GEMINI_API_KEY');
    const openAIApiKey = apiKeys.openaiKey || Deno.env.get('OPENAI_API_KEY');
    const claudeApiKey = apiKeys.claudeKey || Deno.env.get('CLAUDE_API_KEY');

    console.log('Final API keys:', {
      hasGemini: !!geminiApiKey,
      hasOpenAI: !!openAIApiKey,
      hasClaude: !!claudeApiKey,
      geminiKeyPreview: geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'none',
      openaiKeyPreview: openAIApiKey ? `${openAIApiKey.substring(0, 10)}...` : 'none'
    });

    // Validate API key format based on provider
    if (provider === 'gemini') {
      if (!geminiApiKey) {
        console.error('Gemini API key not found');
        return new Response(
          JSON.stringify({ 
            error: 'API key Gemini non configurata. Vai nelle Impostazioni e clicca su "Ottieni API Key Gratuita" per configurare Gemini Flash. Assicurati di copiare correttamente la chiave da https://makersuite.google.com/app/apikey' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!geminiApiKey.startsWith('AI') || geminiApiKey.length < 30) {
        console.error('Invalid Gemini API key format:', geminiApiKey.substring(0, 10));
        return new Response(
          JSON.stringify({ 
            error: 'Formato API key Gemini non valido. La chiave deve iniziare con "AI" e essere lunga almeno 30 caratteri. Verifica di aver copiato correttamente la chiave da Google AI Studio.' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else if (provider === 'openai') {
      if (!openAIApiKey) {
        console.error('OpenAI API key not found');
        return new Response(
          JSON.stringify({ 
            error: 'API key OpenAI non configurata. Vai nelle Impostazioni per configurare la tua API key OpenAI.' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!openAIApiKey.startsWith('sk-') || openAIApiKey.length < 40) {
        console.error('Invalid OpenAI API key format:', openAIApiKey.substring(0, 10));
        return new Response(
          JSON.stringify({ 
            error: 'Formato API key OpenAI non valido. La chiave deve iniziare con "sk-" e essere lunga almeno 40 caratteri. Verifica di aver copiato correttamente la chiave da OpenAI.' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else if (provider === 'claude') {
      if (!claudeApiKey) {
        console.error('Claude API key not found');
        return new Response(
          JSON.stringify({ 
            error: 'API key Claude non configurata. Vai nelle Impostazioni per configurare la tua API key Claude.' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

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
      console.log('Processing Gemini request...');

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
      console.log('Prompt length:', prompt.length);

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      
      const geminiRequestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('Gemini request URL:', geminiUrl.replace(geminiApiKey, 'API_KEY_HIDDEN'));

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequestBody),
      });

      console.log('Gemini API response status:', response.status);
      console.log('Gemini API response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Gemini API response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.error('Gemini API Error:', data);
        let errorMessage = 'Errore nella comunicazione con Gemini';
        
        if (data.error?.message) {
          const errorMsg = data.error.message.toLowerCase();
          
          if (errorMsg.includes('api_key_invalid') || errorMsg.includes('invalid api key') || errorMsg.includes('api key not valid')) {
            errorMessage = 'API key Gemini non valida. Verifica che sia corretta nelle impostazioni. Vai su https://makersuite.google.com/app/apikey per ottenerne una nuova e assicurati di copiarla completamente.';
          } else if (errorMsg.includes('quota_exceeded') || errorMsg.includes('quota exceeded')) {
            errorMessage = 'Quota Gemini superata. Hai raggiunto il limite gratuito. Riprova più tardi o verifica i limiti del tuo account su Google AI Studio.';
          } else if (errorMsg.includes('permission_denied') || errorMsg.includes('permission denied')) {
            errorMessage = 'Permesso negato. Verifica che la tua API key Gemini abbia i permessi corretti e che il servizio Generative AI sia abilitato nel tuo progetto Google Cloud.';
          } else if (errorMsg.includes('model not found') || errorMsg.includes('model_not_found')) {
            errorMessage = `Modello ${model} non trovato. Prova con "gemini-1.5-flash" o "gemini-1.5-pro".`;
          } else if (errorMsg.includes('blocked') || errorMsg.includes('safety')) {
            errorMessage = 'Richiesta bloccata dai filtri di sicurezza di Gemini. Prova a riformulare la tua richiesta.';
          } else {
            errorMessage = `Errore Gemini: ${data.error.message}`;
          }
        } else if (response.status === 403) {
          errorMessage = 'Accesso negato. Verifica che la tua API key Gemini sia valida e abbia i permessi necessari.';
        } else if (response.status === 429) {
          errorMessage = 'Troppe richieste. Hai superato il limite di rate di Gemini. Riprova tra qualche secondo.';
        } else if (response.status === 400) {
          errorMessage = 'Richiesta non valida. Verifica la configurazione della tua API key Gemini.';
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }), 
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if response has content
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('No content in Gemini response:', data);
        
        let errorMessage = 'Gemini non ha generato una risposta';
        
        if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
          const finishReason = data.candidates[0].finishReason;
          if (finishReason === 'SAFETY') {
            errorMessage = 'Risposta bloccata dai filtri di sicurezza di Gemini. Prova a riformulare la tua richiesta in modo più specifico.';
          } else if (finishReason === 'MAX_TOKENS') {
            errorMessage = 'Risposta troppo lunga. Prova a fare una richiesta più specifica.';
          } else {
            errorMessage = `Gemini ha terminato la generazione: ${finishReason}`;
          }
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Convert Gemini response to OpenAI format for compatibility
      const content = data.candidates[0].content.parts[0].text || 'No response generated';
      
      console.log('Generated content length:', content.length);
      console.log('Generated content preview:', content.substring(0, 200) + '...');
      
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
      console.log('Processing OpenAI request...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4',
          messages: [systemMessage, ...messages],
          stream,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      console.log('OpenAI API response status:', response.status);

      if (stream) {
        return new Response(response.body, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      }

      const data = await response.json();
      console.log('OpenAI API response:', data);
      
      if (!response.ok) {
        console.error('OpenAI API Error:', data);
        let errorMessage = 'Errore nella comunicazione con OpenAI';
        
        if (data.error?.message) {
          const errorMsg = data.error.message.toLowerCase();
          
          if (errorMsg.includes('incorrect api key') || errorMsg.includes('invalid api key')) {
            errorMessage = 'API key OpenAI non valida. Verifica che sia corretta nelle impostazioni e che inizi con "sk-".';
          } else if (errorMsg.includes('quota') || errorMsg.includes('billing')) {
            errorMessage = 'Quota OpenAI superata o problema di fatturazione. Verifica il tuo account OpenAI.';
          } else {
            errorMessage = `Errore OpenAI: ${data.error.message}`;
          }
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }), 
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (provider === 'claude') {
      console.log('Processing Claude request...');
      
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
    console.error('=== Error in ai-chat function ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    let errorMessage = `Errore interno del server: ${error.message}`;
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Errore di connessione. Verifica la tua connessione internet e riprova.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Errore nel formato della risposta. Riprova tra qualche secondo.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: `${errorMessage} Verifica la configurazione delle API keys nelle impostazioni.` 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});