import type { components } from './schema';

type GeneratedProblem = components['schemas']['ProblemDetail'];

export type ProblemDetail = Omit<GeneratedProblem, 'status' | 'properties'> & {
  status: number;
  [extension: string]: unknown;
};

export class ApiError extends Error {
  public problem: ProblemDetail;

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title || 'API Error');
    this.name = 'ApiError';
    this.problem = problem;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function parseProblem(response: Response): Promise<ProblemDetail> {
  const fallback: ProblemDetail = {
    status: response.status,
    title: response.statusText,
    detail: 'Не вдалося розпарсити відповідь сервера',
  };

  if (!(response.headers.get('content-type') ?? '').includes('json')) return fallback;

  try {
    const body: unknown = await response.clone().json();
    if (isRecord(body)) return { ...body, status: response.status };
  } catch {
    // Ігноруємо помилки парсингу JSON для створення fallback-об'єкта
  }

  return fallback;
}

export type FieldErrors = Record<string, string[]>;

export function getFieldErrors(problem: ProblemDetail): FieldErrors {
  const raw = problem.errors;
  const result: FieldErrors = {};

  if (isRecord(raw)) {
    for (const [field, messages] of Object.entries(raw)) {
      if (Array.isArray(messages)) {
        result[field] = messages.filter((m): m is string => typeof m === 'string');
      } else if (typeof messages === 'string') {
        result[field] = [messages];
      }
    }
  }

  return result;
}
