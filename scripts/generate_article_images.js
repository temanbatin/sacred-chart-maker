/**
 * SCRIPT: generate_article_images.js
 * 
 * This script is designed to automate the generation of illustrations for the 100-article content plan
 * using Google's Gemini Pro / Imagen 3 model (often accessed via Google Cloud Vertex AI).
 * 
 * PREREQUISITES:
 * 1. Google Cloud Project with Vertex AI API enabled.
 * 2. Service Account Key (JSON).
 * 3. Node.js environment.
 * 
 * INSTALLATION:
 * npm install @google-cloud/aiplatform
 * 
 * USAGE:
 * node scripts/generate_article_images.js
 */

const { LEARN_ARTICLES } = require('../src/config/learn-content');
const fs = require('fs');
const path = require('path');

// Mock function to simulate AI Image Generation
// Replace this with actual API call to Vertex AI / Imagen
async function generateImage(prompt) {
    console.log(`[AI] Generating image for prompt: "${prompt}"...`);
    
    // In a real scenario, you would call:
    // const response = await predictionServiceClient.predict({ endpoint, instances, parameters });
    // return response.predictions[0].bytesBase64Encoded;
    
    // For now, return a placeholder based on keywords
    if (prompt.includes('spirit')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
    if (prompt.includes('business')) return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f';
    if (prompt.includes('love')) return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7';
    
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'; // Default space/abstract
}

async function main() {
    console.log('--- Starting Batch Image Generation (Gemini/Imagen) ---');
    
    const updatedArticles = [];

    for (const article of LEARN_ARTICLES) {
        if (article.imageUrl && !article.imageUrl.includes('unsplash')) {
            console.log(`[SKIP] Article "${article.title}" already has a custom image.`);
            updatedArticles.push(article);
            continue;
        }

        // define prompt based on title/category
        const prompt = article.imagePrompt || 
            `A spiritual, minimalist, high-quality illustration representing "${article.title}". 
             Style: Abstract, soft lighting, grounded, professional. 
             Context: Human Design and Astrology.`;

        try {
            const imageUrl = await generateImage(prompt);
            
            updatedArticles.push({
                ...article,
                imageUrl: imageUrl,
                imagePrompt: prompt
            });
            
            console.log(`[DONE] Generated for: ${article.title}`);
            
            // Artificial delay to respect rate limits
            await new Promise(r => setTimeout(r, 1000));
            
        } catch (error) {
            console.error(`[ERROR] Failed for ${article.title}:`, error);
            updatedArticles.push(article);
        }
    }

    // In a real script, we would write this back to the source file
    // For safety, we output a log file instead
    const logContent = JSON.stringify(updatedArticles, null, 2);
    fs.writeFileSync(path.join(__dirname, 'generated_content_config.json'), logContent);
    
    console.log('--- Generation Complete. Check generated_content_config.json ---');
}

// execute if running directly
// main();
