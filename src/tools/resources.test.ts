import { describe, it, expect, vi, beforeEach } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResourceTools } from "./resources.js";

function createMockServer() {
  return {
    registerTool: vi.fn(),
  } as unknown as McpServer;
}

describe("registerResourceTools", () => {
  let server: McpServer;

  beforeEach(() => {
    server = createMockServer();
  });

  it("should register CRUD tools + 10 tab tools = 15 total", () => {
    registerResourceTools(server);
    expect(server.registerTool).toHaveBeenCalledTimes(15);
  });

  it("should register all CRUD tools", () => {
    registerResourceTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_resources_search");
    expect(names).toContain("boond_resources_get");
    expect(names).toContain("boond_resources_create");
    expect(names).toContain("boond_resources_update");
    expect(names).toContain("boond_resources_delete");
  });

  it("should register all 10 tab tools", () => {
    registerResourceTools(server);
    const names = vi.mocked(server.registerTool).mock.calls.map((c) => c[0]);
    expect(names).toContain("boond_resources_information");
    expect(names).toContain("boond_resources_technical_data");
    expect(names).toContain("boond_resources_administrative");
    expect(names).toContain("boond_resources_advantages");
    expect(names).toContain("boond_resources_actions");
    expect(names).toContain("boond_resources_positionings");
    expect(names).toContain("boond_resources_projects");
    expect(names).toContain("boond_resources_times_reports");
    expect(names).toContain("boond_resources_expenses_reports");
    expect(names).toContain("boond_resources_absences_reports");
  });

  it("should register tab tools as readOnly and non-destructive", () => {
    registerResourceTools(server);
    const tabCalls = vi.mocked(server.registerTool).mock.calls.filter(
      (c) => typeof c[0] === "string" && [
        "boond_resources_information",
        "boond_resources_technical_data",
        "boond_resources_administrative",
        "boond_resources_advantages",
        "boond_resources_actions",
        "boond_resources_positionings",
        "boond_resources_projects",
        "boond_resources_times_reports",
        "boond_resources_expenses_reports",
        "boond_resources_absences_reports",
      ].includes(c[0] as string)
    );

    expect(tabCalls).toHaveLength(10);
    for (const call of tabCalls) {
      const [, metadata] = call;
      expect(metadata.annotations?.readOnlyHint).toBe(true);
      expect(metadata.annotations?.destructiveHint).toBe(false);
    }
  });
});
