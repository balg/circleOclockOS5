import { me } from "appbit";
import clock from "clock";
import * as messaging from "messaging";
import Screen from "./screen";
import * as Settings from "./settings";
import * as HeartRate from "./heartrate";

const screen = new Screen();
Settings.load();
screen.setColor(Settings.get("color"));

clock.granularity = "minutes";
clock.ontick = (evt) => {
  screen.refreshTime(evt.date);
};

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
