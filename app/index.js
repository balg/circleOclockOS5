import { me } from "appbit";
import clock from "clock";
import { display } from "display";
import * as document from "document";
import * as messaging from "messaging";
import { today } from "user-activity";
import * as Activity from "./activity";
import HeartRate from "./heartrate";
import Screen, { modes } from "./screen";
import * as Settings from "./settings";

const screen = new Screen();
Settings.load();

let mode = Settings.get("mode") || modes.OFF;
screen.setColor(Settings.get("color"));

clock.granularity = "minutes";
clock.ontick = (evt) => {
  screen.refreshTime(evt.date);
};

let heartRate;
if (me.permissions.granted("access_heart_rate")) {
  heartRate = new HeartRate(mode === modes.HR);
  heartRate.init((value) => {
    screen.setStats({
      [modes.HR]: value,
    });
  });
}

let todaysActivity;
if (me.permissions.granted("access_activity")) {
  todaysActivity = today.adjusted;

  Activity.initialize((data) => {
    screen.setStats(data);
  });
}

const setMode = () => {
  Settings.set("mode", mode);

  screen.setMode(mode);

  if (heartRate) {
    heartRate.enable(mode === modes.HR);
  }

  if (mode === modes.OFF || mode === modes.HR || mode === modes.DATE) {
    Activity.stopTracking();
  } else {
    Activity.startTracking();
  }
};

document.getElementById("face").addEventListener("click", () => {
  mode = (mode + 1) % Object.keys(modes).length;
  setMode();
});

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function (evt) {
  const { key, value } = evt.data;

  Settings.set(key, value);

  if (key === "color") {
    screen.setColor(value);
  }
});

// Register for the unload event
me.addEventListener("unload", Settings.save);

// Activate current mode
setMode();

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  display.aodAllowed = true;

  display.addEventListener("change", () => {
    if (display.on && !display.aodActive) {
      // Display is ON and AOD is NOT ACTIVE
      screen.aod(false);
      if (mode !== modes.OFF && mode !== modes.HR && mode !== modes.DATE) {
        Activity.startTracking();
      }
    } else {
      // Display is OFF or AOD IS ACTIVE
      screen.aod(true);
      Activity.stopTracking();
    }
  });
}
