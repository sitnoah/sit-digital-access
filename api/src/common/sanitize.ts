// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;

export function sanitizeText(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(CONTROL_CHARS, " ").replace(HTML_TAGS, "").trim();
}

export function sanitizePayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.entries(payload).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? sanitizePayload(item)
          : sanitizeText(item)
      );
      return acc;
    }

    if (typeof value === "object" && value !== null && !(value instanceof Date)) {
      acc[key] = sanitizePayload(value);
      return acc;
    }

    acc[key] = sanitizeText(value);
    return acc;
  }, {});
}
