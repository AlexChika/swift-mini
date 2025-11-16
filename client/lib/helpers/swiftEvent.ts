class SwiftEvent extends EventTarget {
  emit<K extends keyof Swift.Events>(
    type: K,
    detail: { data: Swift.Events[K] }
  ) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  on<K extends keyof Swift.Events>(
    type: K,
    listener: (e: CustomEvent<Swift.Events[K]>) => void
  ) {
    this.addEventListener(type, listener as EventListener);
  }

  off<K extends keyof Swift.Events>(
    type: K,
    listener: (e: CustomEvent<Swift.Events[K]>) => void
  ) {
    this.removeEventListener(type, listener as EventListener);
  }
}

export const swiftEvent = new SwiftEvent();
