export const NEIGHBORHOOD_TO_CD_MAP = {
    "financial district": ["1"], "fidi": ["1"], "tribeca": ["1"], "soho": ["2"],
    "greenwich village": ["2"], "west village": ["2"], "lower east side": ["3"],
    "les": ["3"], "east village": ["3"], "chinatown": ["3"], "chelsea": ["4", "5"],
    "hell's kitchen": ["4"], "midtown": ["5"], "midtown south": ["5"],
    "gramercy park": ["6"], "stuyvesant town": ["6"], "murray hill": ["6"],
    "turtle bay": ["6"], "upper west side": ["7"], "uws": ["7"],
    "upper east side": ["8"], "ues": ["8"], "central harlem": ["10"],
    "east harlem": ["11"], "harlem": ["9", "10", "11"], "morningside heights": ["9"],
    "washington heights": ["12"], "inwood": ["12"]
};

export const assistantSystemPrompt = {
    role: "system",
    content: `
You are the Manhattan Home-Price Assistant: a warm, conversational expert in NYC residential real-estate.
- Your primary job is to help users by calling the functions you have available.
- When presenting prices, be very clear about the difference between a historical 'sale price' and a 'current predicted value'.
- If a user asks for 'homes' or 'townhomes', use the building_classes filter with appropriate residential codes (e.g., 'A', 'B' classes). For a general query like 'properties', do not apply a property type filter.
- **Crucially, treat each new user query as independent. Do not apply filters from a previous turn unless the user explicitly asks you to.**
`
};

export const assistantTools = [
    {"type": "function", "function": {"name": "get_current_predicted_price", "description": "Gets the most recent predicted value for a single, valid Manhattan property address.", "parameters": {"type": "object", "properties": {"address": {"type": "string", "description": "The full Manhattan property address, e.g., '291 GRAND STREET'."}}, "required": ["address"]}}},
    {"type": "function", "function": {"name": "search_properties", "description": "Searches, filters, and sorts property listings. Use this as the main tool for finding properties.", "parameters": {"type": "object", "properties": {"neighborhood": {"type": "string", "description": "The common Manhattan neighborhood name to search in."}, "building_classes": {"type": "array", "items": {"type": "string"}, "description": "A list of specific building classes to search for, e.g., ['A1', 'A5'] for single-family homes."}, "min_price": {"type": "integer", "description": "The minimum predicted value."}, "max_price": {"type": "integer", "description": "The maximum predicted value."}, "sort_by": {"type": "string", "description": "Metric to sort by. Defaults to 'predicted_sale_price'.", "enum": ["predicted_sale_price", "sale_price", "yearbuilt", "floorarea"]}, "sort_order": {"type": "string", "description": "Sort order. Defaults to 'descending'.", "enum": ["ascending", "descending"]}, "limit": {"type": "integer", "description": "The maximum number of listings to return."}}, "required": []}}},
    {"type": "function", "function": {"name": "create_price_forecast_chart", "description": "Generates the data needed to display a fan chart showing the historical price trend and a future forecast for a single property address.", "parameters": {"type": "object", "properties": {"address": {"type": "string", "description": "The full property address to generate a forecast for."}}, "required": ["address"]}}}
];
