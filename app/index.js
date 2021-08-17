import { me } from "appbit";
import clock from "clock";
import * as document from "document";
import * as messaging from "messaging";
import HeartRate from "./heartrate";
import Screen from "./screen";
import * as Settings from "./settings";

const modes = {
  OFF: 0,
  HR: 1,
}
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

document.getElementById("face").addEventListener("click", () => {
  mode = (mode + 1) % Object.keys(modes).length;

  screen.setMode(mode);
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
