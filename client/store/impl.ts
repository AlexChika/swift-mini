// // @ts-nocheck

// // ............Zustand Alternative .................
// import { useSyncExternalStore, useRef } from 'react';

// // 1. The Core Vanilla Store Engine (Zero React Dependencies)
// function createVanillaStore(initialState, reducer) {
//   let state = initialState;
//   const listeners = new Set();

//   return {
//     getState: () => state,

//     dispatch: (action) => {
//       state = reducer(state, action);
//       // Immediately notify all active component hooks
//       listeners.forEach((listener) => listener());
//     },

//     // React's useSyncExternalStore requires this exact signature
//     subscribe: (listener) => {
//       listeners.add(listener);
//       return () => listeners.delete(listener);
//     }
//   };
// }

// // 2. Define your Chat State Reducer
// const chatReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_BATCH':
//       return { ...state, messages: [...state.messages, ...action.payload] };
//     default:
//       return state;
//   }
// };

// // Instantiate the single source of truth globally or via a Context reference
// const globalChatStore = createVanillaStore({ messages: [] }, chatReducer);

// // 3. The Custom Hook (Mimics Zustand perfectly)
// export function useChatStore(selector) {
//   // useSyncExternalStore automatically handles subscribing, unsubscribing,
//   // and triggering a re-render ONLY when the selected slice of data changes.
//   return useSyncExternalStore(
//     globalChatStore.subscribe,
//     () => selector(globalChatStore.getState())
//   );
// }

// // Export the dispatch function directly for network worker loops to use
// export const chatDispatch = globalChatStore.dispatch;

// // usaages

//   const messages = useChatStore((state) => state.messages);

//   // Inside your WebSocket or requestAnimationFrame manager:
// const onNetworkMessageBatch = (rawMessages) => {
//   // Directly fires actions straight into the state memory array.
//   // Completely bypasses the UI thread lifecycle until the next paint frame.
//   chatDispatch({ type: 'ADD_BATCH', payload: rawMessages });
// };

// // ........................................

// // ## The Blueprint: How to Structure High-Frequency Interactive Chat
// // The secret to keeping your app responsive is ensuring that only the messages being added are rendered, and messages already on screen are skipped entirely by React's evaluation engine.
// // ## 1. The Global Store (The Data Engine)
// // Keep the chat message array in an optimized, subscription-free store like Zustand. This completely decouples the incoming WebSocket data pipeline from your top-level layout components.

// import { create } from 'zustand';
// export const useChatStore = create((set) => ({
//   messages: [],
//   addMessagesBatch: (newMessages) => set((state) => ({
//     // Append new messages to the store array
//     messages: [...state.messages, ...newMessages]
//   })),
// }));

// // ## 2. The Throttled Ingestion Loop
// // Your WebSocket receives messages instantly, batches them up, and then pushes them to the Zustand store exactly inside a requestAnimationFrame loop. This keeps state changes aligned perfectly with the browser's refresh rate. [6]

// // Inside your WebSocket initialization effect:const queue = useRef([]);

// useEffect(() => {
//   let frameId;

//   const processQueue = () => {
//     if (queue.current.length > 0) {
//       // Drain the network queue all at once
//       const batch = queue.current.splice(0, queue.current.length);
//       // Update the Zustand store
//       useChatStore.getState().addMessagesBatch(batch);
//     }
//     frameId = requestAnimationFrame(processQueue);
//   };

//   frameId = requestAnimationFrame(processQueue);
//   return () => cancelAnimationFrame(frameId);
// }, []);

// // ## 3. Strict Memoization (React.memo)
// // When React appends 100 new elements to an array, its default behavior is to re-render the entire list from scratch. To prevent this, your interactive message component must be tightly wrapped in React.memo.

// // @ts-nocheck

// import React, { useState } from 'react';
// // Wrap the component tightly in React.memoexport const ChatMessage = React.memo(({ msg }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);

//   return (

//     <div className="message-row" onContextMenu={() => setShowMenu(true)}>
//       <span className="username">{msg.user}</span>
//       <span className="text-body">
//         {/* Clickable interactive elements work natively */}
//         <a href={msg.link}>{msg.text}</a>
//       </span>
//       <button onClick={() => setIsLiked(!isLiked)}>
//         {isLiked ? '❤️' : '🤍'}
//       </button>
//       {showMenu && <ContextMenu onClose={() => setShowMenu(false)} />}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   // Pure performance trick: only re-render if the message ID or content changes
//   return prevProps.msg.id === nextProps.msg.id;
// });

// // ## 4. Virtualization (react-window or react-virtuoso)
// // Even with memoization, if a chat room runs for an hour and accumulates 10,000 messages, React still has to keep 10,000 fully interactive interactive components alive in memory. This will eventually cause layout engine degradation.
// // You must feed your Zustand array into a virtualized list library like react-virtuoso (which handles variable dynamic row heights perfectly for text). [7]

// import { Virtuoso } from 'react-virtuoso';
// export function ChatWindow() {
//   const messages = useChatStore((state) => state.messages);
//   const virtuosoRef = useRef(null);

//   return (
//     <div className="chat-container">
//       {/* ⚠️ Sidebars and charts stay outside and never re-render */}
//       <MovingSidebars />

//       <Virtuoso
//         ref={virtuosoRef}
//         data={messages}
//         // Only the 20-30 visible rows exist in the HTML DOM!
//         itemContent={(index, msg) => <ChatMessage key={msg.id} msg={msg} />}
//         followOutput="auto" // Automatically pins scroll to the bottom smoothly
//         style={{ height: '100%', width: '100%' }}
//       />
//     </div>
//   );
// }

// ------------------------------
// // ## Why This Setup Works Flawlessly

// //    1. State Isolation: Because each <ChatMessage /> manages its own internal state (useState for its context menu or button toggles), clicking or interacting with an individual message component triggers a micro-render only for that single row. The rest of the list remains untouched. [8]

// //    2. Infinite Scaling: When the WebSocket pushes a massive batch of 100 updates, react-virtuoso effortlessly drops the old rows out of the top of the browser DOM and appends the new ones to the bottom, keeping your active node count constant.

// //    3. No Side Effects: Because the state update is limited strictly to the isolated ChatWindow via Zustand's selective selector pattern, your heavy charts, stock tickers, or sidebar navigation components never execute their virtual DOM diffing logic. [9]
