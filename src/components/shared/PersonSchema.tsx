import { siteConfig, socialLinks } from "@/lib/constants";

// All skills listed on the CV - kept here so search engines can index them
// even though they are displayed as icon-only chips in the UI.
const knowsAbout = [
  "Python",
  "C/C++",
  "MATLAB",
  "Verilog/VHDL",
  "LaTeX",
  "STM32",
  "ESP32",
  "ROS2",
  "FreeRTOS",
  "Zephyr",
  "BLE",
  "CAN",
  "I2C",
  "MQTT",
  "KiCad",
  "Altium",
  "Proteus",
  "LTSpice",
  "Breadboarding",
  "Soldering",
  "SolidWorks",
  "Fusion 360",
  "AutoCAD",
  "DFMA",
  "GD&T",
  "CNC Lathe",
  "3D Printing",
  "Laser Cutting",
  "Git/GitHub",
  "PLC (Tia Portal)",
  "Ladder",
  "FBD",
  "P&ID",
  "FluidSIM",
];

interface PersonSchemaProps {
  jobTitle: string;
}

export function PersonSchema({ jobTitle }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle,
    email: siteConfig.email,
    sameAs: [socialLinks.github, socialLinks.linkedin],
    knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD, no user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
