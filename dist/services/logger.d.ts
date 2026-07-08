import pino from "pino";
/**
 * Redaction paths for the structured logger. Defence-in-depth: nothing in the
 * codebase currently logs auth material, but if a request/error object that
 * carries credentials is ever passed to the logger, these paths censor it
 * before it reaches stdout / a log aggregator. Covers the BoondManager JWT
 * header, OAuth Bearer headers, and raw access tokens at one level of nesting.
 */
export declare const REDACT_PATHS: string[];
export declare const logger: pino.Logger<never, boolean>;
/**
 * Generate a short correlation ID (8 hex chars) for tracing a single request
 * through the stack (HTTP handler → tool call → API request). Attach it to
 * logger child contexts so every log line from that request shares the ID.
 */
export declare function generateCorrelationId(): string;
//# sourceMappingURL=logger.d.ts.map