import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { earlyClient } from "../early-client";
import { trackingPoller } from "../tracking-poller";

type Settings = {
	activityId?: string;
};

@action({ UUID: "com.zavalalabs.early-deck.start-activity" })
export class StartActivity extends SingletonAction<Settings> {
	override async onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> {
		if (ev.action.isKey() && !ev.payload.settings.activityId) {
			await ev.action.setTitle("Start");
		}
	}

	override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const { activityId } = ev.payload.settings;
		if (!activityId) {
			await ev.action.showAlert();
			return;
		}

		try {
			await earlyClient.startTracking(activityId);
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`Failed to start tracking: ${error}`);
			await ev.action.showAlert();
		}

		await trackingPoller.refreshNow();
	}
}
