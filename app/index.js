import { me } from "appbit";
import clock from "clock";
import * as document from "document";
import * as messaging from "messaging";
import { today } from "user-activity";
import HeartRate from "./heartrate";
import Screen, { modes } from "./screen";
import * as Settings from "./settings";

let mode = modes.OFF;

const screen = new Screen();
Settings.load();
screen.setColor(Settings.get("color"));

clock.granularity = "minutes";
clock.ontick = (evt) => {
  screen.refreshTime(evt.date);
};

let heartRate;
if (me.permissions.granted("access_heart_rate")) {
  heartRate = new HeartRate(mode === modes.HR);
  heartRate.init((value) => {
    screen.refreshStat(value);
  });
}

let todaysActivity;
if (me.permissions.granted("access_activity")) {
  todaysActivity = today.adjusted;
}

document.getElementById("face").addEventListener("click", () => {
  mode = (mode + 1) % Object.keys(modes).length;

  screen.setMode(mode);

  let statText;
  if (todaysActivity) {
    switch (mode) {
      case modes.CAL:
        statText = todaysActivity.calories;
        break;
      case modes.STEPS:
        statText = todaysActivity.steps;
        break;
      case modes.DIST:
        statText = todaysActivity.distance && (todaysActivity.distance / 1000).toFixed(2);
        break;
      case modes.FLOOR:
        if (today.local.elevationGain !== undefined) {
          statText = todaysActivity.elevationGain;
        }
        break;
      case modes.AZM:
          statText = todaysActivity.activeZoneMinutes?.total;
          break;
      case modes.HR:
      default:
        break;
    }
  }
  screen.refreshStat(statText ?? "--");

  if (heartRate) {
    heartRate.enable(mode === modes.HR);
  }
})

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
