# WebSocket Implementation Guide for Backend

## Quick Summary

When a song is uploaded, updated, or deleted → broadcast `songs:updated` message to all connected WebSocket clients.

---

## Implementation Examples

### 1. Node.js + `ws` Library (Simplest)

```typescript
// backend/ws-server.ts
import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function
export function broadcastSongsUpdate(payload) {
  const message = JSON.stringify({
    type: "songs:updated",
    payload,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(3000);
```

**Usage after song upload:**

```typescript
// In your upload handler
await saveSongToDatabase(songData);
broadcastSongsUpdate({
  type: "added",
  reason: "new_upload",
  songIds: [songData.id],
});
```

---

### 2. Express + Socket.IO (More Features)

```typescript
// backend/socket.ts
import express from "express";
import { Server } from "socket.io";

const app = express();
const io = new Server(app, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export function broadcastSongsUpdate(payload) {
  io.emit("songs:updated", payload);
}

app.listen(3000);
```

---

### 3. NestJS + WebSocket Decorators

```typescript
// backend/songs.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class SongsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client) {
    console.log(`Client ${client.id} connected`);
  }

  broadcastSongsUpdate(payload) {
    this.server.emit("songs:updated", payload);
  }
}
```

**Usage in service:**

```typescript
@Injectable()
export class SongsService {
  constructor(private songsGateway: SongsGateway) {}

  async uploadSong(data) {
    const song = await this.db.songs.create(data);
    this.songsGateway.broadcastSongsUpdate({
      type: "added",
      reason: "new_upload",
      songIds: [song.id],
    });
    return song;
  }
}
```

---

### 4. GraphQL Subscriptions (Type-Safe)

```typescript
// backend/resolvers/songs.resolver.ts
import { Subscription, Resolver } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

@Resolver()
export class SongsResolver {
  @Subscription(() => SongsUpdatePayload)
  songsUpdated() {
    return pubSub.asyncIterator("SONGS_UPDATED");
  }
}

// Broadcast after upload
await saveSong(data);
pubSub.publish("SONGS_UPDATED", {
  songsUpdated: {
    type: "added",
    reason: "new_upload",
    songIds: [data.id],
  },
});
```

---

## Where to Call Broadcast

Add broadcast calls in these places:

### 1. After Song Upload

```typescript
async uploadSong(file, metadata) {
  const song = await saveSongToDatabase(file, metadata);
  broadcastSongsUpdate({
    type: 'added',
    reason: 'new_upload',
    songIds: [song.id],
  });
  return song;
}
```

### 2. After Song Update

```typescript
async updateSongMetadata(id, metadata) {
  const song = await updateInDatabase(id, metadata);
  broadcastSongsUpdate({
    type: 'updated',
    reason: 'metadata_update',
    songIds: [id],
  });
  return song;
}
```

### 3. After Song Delete

```typescript
async deleteSong(id) {
  await deleteFromDatabase(id);
  broadcastSongsUpdate({
    type: 'deleted',
    reason: 'user_delete',
    songIds: [id],
  });
}
```

### 4. After Bulk Import

```typescript
async bulkImportSongs(songs) {
  const imported = await importToDatabase(songs);
  broadcastSongsUpdate({
    type: 'bulk',
    reason: 'batch_import',
    songIds: imported.map(s => s.id),
  });
  return imported;
}
```

---

## Payload Schema

```typescript
interface SongsUpdatePayload {
  type: "added" | "updated" | "deleted" | "bulk";
  songIds?: string[];
  reason?:
    | "new_upload"
    | "metadata_update"
    | "user_delete"
    | "batch_import"
    | string;
}

interface WebSocketMessage {
  type: "songs:updated";
  payload: SongsUpdatePayload;
}
```

---

## Testing

### 1. Use WebSocket CLI

```bash
npm install -g wscat
wscat -c ws://localhost:3000/ws
```

### 2. Send Test Message

```bash
{"type":"songs:updated","payload":{"type":"added","songIds":["123"]}}
```

### 3. Check Frontend

- Open browser DevTools → Network tab
- Go to http://localhost:3000
- See only 1 initial request for songs
- Trigger upload on backend → watch cache invalidate → new refetch

---

## Environment Variables

```env
# .env (backend)
WS_PORT=3000
WS_URL=ws://localhost:3000/ws

# .env.local (frontend)
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws
```

Production:

```bash
# Backend
WS_URL=wss://api.melodystream.com/ws

# Frontend .env.production.local
NEXT_PUBLIC_WS_URL=wss://api.melodystream.com/ws
```

---

## Troubleshooting

| Issue                    | Solution                                                    |
| ------------------------ | ----------------------------------------------------------- |
| **WebSocket CORS error** | Check `cors` config in server, should allow frontend origin |
| **No messages received** | Check `client.readyState === WebSocket.OPEN` before sending |
| **Connection drops**     | Add heartbeat/ping-pong every 30s                           |
| **Too many broadcasts**  | Debounce or batch updates                                   |

---

## Performance Tips

1. **Batch updates** - Don't broadcast on every single upload, batch multiple songs

```typescript
// Instead of immediate broadcast, collect IDs
const pendingUpdates = [];
pendingUpdates.push(songId);

// Broadcast once per 5 seconds
setTimeout(() => {
  broadcastSongsUpdate({
    type: "bulk",
    songIds: pendingUpdates,
  });
  pendingUpdates.length = 0;
}, 5000);
```

2. **Only notify if public** - Don't broadcast private songs

```typescript
if (song.isPublic) {
  broadcastSongsUpdate(...);
}
```

3. **Memory efficient** - Clean up disconnected clients automatically

---

## Cost Impact

- **Before (Polling)**: 1,440 API calls per user per day (1/min × 24h)
- **After (WebSocket)**: ~10-50 API calls per user per day (only on update)
- **Savings**: 96-99% reduction in API calls 🚀
