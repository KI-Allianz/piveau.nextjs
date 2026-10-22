export interface TraceStep {
  step: "tool_call" | "tool_result" | "final_synthesis";
  tool?: string;
  arguments?: Record<string, any>;
  output_preview?: string;
  content?: string;
  iteration?: number;
}

export interface AssistantResponse {
  response: string;
  trace: TraceStep[];
}
