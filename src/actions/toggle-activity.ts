import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

import { earlyClient, type EarlyTracking } from "../early-client";
import { formatActivityTitle } from "../format-title";
import { trackingPoller } from "../tracking-poller";

type Settings = {
	activityId?: string;
};

@action({ UUID: "com.zavalalabs.early-deck.toggle-activity" })
export class ToggleActivity extends SingletonAction<Settings> {
	constructor() {
		super();
		trackingPoller.subscribe((tracking) => void this.render(tracking));
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const { activityId } = ev.payload.settings;
		if (!activityId) {
			await ev.action.showAlert();
			return;
		}

		try {
			const current = await earlyClient.getCurrentTracking();
			if (current?.activity.id === activityId) {
				await earlyClient.stopTracking();
			} else {
				await earlyClient.startTracking(activityId);
			}
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`Failed to toggle tracking: ${error}`);
			await ev.action.showAlert();
		}

		await trackingPoller.refreshNow();
	}

	private async render(tracking: EarlyTracking): Promise<void> {
		for (const instance of this.actions) {
			if (!instance.isKey()) {
				continue;
			}
			const { activityId } = await instance.getSettings();
			const isRunning = !!activityId && tracking?.activity.id === activityId;
			await instance.setTitle(isRunning ? formatActivityTitle(`⏸ ${tracking!.activity.name}`) : "▶");
		}
	}
}
