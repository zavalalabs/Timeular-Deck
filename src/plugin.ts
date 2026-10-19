import streamDeck from "@elgato/streamdeck";

import { CurrentActivity } from "./actions/current-activity";
import { StartActivity } from "./actions/start-activity";
import { StopTracking } from "./actions/stop-tracking";
import { ToggleActivity } from "./actions/toggle-activity";

streamDeck.logger.setLevel("info");

// The activity-picker property inspector fetches the activity list straight from the EARLY API
// itself (see its inline script), rather than round-tripping through the plugin, so there's no
// sendToPlugin handling needed here.

streamDeck.actions.registerAction(new StartActivity());
streamDeck.actions.registerAction(new StopTracking());
streamDeck.actions.registerAction(new ToggleActivity());
streamDeck.actions.registerAction(new CurrentActivity());

streamDeck.connect();
