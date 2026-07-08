/**
 * Token-bucket rate limiter for the BoondManager HTTP client.
 *
 * Why a token bucket rather than a fixed-window counter:
 *   - Allows short bursts up to `capacity`, smoothing real-world spiky usage
 *     (the LLM may issue several parallel search tool calls).
 *   - Sustained throughput converges on `refillPerSec`, giving a predictable
 *     ceiling regardless of burst.
 *   - No hard reset boundary that all clients race toward at the same instant.
 *
 * Why serialise acquires through a promise chain:
 *   - Concurrent `acquire()` callers from the same process must not race for
 *     the same token. The chain forces consume() to run one at a time, so the
 *     in-memory token count is always consistent.
 */
export interface Clock {
    now(): number;
    sleep(ms: number): Promise<void>;
}
export declare const realClock: Clock;
export declare class TokenBucket {
    readonly capacity: number;
    readonly refillPerSec: number;
    private readonly clock;
    private tokens;
    private lastRefill;
    private chain;
    constructor(capacity: number, refillPerSec: number, clock?: Clock);
    /** Wait until a token is available, then consume it. */
    acquire(): Promise<void>;
    /**
     * Number of currently-available tokens (after refill). Visible for tests
     * and observability; do not use for control flow.
     */
    peek(): number;
    private consume;
    private refill;
}
//# sourceMappingURL=rate-limiter.d.ts.map