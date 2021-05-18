import { me } from "appbit";
import * as messaging from "messaging";
import * as fs from "fs";
import clock from "clock";
import document from "document";
import { colors, gradients } from "../common/colors";

clock.granularity = "minutes";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

const hoursArc = document.getElementById("hours");
const minutesArc = document.getElementById("minutes");

const settings = loadSettings();
setColor(settings.color);

clock.ontick = (evt) => {
  let hours = evt.date.getHours();
  hours = hours % 12 || 12;
  highlightHours(hours);
  highlightMinutes(evt.date.getMinutes());
};

// Received message containing settings data
messaging.peerSocket.addEventListener("message", function (evt) {
  settings[evt.data.key] = evt.data.value;
  setColor(settings.color);
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

function highlightMinutes(minutes) {
  // 1 minute = 6 degrees
  minutesArc.sweepAngle = minutes * 6;
}

function highlightHours(hours) {
  // 1 hour = 30 degrees
  hoursArc.sweepAngle = hours * 30;
}

function setColor(color) {
  const coloredItems = document.getElementsByClassName("gradient");
  let color1 = colors.cyan.color;
  let color2 = colors.cyan.color;
  if (color) {
    color1 = gradients[color]?.color || colors[color]?.color || color;
    color2 = gradients[color]?.color2 || colors[color]?.color || color;
  }
  coloredItems.forEach((item) => {
    item.gradient.colors.c1 = color1;
    item.gradient.colors.c2 = color2;
  });
}
