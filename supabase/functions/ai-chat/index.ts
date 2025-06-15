
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, provider = 'openai', model = 'gpt-4o-mini', stream = false } = await req.json();

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
      throw new Error(data.error?.message || 'API request failed');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
