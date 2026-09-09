import { recommend } from "./recommend";

type JsonRecord = Record<string, unknown>;
export type SurveyAnswer = { questionId: "desired_service" | "desired_capability"; answer: string };
export type SurveySubmission = { taskId: string; answers: readonly SurveyAnswer[] };

export function handleA2A(input: unknown): JsonRecord {
  if (!isRecord(input) || input.jsonrpc !== "2.0" || !(typeof input.id === "string" || typeof input.id === "number")) {
    return rpcError(null, -32600, "Request payload validation error");
  }
  if (input.method !== "SendMessage") return rpcError(input.id, -32601, "Method not found");

  const message = readMessage(input.params);
  if (message === null) return rpcError(input.id, -32602, "Invalid parameters");

  const result = recommend(message.text);
  const taskId = message.taskId ?? crypto.randomUUID();
  const matched = result.recommendedProduct;
  const completed = matched !== null;
  const reply = completed
    ? `Aegis Sales Bot matched your request to ${matched.name}. ${result.nextAction} This is connection guidance only; payment and delivery are handled by the downstream service. Optional product questions: What service would you want besides Japan Rule? What other capability would help your agent?`
    : "Aegis Sales Bot could not match a published service yet. Reply with the market, product type, and whether you need Japan experiential-tourism entry guidance or x402 MCP payments. Optional product questions: What service would you want besides Japan Rule? What other capability would help your agent?";

  return {
    jsonrpc: "2.0",
    id: input.id,
    result: {
      task: {
        id: taskId,
        status: {
          state: completed ? "TASK_STATE_COMPLETED" : "TASK_STATE_INPUT_REQUIRED",
          message: agentMessage(reply),
        },
        artifacts: [
          ...(completed ? [{
            name: "aegis-product-guidance",
            parts: [{ data: result }],
          }] : []),
          {
            name: "optional-product-survey",
            description: "Optional feedback. Answers are stored only after explicit consent for product analysis.",
            parts: [{ data: {
              questions: [
                { question_id: "desired_service", text: "What service would you want besides Japan Rule?" },
                { question_id: "desired_capability", text: "What other capability would help your agent?" },
              ],
              response_instruction: "Reply only if you consent to storage for product analysis. Put { consent: true, answers: [{ questionId, answer }] } in params.metadata.survey. Do not include secrets or personal data.",
            } }],
          },
        ],
      },
    },
  };
}

export function readSurveySubmission(input: unknown): SurveySubmission | null {
  if (!isRecord(input) || !isRecord(input.params) || !isRecord(input.params.message) || !isRecord(input.params.metadata)) return null;
  const survey = input.params.metadata.survey;
  if (!isRecord(survey) || survey.consent !== true || !Array.isArray(survey.answers) || survey.answers.length === 0 || survey.answers.length > 2) return null;
  const answers = survey.answers.map((item) => {
    if (!isRecord(item) || (item.questionId !== "desired_service" && item.questionId !== "desired_capability") || typeof item.answer !== "string") return null;
    const answer = item.answer.trim();
    return answer.length > 0 && answer.length <= 1000 ? { questionId: item.questionId, answer } : null;
  });
  const validAnswers = answers.filter((answer): answer is SurveyAnswer => answer !== null);
  if (validAnswers.length !== answers.length) return null;
  if (new Set(validAnswers.map((answer) => answer.questionId)).size !== validAnswers.length) return null;
  const taskId = typeof input.params.message.taskId === "string" ? input.params.message.taskId : "";
  return { taskId, answers: validAnswers };
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
