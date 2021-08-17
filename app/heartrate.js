import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

class HeartRate {
  hrs;
  body;
  isOn;

  constructor(isOn) {
    this.isOn = isOn;
  }

  init(onReading) {
    this.hrs = new HeartRateSensor({ frequency: 1, batch: 2 });
  
    if (BodyPresenceSensor) {
      this.body = new BodyPresenceSensor();
  
      this.body.addEventListener("reading", () => {
        if (this.body.present && this.isOn) {
          this.startSensor(this.hrs);
        } else {
          this.stopSensor(this.hrs);
        }
      });
    }
  
    this.hrs.addEventListener("reading", () => {
      onReading(this.hrs.heartRate);
    });
  
    display.addEventListener("change", () => {
      if (display.on && this.isOn) {
        this.startSensor(this.hrs);
        this.startSensor(this.body);
      } else {
        this.stopSensor(this.body);
        this.stopSensor(this.hrs);
      }
    });
  
    if (this.isOn) {
      this.startSensor(this.hrs);
      this.startSensor(this.body);
    }
  };

  enable(isOn) {
    this.isOn = isOn;
    if (this.isOn) {
      this.startSensor(this.hrs);
      this.startSensor(this.body);
    } else {
      this.stopSensor(this.hrs);
      this.stopSensor(this.body);
    }
  }

  startSensor(sensor) {
    if (sensor && !sensor.activated) {
      // sensor can be undefined if not avail, example: body
      sensor.start();
    }
  };
  
  stopSensor(sensor) {
    if (sensor?.activated) {
      sensor.stop();
    }
  };
}

export default HeartRate;