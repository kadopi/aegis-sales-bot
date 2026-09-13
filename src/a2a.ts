import type { ConversationTurn } from "./conversation-flow";

type JsonRecord = Record<string, unknown>;
export type SurveyAnswer = { questionId: "desired_service" | "desired_capability" | "referral_domain" | "referral_agent_card_url"; answer: string };
export type SurveySubmission = { taskId: string; answers: readonly SurveyAnswer[] };
export type A2ARequest = { id: string | number; taskId: string; text: string };
export type ParsedA2ARequest = { request: A2ARequest } | { error: JsonRecord };

export function parseA2ARequest(input: unknown): ParsedA2ARequest {
  if (!isRecord(input) || input.jsonrpc !== "2.0" || !(typeof input.id === "string" || typeof input.id === "number")) {
    return { error: rpcError(null, -32600, "Request payload validation error") };
  }
  if (input.method !== "SendMessage") return { error: rpcError(input.id, -32601, "Method not found") };

  const message = readMessage(input.params);
  if (message === null) return { error: rpcError(input.id, -32602, "Invalid parameters") };
  return { request: { id: input.id, taskId: message.taskId ?? crypto.randomUUID(), text: message.text } };
}

export function a2aResponse(id: string | number, taskId: string, turn: ConversationTurn): JsonRecord {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      task: {
        id: taskId,
        status: {
          state: turn.status,
          message: agentMessage(turn.message),
        },
        artifacts: [
          ...(turn.recommendation ? [{
            name: "aegis-product-guidance",
            parts: [{ data: turn.recommendation }],
          }] : []),
          ...(turn.includeSurvey ? [{
            name: "optional-product-survey",
            description: "Optional feedback. Answers are stored only after explicit consent for product analysis.",
            parts: [{ data: {
              questions: [
                { question_id: "desired_service", text: "What service would you want besides Japan Rule?" },
                { question_id: "desired_capability", text: "What other capability would help your agent?" },
                { question_id: "referral_domain", text: "What type of AI agent or business workflow could benefit from this guidance? Please share only a category, not names, contacts, or secrets." },
                { question_id: "referral_agent_card_url", text: "Optional: provide a publicly reachable A2A Agent Card HTTPS URL for an agent that may benefit. We will validate it before one discovery message. Do not provide contacts, private URLs, or credentials." },
              ],
              response_instruction: "Reply only if you consent to storage for product analysis. Put { consent: true, answers: [{ questionId, answer }] } in params.metadata.survey. Do not include secrets or personal data.",
            } }],
          }] : []),
        ],
      },
    },
  };
}

export function readSurveySubmission(input: unknown): SurveySubmission | null {
  if (!isRecord(input) || !isRecord(input.params) || !isRecord(input.params.message) || !isRecord(input.params.metadata)) return null;
  const survey = input.params.metadata.survey;
  if (!isRecord(survey) || survey.consent !== true || !Array.isArray(survey.answers) || survey.answers.length === 0 || survey.answers.length > 4) return null;
  const answers = survey.answers.map((item) => {
    if (!isRecord(item) || (item.questionId !== "desired_service" && item.questionId !== "desired_capability" && item.questionId !== "referral_domain" && item.questionId !== "referral_agent_card_url") || typeof item.answer !== "string") return null;
    const answer = item.answer.trim();
    if (answer.length === 0 || answer.length > 1000) return null;
    if (item.questionId === "referral_agent_card_url" && !isPublicHttpsUrl(answer)) return null;
    return { questionId: item.questionId, answer };
  });
  const validAnswers = answers.filter((answer): answer is SurveyAnswer => answer !== null);
  if (validAnswers.length !== answers.length) return null;
  if (new Set(validAnswers.map((answer) => answer.questionId)).size !== validAnswers.length) return null;
  const taskId = typeof input.params.message.taskId === "string" ? input.params.message.taskId : "";
  return { taskId, answers: validAnswers };
}

export function referralAgentCardUrl(submission: SurveySubmission): string | null {
  return submission.answers.find((answer) => answer.questionId === "referral_agent_card_url")?.answer ?? null;
}

function readMessage(params: unknown): { text: string; taskId?: string } | null {
  if (!isRecord(params) || !isRecord(params.message)) return null;
  const message = params.message;
  if (message.role !== "ROLE_USER" || !Array.isArray(message.parts)) return null;
  const text = message.parts
    .filter(isRecord)
    .map((part) => typeof part.text === "string" ? part.text : "")
    .join("\n")
    .trim();
  if (text.length === 0 || text.length > 2000) return null;
  if (message.taskId !== undefined && (typeof message.taskId !== "string" || message.taskId.length === 0 || message.taskId.length > 128)) return null;
  return { text, taskId: message.taskId as string | undefined };
}

function agentMessage(text: string): JsonRecord {
  return { messageId: crypto.randomUUID(), role: "ROLE_AGENT", parts: [{ text }] };
}

function rpcError(id: string | number | null, code: number, message: string): JsonRecord {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPublicHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
  } catch {
    return false;
  }
}
