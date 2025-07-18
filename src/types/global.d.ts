export {};

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
