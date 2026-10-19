import { action, SingletonAction } from "@elgato/streamdeck";

import type { EarlyTracking } from "../early-client";
import { formatActivityTitle } from "../format-title";
import { trackingPoller } from "../tracking-poller";

@action({ UUID: "com.zavalalabs.early-deck.current-activity" })
export class CurrentActivity extends SingletonAction {
	constructor() {
		super();
		trackingPoller.subscribe((tracking) => void this.render(tracking));
	}

	private async render(tracking: EarlyTracking): Promise<void> {
		for (const instance of this.actions) {
			if (!instance.isKey()) {
				continue;
			}
			await instance.setTitle(tracking ? formatActivityTitle(tracking.activity.name) : "Idle");
		}
	}
}
