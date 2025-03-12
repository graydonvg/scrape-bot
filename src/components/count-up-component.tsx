"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

type Props = {
  value: number;
};

export default function CountUpComponent({ value }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "-";

  return <CountUp end={value} decimals={0} preserveValue duration={0.5} />;
}
