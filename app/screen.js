import document from "document";
import { colors, gradients } from "../common/colors";

class Screen {
  constructor() {
    this.hoursArc = document.getElementById("hours");
    this.minutesArc = document.getElementById("minutes");
    this.gradientItems = document.getElementsByClassName("gradient");
    this.solidItems = document.getElementsByClassName("solid-color");
    this.statLabel = document.getElementById("stat-label");
  }

  refreshTime(date) {
    const hours = date.getHours() % 12 || 12;
    this.highlightHours(hours);
    this.highlightMinutes(date.getMinutes());
  }

  refreshStat(value) {
    this.statLabel.text = value;
  }

  setColor(color) {
    let color1 = colors.cyan.color;
    let color2 = colors.cyan.color;
    if (color) {
      color1 = gradients[color]?.color || colors[color]?.color || color;
      color2 = gradients[color]?.color2 || colors[color]?.color || color;
    }
    this.gradientItems.forEach((item) => {
      item.gradient.colors.c1 = color1;
      item.gradient.colors.c2 = color2;
    });
    this.solidItems.forEach((item) => {
      item.style.fill = color1;
    });
  }

  highlightMinutes(minutes) {
    // 1 minute = 6 degrees
    this.minutesArc.sweepAngle = minutes * 6;
  }

  highlightHours(hours) {
    // 1 hour = 30 degrees
    this.hoursArc.sweepAngle = hours * 30;
  }
}

export default Screen;
