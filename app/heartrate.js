import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

let hrs;
let body;

const startSensor = (sensor) => {
  if (sensor && !sensor.activated) {
    // sensor can be undefined if not avail, example: body
    sensor.start();
  }
};

const stopSensor = (sensor) => {
  if (sensor?.activated) {
    sensor.stop();
  }
};

export const init = (onReading) => {
  hrs = new HeartRateSensor({ frequency: 1, batch: 2 });

  if (BodyPresenceSensor) {
    body = new BodyPresenceSensor();

    body.addEventListener("reading", () => {
      if (body.present) {
        startSensor(hrs);
      } else {
        stopSensor(hrs);
      }
    });
  }

  hrs.addEventListener("reading", () => {
    onReading(hrs.heartRate);
  });

  display.addEventListener("change", () => {
    if (display.on) {
      startSensor(hrs);
      startSensor(body);
    } else {
      stopSensor(body);
      stopSensor(hrs);
    }
  });

  startSensor(hrs);
  startSensor(body);
};

export const enable = (isOn) => {
  if (isOn) {
    startSensor(hrs);
    startSensor(body);
  } else {
    stopSensor(hrs);
    stopSensor(body);
  }
}