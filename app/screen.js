import document from "document";
import { colors, gradients } from "../common/colors";
import { months } from "./utils";

export const modes = {
  OFF: 0,
  HR: 1,
  CAL: 2,
  STEPS: 3,
  DIST: 4,
  FLOOR: 5,
  AZM: 6,
  DATE: 7,
};

const iconName = {
  [modes.HR]: "heart_rate",
  [modes.CAL]: "calories",
  [modes.STEPS]: "steps",
  [modes.DIST]: "distance",
  [modes.FLOOR]: "floors",
  [modes.AZM]: "azm",
  [modes.DATE]: "calendar",
};

class Screen {
  constructor() {
    this.hoursArc = document.getElementById("hours");
    this.minutesArc = document.getElementById("minutes");
    this.gradientItems = document.getElementsByClassName("gradient");
    this.solidItems = document.getElementsByClassName("solid-color");
    this.mode = modes.OFF;
    this.statLabel = document.getElementById("stat-label");
    this.statImage = document.getElementById("stat-image");
    this.stats = {
      [modes.DATE]: Screen.getDateText(new Date()),
    };
  }

  static getDateText(date) {
    const day = date.getDate();
    const month = date.getMonth();

    return `${months[month]} ${day}`;
  }

  refreshTime(date) {
    const hours = date.getHours() % 12 || 12;
    this.highlightHours(hours);
    this.highlightMinutes(date.getMinutes());

    this.setStats({
      [modes.DATE]: Screen.getDateText(date),
    });
  }

  refreshStatText() {
    this.statLabel.text = this.stats[this.mode] ?? "--";
  }

  setStats(data) {
    this.stats = {
      ...this.stats,
      ...data,
    };

    this.refreshStatText();
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

  setMode(mode) {
    this.statImage.style.display = mode === modes.OFF ? "none" : "inline";
    this.statLabel.style.display = mode === modes.OFF ? "none" : "inline";

    this.statImage.href =
      mode !== modes.OFF ? `icons/${iconName[mode]}_36px.png` : "";

    this.mode = mode;
    this.refreshStatText();
  }
}

export default Screen;
