# Langchain Instrumentation Example

This is an example of how to instrument a Langchain model with OpenInference and Arize.

## Installation

```bash
npm install
```

OR

```bash
npm install --save @arizeai/openinference-instrumentation-langchain @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node @opentelemetry/resources @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/api @grpc/grpc-js @langchain/core @langchain/openai
```

## Usage

Update the `openai-api-key`, `arize-space-id`, `arize-api-key`, `arize-model-id`, and `arize-model-version` strings in the `index.js` file.

```bash
node index.js
```
