import streamDeck from "@elgato/streamdeck";

import { earlyClient, type EarlyTracking } from "./early-client";

const POLL_INTERVAL_MS = 10_000;

type Listener = (tracking: EarlyTracking) => void;

/**
 * Polls EARLY's current-tracking endpoint on an interval and fans the result out to subscribers,
 * so the toggle and read-only keys stay in sync without each polling independently.
 */
class TrackingPoller {
	private readonly listeners = new Set<Listener>();
	private timer: ReturnType<typeof setInterval> | undefined;
	private cached: EarlyTracking = null;

	subscribe(listener: Listener): void {
		this.listeners.add(listener);
		listener(this.cached);
		this.timer ??= setInterval(() => void this.poll(), POLL_INTERVAL_MS);
	}

	async refreshNow(): Promise<void> {
		await this.poll();
	}

	private async poll(): Promise<void> {
		try {
			this.cached = await earlyClient.getCurrentTracking();
		} catch (error) {
			streamDeck.logger.warn(`Failed to poll EARLY tracking status: ${error}`);
			return;
		}
		for (const listener of this.listeners) {
			listener(this.cached);
		}
	}
}

export const trackingPoller = new TrackingPoller();
