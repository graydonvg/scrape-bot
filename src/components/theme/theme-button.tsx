"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion as m } from "motion/react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const raysVariants = {
  hidden: {
    strokeOpacity: 0,
  },
  visible: {
    strokeOpacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rayVariant = {
  hidden: {
    pathLength: 0,
  },
  visible: {
    pathLength: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const shineVariant = {
  hidden: {
    opacity: 0,
    scale: 2,
    strokeDasharray: "20, 100",
    strokeDashoffset: 100,
    filter: "blur(0px)",
  },
  visible: {
    opacity: [0, 1, 0],
    strokeDashoffset: [100, 140, 180],
    filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
    transition: {
      delay: 0.4,
      duration: 0.75,
      ease: "linear",
    },
  },
};

const moonPath =
  "M50 69.3333C60.6775 69.3333 69.3333 60.6775 69.3333 50C53.2661 55.7705 43.226 48.5326 50 30.6667C39.3225 30.6667 30.6667 39.3225 30.6667 50C30.6667 60.6775 39.3225 69.3333 50 69.3333Z";
const sunPath =
  "M50 69.3333C60.6775 69.3333 69.3333 60.6775 69.3333 50C69.3333 39.3225 60.6775 30.6667 50 30.6667C39.3225 30.6667 30.6667 39.3225 30.6667 50C30.6667 60.6775 39.3225 69.3333 50 69.3333Z";

export default function ThemeButton() {
  const mainPathRef = useRef<SVGPathElement>(null);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  useGSAP(
    () => {
      gsap.timeline().fromTo(
        mainPathRef.current,
        {
          fillOpacity: 0,
          strokeOpacity: 0,
          rotate: 0,
          scale: 1,
        },
        {
          fillOpacity: 0.35,
          strokeOpacity: 1,
          rotate: 360,
          stroke: isDarkMode ? "#2563eb" : "#ca8a04",
          fill: isDarkMode ? "#2563eb" : "#ca8a04",
          scale: isDarkMode ? 2 : 1,
          attr: {
            d: isDarkMode ? moonPath : sunPath,
          },
        },
      );
    },
    { dependencies: [currentTheme] },
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className="p-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:size-7"
      asChild
    >
      <m.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        strokeLinecap="round"
        strokeWidth={4}
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <m.path
          d={moonPath}
          variants={shineVariant}
          initial="hidden"
          animate={currentTheme === "dark" ? "visible" : "hidden"}
          className="absolute-center stroke-blue-100"
        />
        <m.path
          ref={mainPathRef}
          style={{ transformOrigin: "center center" }}
        />
        <m.g
          variants={raysVariants}
          initial="hidden"
          animate={currentTheme === "light" ? "visible" : "hidden"}
          className="stroke-yellow-600 stroke-2"
        >
          <m.path variants={rayVariant} d="M50 11.3333V1.66666" />
          <m.path variants={rayVariant} d="M77.3567 22.6433L84.1717 15.8283" />
          <m.path variants={rayVariant} d="M88.6667 50H98.3333" />
          <m.path variants={rayVariant} d="M77.3567 77.3567L84.1717 84.1717" />
          <m.path variants={rayVariant} d="M50 88.6667V98.3333" />
          <m.path variants={rayVariant} d="M22.6433 77.3567L15.8283 84.1717" />
          <m.path variants={rayVariant} d="M11.3333 50H1.66666" />
          <m.path variants={rayVariant} d="M22.6433 22.6433L15.8283 15.8283" />
        </m.g>
      </m.svg>
    </Button>
  );
}
