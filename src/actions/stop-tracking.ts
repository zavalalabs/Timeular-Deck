import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { earlyClient } from "../early-client";
import { trackingPoller } from "../tracking-poller";

@action({ UUID: "com.zavalalabs.early-deck.stop-tracking" })
export class StopTracking extends SingletonAction {
	override async onWillAppear(ev: WillAppearEvent): Promise<void> {
		if (ev.action.isKey()) {
			await ev.action.setTitle("Stop");
		}
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await earlyClient.stopTracking();
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`Failed to stop tracking: ${error}`);
			await ev.action.showAlert();
		}

		await trackingPoller.refreshNow();
	}
}
