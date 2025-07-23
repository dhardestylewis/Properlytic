import { kv } from '@vercel/kv';
import { NEIGHBORHOOD_TO_CD_MAP, assistantSystemPrompt, assistantTools } from '../lib/config';

async function uploadConfig() {
  console.log('Uploading configuration to Vercel KV...');
  
  const configKey = 'realestate:config:v1';

  const configData = {
    neighborhoodToCdMap: NEIGHBORHOOD_TO_CD_MAP,
    assistantSystemPrompt: assistantSystemPrompt,
    tools: assistantTools,
  };

  await kv.set(configKey, JSON.stringify(configData));

  console.log('✅ Configuration uploaded successfully!');
}

uploadConfig();
