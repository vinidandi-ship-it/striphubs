let nextAllowedAt = 0;
let queue: Promise<void> = Promise.resolve();

export const waitForRateLimit = (intervalMs = 5000): Promise<void> => {
  queue = queue.then(async () => {
    const now = Date.now();
    const waitMs = Math.max(0, nextAllowedAt - now);
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    nextAllowedAt = Date.now() + intervalMs;
  });

  return queue;
};
