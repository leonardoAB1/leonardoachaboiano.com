export interface SkillGroup {
  categoryKey: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    categoryKey: "programming",
    skills: [
      "Python",
      "C/C++",
      "Cython",
      "PyQt",
      "MATLAB",
      "Verilog/VHDL",
      "LaTeX",
    ],
  },
  {
    categoryKey: "embeddedRobotics",
    skills: [
      "STM32",
      "ESP32",
      "Arduino",
      "ROS2",
      "OpenCV",
      "FreeRTOS",
      "Zephyr",
      "Robot Operator",
      "BLE",
      "CAN",
      "EtherCAT",
      "MQTT",
    ],
  },
  {
    categoryKey: "electronicsPcb",
    skills: ["KiCad", "Altium", "Proteus", "LTSpice", "Soldering"],
  },
  {
    categoryKey: "mechanicalDesign",
    skills: [
      "SolidWorks",
      "Fusion 360",
      "AutoCAD",
      "DFMA",
      "GD&T",
      "CNC Lathe",
      "3D Printing",
    ],
  },
  {
    categoryKey: "tools",
    skills: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Linux",
      "Industrial Instrumentation",
      "PLC (Tia Portal)",
      "Ladder",
      "FBD",
      "P&ID",
      "FluidSIM",
    ],
  },
];

// Flat list used for JSON-LD knowsAbout in PersonSchema
export const allSkills = skillGroups.flatMap(({ skills }) => skills);
