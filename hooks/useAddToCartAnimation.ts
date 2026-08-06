export interface AnimationPayload {
  fromRect: DOMRect;
  productImage?: string;
}

type AnimationCallback = (payload: AnimationPayload) => void;

const animationCallbacks: Set<AnimationCallback> = new Set();

export const globalAnimationStore = {
  callbacks: animationCallbacks,
  trigger: (payload: AnimationPayload) => {
    animationCallbacks.forEach((callback) => callback(payload));
  },
  subscribe: (callback: AnimationCallback) => {
    animationCallbacks.add(callback);
    return () => {
      animationCallbacks.delete(callback);
    };
  },
};