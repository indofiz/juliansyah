import { stepTarget, type StepId, type StepTarget } from "@/lib/stepScenes";

/**
 * Builds the How I work step pictures (lib/stepScenes.ts) off the main
 * thread: tracing a ray per dot takes ~0.1–0.25 s a picture, which would
 * stall scrolling and the globe's fly-in. Pictures come back one at a time,
 * in the order asked (Discover first), each as a transferable buffer.
 */

export type StepArtRequest = { count: number; usable: number; order: StepId[] };
export type StepArtResult = { id: StepId } & Omit<StepTarget, "fit">;

// The DOM lib types `self` as a Window; in a worker it's the worker's scope.
const scope = self as unknown as {
  onmessage: ((e: MessageEvent<StepArtRequest>) => void) | null;
  postMessage: (message: StepArtResult, transfer: Transferable[]) => void;
};

scope.onmessage = ({ data: { count, usable, order } }) => {
  for (const id of order) {
    const { data, dots, flow, dab, spin } = stepTarget(id, count, { usable });
    scope.postMessage({ id, data, dots, flow, dab, spin }, [data.buffer]);
  }
};
