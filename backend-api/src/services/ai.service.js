const FORCE_AI_FAILURE = "force_ai_failure";

const VALID_CATEGORIES = [
  "DOCUMENT_REQUEST",
  "ACCOUNT_ISSUE",
  "BILLING",
  "GENERAL",
];

async function realAnalyseTask({ title, description }) {
  const apiKey = process.env.AI_API_KEY;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are an assistant that analyses operations tasks. Always respond with a JSON object matching exactly this shape: ' +
            '{"category": "DOCUMENT_REQUEST" | "ACCOUNT_ISSUE" | "BILLING" | "GENERAL", ' +
            '"priority": "LOW" | "MEDIUM" | "HIGH", "summary": string, "recommendedAction": string}. ' +
            'No other text.',
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: status ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : null;

  if (typeof content !== "string") {
    throw new Error("OpenAI API returned no message content");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  if (!VALID_CATEGORIES.includes(parsed.category)) {
    throw new Error("OpenAI response contained an invalid category");
  }

  return {
    category: parsed.category,
    priority: parsed.priority,
    summary: parsed.summary,
    recommendedAction: parsed.recommendedAction,
  };
}

const DOCUMENT_REQUEST_WORDS = [
  "payslip",
  "document",
  "attachment",
  "upload",
  "missing doc",
];
const ACCOUNT_ISSUE_WORDS = [
  "password",
  "locked out",
  "login",
  "account access",
];
const BILLING_WORDS = ["invoice", "refund", "billing", "charge", "payment"];
const BILLING_ANOMALY_WORDS = ["duplicate", "error", "wrong", "incorrect"];
const URGENT_WORDS = ["urgent", "asap", "immediately", "escalate"];

function matches(keywords, text) {
  return keywords.some((keyword) => text.includes(keyword));
}

async function analyseTask(task) {
  if (process.env.AI_API_KEY) {
    return realAnalyseTask(task);
  }

  const { title, description } = task;
  const text = `${title || ""} ${description || ""}`.toLowerCase();

  if (text.includes(FORCE_AI_FAILURE)) {
    throw new Error("Simulated AI provider failure");
  }

  let result;

  if (matches(DOCUMENT_REQUEST_WORDS, text)) {
    result = {
      category: "DOCUMENT_REQUEST",
      priority: "HIGH",
      summary: "Customer needs to provide a missing document.",
      recommendedAction: "Request the missing document from the customer.",
    };
  } else if (matches(ACCOUNT_ISSUE_WORDS, text)) {
    result = {
      category: "ACCOUNT_ISSUE",
      priority: "MEDIUM",
      summary: "Customer is having trouble accessing their account.",
      recommendedAction:
        "Verify the customer's identity and assist with restoring account access.",
    };
  } else if (matches(BILLING_WORDS, text)) {
    result = {
      category: "BILLING",
      priority: matches(BILLING_ANOMALY_WORDS, text) ? "HIGH" : "MEDIUM",
      summary: "Customer has a question about a billing matter.",
      recommendedAction:
        "Review the billing records and clarify the details with the customer.",
    };
  } else {
    result = {
      category: "GENERAL",
      priority: "MEDIUM",
      summary: description || title || "",
      recommendedAction: "Review the task and decide on next steps.",
    };
  }

  if (matches(URGENT_WORDS, text)) {
    result.priority = "HIGH";
  }

  return result;
}

module.exports = {
  analyseTask,
};
