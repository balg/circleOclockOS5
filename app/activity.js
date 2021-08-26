import clock from "clock";
import { today } from "user-activity";
import { modes } from "./screen";

let activityCallback;

const getSteps = () => today.adjusted.steps || 0;
const getCalories = () => today.adjusted.calories || 0;
const getDistance = () =>
  (today.adjusted.distance && (today.adjusted.distance / 1000).toFixed(2)) || 0;
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
