export function safeParseJSON(text: string): unknown {
  // Extract JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }

  let raw = jsonMatch[0];

  // Remove control characters (keep \n and \t)
  raw = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ");

  // Fix common Haiku JSON issues:
  // 1. Trailing commas before } or ]
  raw = raw.replace(/,\s*([}\]])/g, "$1");

  // 2. Single quotes instead of double quotes
  // Only do this if there are no double quotes (to avoid breaking valid JSON)
  if (!raw.includes('"')) {
    raw = raw.replace(/'/g, '"');
  }

  // 3. Unescaped newlines inside strings - replace with space
  raw = raw.replace(/"([^"]*)\n([^"]*)"/g, (match) => {
    return match.replace(/\n/g, " ");
  });

  try {
    return JSON.parse(raw);
  } catch {
    // Last resort: try to fix unescaped quotes inside strings
    // by replacing the content between structural quotes
    const fixedRaw = raw.replace(
      /"([^"]*?)"/g,
      (_, content: string) => `"${content.replace(/"/g, '\\"')}"`
    );
    return JSON.parse(fixedRaw);
  }
}
