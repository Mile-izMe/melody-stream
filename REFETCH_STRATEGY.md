# Data Refetch Strategies for MelodyStream

## Current Strategy: WebSocket + Smart Caching

### How It Works

1. **No polling** - Songs data is cached locally indefinitely
2. **WebSocket listener** - Server sends `songs:updated` message when data changes
3. **Smart invalidation** - Cache is only refreshed when server notifies of changes
4. **Cost**: ~0 API calls if no changes, 1 API call when server broadcasts update

```typescript
// In app/page.tsx and app/search/page.tsx
useSongsWebSocket(); // Listens for "songs:updated" from server
```

### Files Involved

- **Client WebSocket**: `src/services/websocket-client.ts`
- **React Hook**: `src/hooks/use-songs-websocket.ts`
- **Usage**: `app/page.tsx`, `app/search/page.tsx`

---

## Alternative Strategies (Comparison)

### 1. **Time-Based Polling** ❌ EXPENSIVE

```typescript
refetchInterval: 60000; // Every 1 minute
```

**Cost**: 1,440 API calls per user per day (24h × 60 min)  
**Use case**: None - too expensive for music catalog

---

### 2. **User-Action-Based** ✅ COST-EFFECTIVE

```typescript
// Only refetch when user does something
const { refetch } = useQuery({ ... });

const handleSearch = async (newQuery) => {
  setQuery(newQuery);
  await refetch();  // Refetch after search input change
};
```

**Cost**: 1 API call per user action  
**Use case**: Search, pagination, manual refresh button

---

### 3. **ETag HTTP Caching** ✅ VERY EFFICIENT

```typescript
// Backend sends ETag header
// Frontend checks If-None-Match, server returns 304 Not Modified
// Browser only downloads if changed
```

**Cost**: Minimal bandwidth (304 responses have no body)  
**Use case**: Complement to polling or WebSocket

---

### 4. **WebSocket (Real-Time)** ✅ OPTIMAL

```typescript
useSongsWebSocket(); // Current implementation
```

**Cost**: 1 API call when server sends "songs:updated" message  
**Use case**: **BEST FOR MUSIC CATALOG** - server notifies when new songs uploaded

---

### 5. **Hybrid Approach** ✅ BEST FOR RELIABILITY

```typescript
// WebSocket primary + fallback to manual refresh
useSongsWebSocket(); // Real-time updates
useRefreshSongs().refresh(); // User can manually refresh if needed
```

**Cost**: Minimal (WebSocket) + user actions only  
**Use case**: Production - reliable + cost-efficient

---

## Backend WebSocket Implementation

### Server-Side (Example with GraphQL Subscriptions)

```typescript
// Backend should send this when songs are uploaded/updated
const broadcast = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "songs:updated",
          payload: {
            type: "added", // or 'updated', 'deleted'
            reason: "new_upload",
            songIds: ["song-123", "song-456"],
          },
        }),
      );
    }
  });
};

// Call broadcast() after:
// - Song upload completes
// - Song metadata updated
// - Song deleted
// - Batch import finishes
```

### Message Format

```typescript
interface SongsUpdatePayload {
  type: "added" | "updated" | "deleted" | "bulk";
  songIds?: string[]; // Which songs changed
  reason?: string; // Why (upload, delete, admin_edit)
}
```

---

## Cost Comparison

| Strategy             | Calls/User/Day | Bandwidth   | Latency | Best For                  |
| -------------------- | -------------- | ----------- | ------- | ------------------------- |
| Polling (5s)         | 17,280         | 🔴 High     | ~5s     | Real-time, willing to pay |
| Polling (1m)         | 1,440          | 🟡 Medium   | ~1m     | Not recommended           |
| User-Action          | ~10-50         | 🟢 Low      | ~200ms  | Search, pagination        |
| ETag                 | ~50-100        | 🟢 Very Low | ~200ms  | Good + polling            |
| **WebSocket**        | **~5-20**      | 🟢 Very Low | ~100ms  | **Music catalog**         |
| Hybrid (WS + Manual) | **~5-20**      | 🟢 Very Low | ~100ms  | **Production ⭐**         |

---

## Implementation Guide

### Phase 1: WebSocket (Current)

✅ No polling - WebSocket only  
✅ Server broadcasts on song upload/update  
✅ Frontend listens and invalidates cache

### Phase 2: Fallback (Optional)

✅ If WebSocket disconnects → auto-reconnect  
✅ User can manually refresh  
✅ `useRefreshSongs()` hook available

### Phase 3: ETag (Nice-to-Have)

✅ Add ETag headers in backend  
✅ React Query + axios interceptor checks If-None-Match  
✅ Further reduces bandwidth

---

## How to Test

1. **Go to home page** - Songs load once, stay cached
2. **Upload a new song** - Server broadcasts `songs:updated`
3. **Check Network tab** - Only 1 initial request + 1 refetch on update
4. **No polling** ✅

---

## Configuration

Set WebSocket URL in `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws
```

For production:

```bash
NEXT_PUBLIC_WS_URL=wss://api.melodystream.com/ws
```

---

## Files to Implement on Backend

1. **WebSocket Server**: `ws://localhost:3000/ws`
2. **Broadcast on Upload**: Call `broadcastSongsUpdate()` after `requestSongSaveMetadata` completes
3. **Broadcast on Delete**: Call when song is deleted
4. **Optional**: GraphQL Subscriptions for type safety

---

## Next Steps

1. ✅ WebSocket client installed + hook created
2. ⏳ Backend WebSocket endpoint (`/ws`)
3. ⏳ Broadcast logic on song upload/update/delete
4. ⏳ Test end-to-end
5. ⏳ (Optional) Add ETag caching

---

## Questions?

- **Does my backend support WebSocket?** Check if server has WebSocket library (ws, socket.io, etc.)
- **How do I handle reconnect?** → Already handled in `websocket-client.ts` with exponential backoff
- **What if WebSocket fails?** → Falls back gracefully, manual refresh still works
- **Can I still poll if needed?** → Yes, just add `refetchInterval` back to `useQuery`
