"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

type Props = {
  value: number;
  className?: string;
};

export default function AnimatedCounter({ value, className }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <span className={className}>-</span>;

  return (
    <CountUp
      end={value}
      decimals={0}
      preserveValue
      duration={0.5}
      className={className}
    />
  );
}
