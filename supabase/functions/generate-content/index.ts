import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, prompt, title } = await req.json();
    const API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!API_KEY) {
      throw new Error('Gemini API Key not configured');
    }

    let result;

    if (type === 'image') {
      // Image Generation using Gemini 2.0 Flash (Nano Banana Pro)
      // Using the experimental endpoint for native image generation
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

      console.log('Generating image with prompt:', prompt);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE"]
          }
        })
      });

      const data = await response.json();
      console.log('Gemini image response status:', response.status);

      if (!response.ok) {
        console.error('Gemini Image API Error:', JSON.stringify(data));

        // Fallback message if model is overloaded or not found
        if (response.status === 429 || response.status === 503) {
          throw new Error('Image generation service is currently busy. Please try again later.');
        }
        throw new Error(data.error?.message || 'Gemini Image API Error');
      }

      // Extract image from response
      // Gemini 2.0 Flash returns inlineData for images
      const parts = data.candidates?.[0]?.content?.parts || [];
      let imageData = null;

      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          imageData = part.inlineData;
          break;
        }
      }

      if (imageData) {
        result = {
          imageUrl: `data:${imageData.mimeType};base64,${imageData.data}`,
          fallback: false
        };
      } else {
        console.error('No image data found in response:', JSON.stringify(data));
        throw new Error('No image data in response');
      }
    }

    if (type === 'text') {
      // Text Generation using Gemini Pro
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

      const systemPrompt = `
        You are "The Grounded Mentor", a Human Design expert.
        Write a blog article in Indonesian about: "${title || prompt}".
        Style: Warm, professional, validating, practical.
        Format: Return ONLY valid JSON with fields: { "title": "", "excerpt": "", "content": "markdown string" }.
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Gemini API Error');
      }

      // Parse Gemini response
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Clean up markdown code blocks if present
      const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        result = JSON.parse(jsonStr);
      } catch (e) {
        result = { content: rawText, title: title, excerpt: "Generated content" };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Generate content error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
