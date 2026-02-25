#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initClient } from "./services/boond-client.js";
import {
  registerCandidateTools,
  registerResourceTools,
  registerContactTools,
  registerCompanyTools,
  registerOpportunityTools,
  registerActionTools,
  registerTimesheetTools,
  registerProjectTools,
  registerInvoiceTools,
  registerOrderTools,
  registerDeliveryTools,
  registerAbsenceTools,
  registerExpenseTools,
  registerProductTools,
  registerPositioningTools,
  registerPaymentTools,
  registerAdvantageTools,
  registerApplicationTools,
  registerContractTools,
  registerPurchaseTools,
  registerProviderInvoiceTools,
  registerAccountTools,
  registerAgencyTools,
  registerBusinessUnitTools,
  registerRoleTools,
  registerLogTools,
  registerNotificationTools,
  registerThreadTools,
  registerTodolistTools,
  registerFlagTools,
  registerCalendarTools,
  registerWebhookTools,
  registerValidationTools,
  registerPoleTools,
  registerReportingTools,
  registerPlanningAbsenceTools,
} from "./tools/index.js";

const server = new McpServer({
  name: "boondmanager-mcp-server",
  version: "1.0.0",
});

// Register all domain tools
registerCandidateTools(server);
registerResourceTools(server);
registerContactTools(server);
registerCompanyTools(server);
registerOpportunityTools(server);
registerActionTools(server);
registerTimesheetTools(server);
registerProjectTools(server);
registerInvoiceTools(server);
registerOrderTools(server);
registerDeliveryTools(server);
registerAbsenceTools(server);
registerExpenseTools(server);
registerProductTools(server);
registerPositioningTools(server);
registerPaymentTools(server);
registerAdvantageTools(server);
registerApplicationTools(server);
registerContractTools(server);
registerPurchaseTools(server);
registerProviderInvoiceTools(server);
registerAccountTools(server);
registerAgencyTools(server);
registerBusinessUnitTools(server);
registerRoleTools(server);
registerLogTools(server);
registerNotificationTools(server);
registerThreadTools(server);
registerTodolistTools(server);
registerFlagTools(server);
registerCalendarTools(server);
registerWebhookTools(server);
registerValidationTools(server);
registerPoleTools(server);
registerReportingTools(server);
registerPlanningAbsenceTools(server);

// Initialize and run
async function main(): Promise<void> {
  try {
    initClient();
  } catch (error) {
    console.error("⚠️  Configuration warning:", (error as Error).message);
    console.error("The server will start but API calls will fail without proper credentials.");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 BoondManager MCP Server running (stdio transport)");
  console.error("📦 Domains: candidates, resources, contacts, companies, opportunities, actions, timesheets, projects, invoices, orders, deliveries, absences, expenses, products, positionings, payments, advantages, application, contracts, purchases, provider-invoices, accounts, agencies, business-units, roles, logs, notifications, threads, todolists, flags, calendars, webhooks, validations, poles, reporting, planning-absences");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
