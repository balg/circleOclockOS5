import * as fs from "fs";
import { modes } from "./screen";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings = {
  color: "cyan",
  mode: modes.OFF,
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
