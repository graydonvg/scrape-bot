import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SectionWrapper({ children }: Props) {
  return <section className="py-16 sm:py-18 md:py-24">{children}</section>;
}
