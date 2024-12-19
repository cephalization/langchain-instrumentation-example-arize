import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import {
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"; // Arize specific
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { Metadata } from "@grpc/grpc-js";
import { ChatOpenAI } from "@langchain/openai";
import * as CallbackManagerModule from "@langchain/core/callbacks/manager";

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Arize specific - Create metadata and add your headers
const metadata = new Metadata();

// Your Arize Space and API Keys, which can be found in the UI
metadata.set("space_id", "arize-space-id");
metadata.set("api_key", "arize-api-key");

const provider = new NodeTracerProvider({
  resource: new Resource({
    // Arize specific - The name of a new or preexisting model you
    // want to export spans to
    model_id: "arize-model-id",
    model_version: "arize-model-version",
  }),
  spanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new SimpleSpanProcessor(
      new GrpcOTLPTraceExporter({
        url: "https://otlp.arize.com/v1",
        metadata,
      })
    ),
  ],
});

const lcInstrumentation = new LangChainInstrumentation();
// LangChain must be manually instrumented as it doesn't have
// a traditional module structure
lcInstrumentation.manuallyInstrument(CallbackManagerModule);

provider.register();

// Define the LangChain chat model
const chatModel = new ChatOpenAI({
  openAIApiKey: "openai-api-key",
  modelName: "gpt-3.5-turbo",
});

// Perform an invocation using LangChain with thread tracking
async function runChat() {
  // Pass `thread_id` to track this conversation thread
  const response = await chatModel.invoke("test message", {
    metadata: {
      thread_id: "thread-456",
    },
  });

  console.log("Response:", response);
}

// Run the chat function with error handling
runChat().catch((err) => {
  console.error("Error during chat invocation:", err);
});
