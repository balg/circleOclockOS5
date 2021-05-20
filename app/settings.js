import * as fs from "fs";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings = {
  color: "cyan",
};

export const load = () => {
  try {
    settings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.log("No settings file, using defaults");
  }
};

export const get = (key) => settings[key];

export const set = (key, value) => {
  settings[key] = value;
};

export const save = () => {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
};
