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
export const realClock = {
    now: () => Date.now(),
    sleep: (ms) => ms <= 0 ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms)),
};
export class TokenBucket {
    capacity;
    refillPerSec;
    clock;
    tokens;
    lastRefill;
    chain = Promise.resolve();
    constructor(capacity, refillPerSec, clock = realClock) {
        this.capacity = capacity;
        this.refillPerSec = refillPerSec;
        this.clock = clock;
        if (!(capacity > 0))
            throw new Error("TokenBucket: capacity must be > 0");
        if (!(refillPerSec > 0))
            throw new Error("TokenBucket: refillPerSec must be > 0");
        this.tokens = capacity;
        this.lastRefill = clock.now();
    }
    /** Wait until a token is available, then consume it. */
    acquire() {
        const next = this.chain.then(() => this.consume());
        // Swallow the rejection on the chain itself so a single failing consume
        // (which shouldn't happen, but be defensive) does not poison every later
        // acquire. Callers still see their own promise resolve/reject normally.
        this.chain = next.catch(() => undefined);
        return next;
    }
    /**
     * Number of currently-available tokens (after refill). Visible for tests
     * and observability; do not use for control flow.
     */
    peek() {
        this.refill();
        return this.tokens;
    }
    async consume() {
        this.refill();
        while (this.tokens < 1) {
            const deficit = 1 - this.tokens;
            const waitMs = Math.max(1, Math.ceil((deficit / this.refillPerSec) * 1000));
            await this.clock.sleep(waitMs);
            this.refill();
        }
        this.tokens -= 1;
    }
    refill() {
        const now = this.clock.now();
        const elapsedSec = Math.max(0, (now - this.lastRefill) / 1000);
        if (elapsedSec === 0)
            return;
        this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSec);
        this.lastRefill = now;
    }
}
//# sourceMappingURL=rate-limiter.js.map