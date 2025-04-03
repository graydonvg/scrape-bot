import { TaskParamName, TaskType } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";
import { Edge } from "@xyflow/react";

export const homeConfig = {
  workflowDemo: {
    nodes: [
      {
        id: "c9c200ad-b98f-4f6e-a1f9-d75778d0cdfe",
        type: "node",
        dragHandle: ".drag-handle",
        position: { x: 0, y: 50 },
        data: {
          type: TaskType.GoToWebiste,
          inputs: {
            [TaskParamName.WebsiteUrl]: "https://quotes.toscrape.com/",
          },
        },
      },
      {
        id: "11d86737-e8a6-4ee4-9a3a-a3f7f7e7f0e8",
        type: "node",
        dragHandle: ".drag-handle",
        position: { x: 550, y: 50 },
        data: { type: TaskType.GetPageHtml, inputs: {} },
      },
      {
        id: "f6c55d4c-0ae2-459b-982c-37ebd46b0ddd",
        type: "node",
        dragHandle: ".drag-handle",
        position: { x: 1100, y: 0 },
        data: {
          type: TaskType.ExtractTextFromElement,
          inputs: {
            [TaskParamName.Selector]:
              "body > div > div:nth-child(2) > div.col-md-8 > div:nth-child(1) > span.text",
          },
        },
      },
      {
        id: "1252ebe1-1b13-4487-921f-5ca8c3a5445e",
        type: "node",
        dragHandle: ".drag-handle",
        position: { x: 1650, y: 50 },
        data: {
          type: TaskType.DeliverViaWebhook,
          inputs: {
            [TaskParamName.TargetUrl]: "https://yourtargeturl.com",
          },
        },
      },
    ] as WorkflowNode[],
    edges: [
      {
        source: "c9c200ad-b98f-4f6e-a1f9-d75778d0cdfe",
        sourceHandle: "Web page",
        target: "11d86737-e8a6-4ee4-9a3a-a3f7f7e7f0e8",
        targetHandle: "Web page",
        animated: true,
        markerEnd: {
          type: "arrowclosed",
          width: 16,
          height: 16,
          color: "var(--primary)",
        },
        id: "xy-edge__c9c200ad-b98f-4f6e-a1f9-d75778d0cdfeWeb page-11d86737-e8a6-4ee4-9a3a-a3f7f7e7f0e8Web page",
      },
      {
        source: "11d86737-e8a6-4ee4-9a3a-a3f7f7e7f0e8",
        sourceHandle: "HTML",
        target: "f6c55d4c-0ae2-459b-982c-37ebd46b0ddd",
        targetHandle: "HTML",
        animated: true,
        markerEnd: {
          type: "arrowclosed",
          width: 16,
          height: 16,
          color: "var(--primary)",
        },
        id: "xy-edge__11d86737-e8a6-4ee4-9a3a-a3f7f7e7f0e8HTML-f6c55d4c-0ae2-459b-982c-37ebd46b0dddHTML",
      },
      {
        source: "f6c55d4c-0ae2-459b-982c-37ebd46b0ddd",
        sourceHandle: "Extracted text",
        target: "1252ebe1-1b13-4487-921f-5ca8c3a5445e",
        targetHandle: "Body",
        animated: true,
        markerEnd: {
          type: "arrowclosed",
          width: 16,
          height: 16,
          color: "var(--primary)",
        },
        id: "xy-edge__f6c55d4c-0ae2-459b-982c-37ebd46b0dddExtracted text-1252ebe1-1b13-4487-921f-5ca8c3a5445eBody",
      },
    ] as Edge[],
  },
} as const;
