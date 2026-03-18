import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { applicationPipeline } from "@/agents/orchestrator";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [applicationPipeline],
});
