import { me } from "appbit";
import clock from "clock";
import * as messaging from "messaging";
import Screen from "./screen";
import * as fs from "fs";
import clock from "clock";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

const screen = new Screen();
const settings = loadSettings();

screen.setColor(settings.color);

clock.granularity = "minutes";
clock.ontick = (evt) => {
  screen.refreshTime(evt.date);
};

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function (evt) {
  settings[evt.data.key] = evt.data.value;
  screen.setColor(settings.color);
});

// Register for the unload event
me.addEventListener("unload", saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {
      color: "cyan",
    };
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
