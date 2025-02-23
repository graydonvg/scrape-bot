import { ReactNode } from "react";
import WorkflowFooter from "./workflow-footer";

type Props = {
  children: ReactNode;
};

export default function WorkflowLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-full flex-col">
      {children}
      <WorkflowFooter />
    </div>
  );
}
