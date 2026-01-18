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
        const { prompt } = await req.json();
        const API_KEY = Deno.env.get('GEMINI_API_KEY');

        if (!API_KEY) {
            throw new Error('Gemini API Key not configured');
        }

        // Use 'Nano Banana Pro' aka Gemini 2.0 Flash Exp for native image generation
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

        if (!response.ok) {
            console.error('Gemini Image API Error:', JSON.stringify(data));
            // Fallback message if model is overloaded
            if (response.status === 429 || response.status === 503) {
                throw new Error('Image generation service is busy. Please try again.');
            }
            throw new Error(data.error?.message || 'Gemini Image API Error');
        }

        // Extract image from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        let imageData = null;

        for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                imageData = part.inlineData;
                break;
            }
        }

        if (imageData) {
            return new Response(JSON.stringify({
                success: true,
                image_url: `data:${imageData.mimeType};base64,${imageData.data}`,
                message: 'Image generated successfully'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('No image data found in response');
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
