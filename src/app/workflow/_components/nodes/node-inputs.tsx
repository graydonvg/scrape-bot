import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function NodeInputs({ children }: Props) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
}
