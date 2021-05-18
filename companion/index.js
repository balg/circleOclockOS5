import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

settingsStorage.addEventListener("change", (evt) => {
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
  }
});

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue("color", settingsStorage.getItem("color"));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
