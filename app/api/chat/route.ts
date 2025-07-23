import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { assistantSystemPrompt, assistantTools } from "@/lib/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Function to call our internal API routes
async function callApi(endpoint: string, args: any) {
  try {
    const response = await fetch(`${baseUrl}/api/properties/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      const errorBody = await response.json();
      return JSON.stringify(errorBody);
    }
    return await response.json();
  } catch (error) {
    return JSON.stringify({ error: `Failed to call API: ${endpoint}` });
  }
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Fetch config from KV, with a fallback to local config
  const configKey = 'realestate:config:v1';
  let config = await kv.get<any>(configKey);
  if (config) config = JSON.parse(config);

  const systemPrompt = config?.assistantSystemPrompt || assistantSystemPrompt;
  const tools = config?.tools || assistantTools;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemPrompt, ...messages],
    tools: tools,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  if (!responseMessage.tool_calls) {
    return NextResponse.json(responseMessage);
  }

  // --- Handle Tool Calls ---
  const toolMessages = [];

  for (const tool_call of responseMessage.tool_calls) {
    const functionName = tool_call.function.name;
    const functionArgs = JSON.parse(tool_call.function.arguments);
    let functionResponse;

    console.log(`Assistant> Calling function: ${functionName} with args:`, functionArgs);

    if (functionName === 'get_current_predicted_price') {
      functionResponse = await callApi('predicted-price', functionArgs);
    } else if (functionName === 'search_properties') {
      functionResponse = await callApi('search', functionArgs);
    } else if (functionName === 'create_price_forecast_chart') {
      functionResponse = await callApi('forecast-chart', functionArgs);
    } else {
      functionResponse = { error: `Unknown function: ${functionName}` };
    }

    toolMessages.push({
      tool_call_id: tool_call.id,
      role: "tool",
      name: functionName,
      content: JSON.stringify(functionResponse),
    });
  }

  // --- Get Final Response from OpenAI ---
  const finalResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemPrompt, ...messages, responseMessage, ...toolMessages],
  });

  return NextResponse.json(finalResponse.choices[0].message);
}
