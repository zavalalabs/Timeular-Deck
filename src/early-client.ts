import streamDeck from "@elgato/streamdeck";

const API_BASE = "https://api.early.app/api/v4";

export type EarlyActivity = {
	id: string;
	name: string;
	color: string;
	folderId: string;
};

export type EarlyTracking = {
	id: string | number;
	activity: EarlyActivity;
	startedAt: string;
} | null;

type GlobalSettings = {
	apiKey?: string;
	apiSecret?: string;
	token?: string;
};

// EARLY's documented examples show timestamps without a UTC "Z" suffix (e.g. "2016-02-03T04:00:00.000"),
// unlike Date#toISOString()'s "2016-02-03T04:00:00.000Z" — strip it to match.
function nowForEarlyApi(): string {
	return new Date().toISOString().replace("Z", "");
}

/**
 * Thin wrapper around the EARLY (formerly Timeular) Public API v4. Credentials and the bearer
 * token are persisted as plugin-wide global settings so every action shares one sign-in.
 */
class EarlyClient {
	private token: string | undefined;

	private async signIn(): Promise<string> {
		const { apiKey, apiSecret } = await streamDeck.settings.getGlobalSettings<GlobalSettings>();
		if (!apiKey || !apiSecret) {
			throw new Error("Set your EARLY API Key & Secret in any EARLY Deck key's settings first.");
		}

		const res = await fetch(`${API_BASE}/developer/sign-in`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ apiKey, apiSecret }),
		});

		if (!res.ok) {
			throw new Error(`EARLY sign-in failed (HTTP ${res.status}): ${await res.text()}`);
		}

		const { token } = (await res.json()) as { token: string };
		this.token = token;
		await streamDeck.settings.setGlobalSettings<GlobalSettings>({ apiKey, apiSecret, token });
		return token;
	}

	private async request<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
		if (!this.token) {
			const settings = await streamDeck.settings.getGlobalSettings<GlobalSettings>();
			this.token = settings.token;
		}
		if (!this.token) {
			await this.signIn();
		}

		const res = await fetch(`${API_BASE}${path}`, {
			...init,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
				...init.headers,
			},
		});

		if (res.status === 401 && !retried) {
			this.token = undefined;
			await this.signIn();
			return this.request<T>(path, init, true);
		}

		if (res.status === 404) {
			return null as T;
		}

		if (!res.ok) {
			throw new Error(`EARLY API request to ${path} failed (HTTP ${res.status}): ${await res.text()}`);
		}

		const text = await res.text();
		return (text ? JSON.parse(text) : null) as T;
	}

	async listActivities(): Promise<EarlyActivity[]> {
		const data = await this.request<{ activities: EarlyActivity[] } | null>("/activities");
		return data?.activities ?? [];
	}

	async getCurrentTracking(): Promise<EarlyTracking> {
		return await this.request<EarlyTracking>("/tracking");
	}

	async startTracking(activityId: string): Promise<EarlyTracking> {
		return await this.request<EarlyTracking>(`/tracking/${activityId}/start`, {
			method: "POST",
			body: JSON.stringify({ startedAt: nowForEarlyApi() }),
		});
	}

	async stopTracking(): Promise<void> {
		try {
			await this.request("/tracking/stop", {
				method: "POST",
				body: JSON.stringify({ stoppedAt: nowForEarlyApi() }),
			});
		} catch (error) {
			// EARLY still ends the live tracking session even when it rejects creating a Time
			// Entry for it (sessions under a minute can't be saved) — not a real failure for us.
			if (error instanceof Error && error.message.includes("00400100001")) {
				streamDeck.logger.warn(`Stopped tracking, but the session was too short to save as a time entry: ${error.message}`);
				return;
			}
			throw error;
		}
	}
}

export const earlyClient = new EarlyClient();
