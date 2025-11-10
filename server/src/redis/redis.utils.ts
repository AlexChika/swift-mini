// /**
//  * Register a new socket ID for a user
//  */
// export async function registerUserSocket(userId, socketId) {
//   const key = `sockets:user:${userId}`;
//   await redis.lpush(key, socketId);
//   // Optional: set expiry so stale sockets disappear after, say, 24h
//   await redis.expire(key, 86400);
// }

// /**
//  * Remove a socket ID from a user when disconnected
//  */
// export async function deregisterUserSocket(userId, socketId) {
//   const key = `sockets:user:${userId}`;
//   await redis.lrem(key, 0, socketId);
//   const remaining = await redis.llen(key);
//   if (remaining === 0) await redis.del(key);
// }

// /**
//  * Get all socket IDs belonging to a user
//  */
// export async function getUserSockets(userId) {
//   const key = `sockets:user:${userId}`;
//   return await redis.lrange(key, 0, -1);
// }

// /**
//  * Emit an event to all sockets of a given user
//  */
// export async function emitToUser(io, userId, event, payload) {
//   const sockets = await getUserSockets(userId);
//   sockets.forEach((sockId) => {
//     io.to(sockId).emit(event, payload);
//   });
// }
