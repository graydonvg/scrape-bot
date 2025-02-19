import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function WorkflowLayout({ children }: Props) {
  return <div>{children}</div>;
}
