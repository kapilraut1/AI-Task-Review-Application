const FORCE_AI_FAILURE = "force_ai_failure";

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

async function analyseTask({ title, description }) {
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
