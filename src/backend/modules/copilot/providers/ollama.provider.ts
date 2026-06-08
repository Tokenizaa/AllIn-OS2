import { OllamaChatRequest, OllamaChatResponse, OllamaModel } from "../dto/copilot.dto";

export class OllamaProvider {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = "http://localhost:11434", model: string = "tinyllama") {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      console.error("[OllamaProvider] Health check failed:", error);
      return false;
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("[OllamaProvider] Failed to list models:", error);
      return [];
    }
  }

  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: request.messages,
          stream: request.stream || false,
          options: {
            temperature: request.options?.temperature || 0.3,
            num_ctx: request.options?.num_ctx || 2048,
            num_predict: request.options?.num_predict || 512,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[OllamaProvider] Chat failed:", error);
      throw error;
    }
  }

  async chatStream(request: OllamaChatRequest, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: request.messages,
          stream: true,
          options: {
            temperature: request.options?.temperature || 0.3,
            num_ctx: request.options?.num_ctx || 2048,
            num_predict: request.options?.num_predict || 512,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              onChunk(data.message.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error("[OllamaProvider] Stream chat failed:", error);
      throw error;
    }
  }

  setModel(model: string): void {
    this.model = model;
  }

  getModel(): string {
    return this.model;
  }
}

export const ollamaProvider = new OllamaProvider();
