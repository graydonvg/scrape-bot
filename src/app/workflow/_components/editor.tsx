"use client";

import { Workflow } from "@/lib/types";
import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import TopBar from "./top-bar/top-bar";

type Props = {
  workflow: Partial<Workflow>;
};

export default function Editor({ workflow }: Props) {
  return (
    <ReactFlowProvider>
      <TopBar />
      <main className="flex grow">
        <section className="flex grow">
          <Flow workflow={workflow} />
        </section>
      </main>
    </ReactFlowProvider>
  );
}
