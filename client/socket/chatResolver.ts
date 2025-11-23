class ChatResolver {
  #start = 0;
  #length = 0;
  #scheduled = false;
  #resolving = false;
  #initialized = false;
  #chats: ChatLean[] = [];
  #cb = (_: ChatLean[]) => {};
  #queue: Record<number, Swift.ResolverEvent> = {};

  /** Resolves chat updates in batches, calls other resolver */
  async #resolver() {
    this.#scheduled = false;

    if (this.#resolving) return;
    this.#resolving = true;

    let processed = 0; // no of processed items;
    const max = 10; // batch size;

    while (processed < max && this.#start < this.#length) {
      processed++;
      const event = this.#queue[++this.#start];

      if (event.type === "CHAT_CREATED") {
        this.#chatCreatedResolver(event);
      }

      console.log("resolving item", this.#start);
    }

    // update callback after batch op
    if (processed > 0) {
      this.#chats.sort((a, b) =>
        new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime()
          ? 1
          : -1
      );
      this.#cb(this.#chats);
    }

    this.#resolving = false;

    // next batch
    if (this.#start < this.#length) {
      queueMicrotask(() => this.#resolver());
      console.log("resolver processing next batch");
    }
    // reset
    else {
      this.#reset();
      console.log("resolver exited");
    }
  }

  #chatCreatedResolver(event: Swift.ResolverEvents["CHAT_CREATED"]) {
    const { data, type } = event;
    if (type !== "CHAT_CREATED") return;

    const chatExists = this.#chats.find((chat) => chat.id === data.id);
    if (chatExists) return false;

    this.#chats.push(data);
    return true;
  }

  #reset() {
    this.#start = 0;
    this.#length = 0;
    this.#queue = {};
  }

  enqueue(event: Swift.ResolverEvent) {
    if (!this.#initialized) {
      console.error("Chat resolver not initialized");
      return;
    }

    this.#queue[++this.#length] = event;

    if (!this.#scheduled && !this.#resolving) {
      this.#scheduled = true;
      queueMicrotask(() => this.#resolver());
    }
  }

  isInitialized() {
    return this.#initialized;
  }

  /**
   *
   * @param cb a calback that receives the resolved chat.
   * @param allChats initial chatList as seed
   * @returns a boolean (always true)
   */
  initResolver(cb: (chat: ChatLean[]) => void, allChats: ChatLean[]) {
    this.#cb = cb;
    this.#chats = [...allChats];
    this.#reset();
    return ((this.#initialized = true), this.#initialized);
  }
}

export const chatResolver = new ChatResolver();
