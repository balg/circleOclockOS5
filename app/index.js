import { me } from "appbit";
import clock from "clock";
import * as messaging from "messaging";
import * as document from "document";
import Screen from "./screen";
import * as Settings from "./settings";
import * as HeartRate from "./heartrate";

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

document.getElementById("face").addEventListener("click", () => {
  mode = (mode + 1) % Object.keys(modes).length;

  screen.setMode(mode);
  HeartRate.enable(mode === modes.HR);
})

if (me.permissions.granted("access_heart_rate")) {
  HeartRate.init((value) => {
    screen.refreshStat(value);
  });
}

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
