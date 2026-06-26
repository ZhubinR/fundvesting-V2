import { MARKET_AUTH_TOKEN } from "@/features/funds/constants";
import type { MarketTickMap } from "@/features/funds/types";
import type { MarketSocketListener, MarketSocketMessage, MarketSocketStatus } from "./types";

const BASE_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

/**
 * Manages exactly one WebSocket connection to the realtime market-data
 * endpoint and fans its data out to any number of React components via
 * `useSyncExternalStore`.
 *
 * This replaces two problems in the old implementation:
 *
 * 1. **One socket per consumer.** `useWebSocketHook` opened a brand new
 *    `WebSocketClient` (and therefore a brand new TCP+TLS+WS handshake)
 *    every time it was mounted. The compare page, fund-trend page, and
 *    home page each called it independently, so visiting any one of them
 *    opened its own connection — and the home page alone rendered it
 *    from three different chart sections. A single `MarketSocketStore`
 *    instance, created once in `MarketSocketProvider` and connected for
 *    the lifetime of the app shell, means there is exactly one socket
 *    no matter how many components read from it.
 *
 * 2. **Reconnect gives up permanently.** The old client retried a fixed
 *    number of times on a fixed interval, then stopped forever — a user
 *    who briefly lost wifi would silently stop receiving live prices for
 *    the rest of the session with no way to recover short of a page
 *    reload. This store backs off exponentially (capped at 30s, with
 *    jitter) but never stops retrying, and also reconnects immediately
 *    when the browser reports it's back online.
 *
 * If `getFallbackTicks` is provided and the socket can't connect at all,
 * it's used to populate a one-time placeholder snapshot so the UI isn't
 * just empty — any real message that does arrive overwrites it
 * unconditionally, so live data always wins once it's available.
 */
export class MarketSocketStore {
  private readonly url: string;
  private readonly getFallbackTicks?: () => MarketTickMap;
  private socket: WebSocket | null = null;
  private status: MarketSocketStatus = "closed";
  private ticks: MarketTickMap = {};
  private readonly listeners = new Set<MarketSocketListener>();
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = false;

  constructor(url: string, getFallbackTicks?: () => MarketTickMap) {
    this.url = url;
    this.getFallbackTicks = getFallbackTicks;
  }

  connect = (): void => {
    if (typeof window === "undefined") return; // SSR safety
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // already connecting/connected — connect() is idempotent
    }

    this.shouldReconnect = true;
    this.openSocket();
    window.addEventListener("online", this.handleOnline);
  };

  disconnect = (): void => {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = null;
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
    }
    this.setStatus("closed");
  };

  subscribe = (listener: MarketSocketListener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): MarketTickMap => this.ticks;

  getStatus = (): MarketSocketStatus => this.status;

  private openSocket(): void {
    this.setStatus("connecting");
    const socket = new WebSocket(this.url);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.setStatus("open");
      // The backend expects the auth token as a raw text frame on
      // connect, not JSON — this matches its existing wire protocol.
      socket.send(MARKET_AUTH_TOKEN);
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      const parsed = safeParseMessage(event.data);
      if (parsed?.fund) {
        this.ticks = parsed.fund;
        this.emit();
      }
    };

    socket.onerror = () => {
      this.setStatus("error");
      this.maybeApplyFallbackTicks();
    };

    socket.onclose = () => {
      this.setStatus("closed");
      this.socket = null;
      this.maybeApplyFallbackTicks();
      if (this.shouldReconnect) this.scheduleReconnect();
    };
  }

  /** Only ever fills in placeholder ticks if we don't have real ones yet —
   * never overwrites live data with placeholders. */
  private maybeApplyFallbackTicks(): void {
    if (!this.getFallbackTicks) return;
    if (Object.keys(this.ticks).length > 0) return;
    this.ticks = this.getFallbackTicks();
    this.emit();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * 2 ** this.reconnectAttempt,
      MAX_RECONNECT_DELAY_MS,
    );
    const jitter = delay * (0.25 * Math.random());

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempt += 1;
      if (this.shouldReconnect) this.openSocket();
    }, delay + jitter);
  }

  private handleOnline = (): void => {
    if (!this.shouldReconnect) return;
    if (this.socket?.readyState === WebSocket.OPEN) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.reconnectAttempt = 0;
    this.openSocket();
  };

  private setStatus(status: MarketSocketStatus): void {
    this.status = status;
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

function safeParseMessage(raw: string): MarketSocketMessage | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "fund" in parsed) {
      return parsed as MarketSocketMessage;
    }
    return null;
  } catch {
    return null;
  }
}
