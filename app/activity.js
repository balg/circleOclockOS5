import clock from "clock";
import { today } from "user-activity";
import { units } from "user-settings";
import { modes } from "./screen";

let activityCallback;

const getSteps = () => today.adjusted.steps || 0;

const getCalories = () => today.adjusted.calories || 0;

const getDistance = () => {
  let distance = (today.adjusted.distance || 0) / 1000;
  let unit = "km";

  if (units.distance === "us") {
    distance *= 0.621371;
    unit = "mi";
  }

  return `${distance.toFixed(2)} ${unit}`;
};

const getElevationGain = () =>
  (today.local.elevationGain !== undefined && today.adjusted.elevationGain) ||
  0;

const getActiveMinutes = () => today.adjusted.activeZoneMinutes?.total || 0;

const tickEventHandler = () => {
  activityCallback({
    [modes.STEPS]: getSteps(),
    [modes.CAL]: getCalories(),
    [modes.DIST]: getDistance(),
    [modes.FLOOR]: getElevationGain(),
    [modes.AZM]: getActiveMinutes(),
  });
};

export const initialize = (callback) => {
  activityCallback = callback;

  clock.granularity = "seconds";
};

export const startTracking = () => {
  if (activityCallback) {
    clock.addEventListener("tick", tickEventHandler);
  }
};

export const stopTracking = () => {
  clock.removeEventListener("tick", tickEventHandler);
};
