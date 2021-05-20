import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

class Settings {
  settings = {
    color: "cyan",
  };

  constructor() {
    let settingsFromFile;

    try {
      settingsFromFile = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    } catch (ex) {
      console.log("Could not read settings file.");
    }

    if (settingsFromFile) {
      this.settings = settingsFromFile;
    }
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
  }

  save() {
    console.log("Saving settings to file");
    fs.writeFileSync(SETTINGS_FILE, this.settings, SETTINGS_TYPE);
  }
}

export default Settings;
