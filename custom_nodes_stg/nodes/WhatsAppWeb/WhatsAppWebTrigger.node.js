"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppWebTrigger = void 0;
const webHooks_1 = require("./api/webHooks");
class WhatsAppWebTrigger {
    constructor() {
        this.description = {
            displayName: "WhatsApp Web Trigger",
            name: "whatsAppWebTrigger",
            icon: { light: "file:whatsappweb_light.svg", dark: "file:whatsappweb_dark.svg" },
            group: ["trigger"],
            version: 1,
            description: "Handle WhatsApp Web events",
            defaults: {
                name: "WhatsApp Web Trigger",
            },
            inputs: [],
            outputs: ["main"],
            credentials: [
                {
                    name: "whatsAppWebApi",
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                }
            ],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Message Received',
                            value: 'message',
                            description: 'Triggered when a WhatsApp message is received',
                        },
                        {
                            name: 'Message Sent',
                            value: 'selfMessage',
                            description: 'Triggered when a WhatsApp message is sent by you',
                        }
                    ],
                    default: 'message',
                    required: true,
                    description: 'Event that this node listens to',
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhooks = await webHooks_1.getWebhooks.call(this);
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    for (const webhook of webhooks) {
                        if (webhook.url === webhookUrl) {
                            const webhookData = this.getWorkflowStaticData('node');
                            webhookData.webhookId = webhook.id;
                            return true;
                        }
                    }
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const result = await webHooks_1.subscribeWebhook.call(this, webhookUrl);
                    if (result.id === undefined)
                        return false;
                    const webhookData = this.getWorkflowStaticData('node');
                    webhookData.webhookId = result.id;
                    return true;
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId === undefined)
                        return true;
                    const result = await webHooks_1.deleteWebhook.call(this, webhookData.webhookId);
                    if (!result.success)
                        return false;
                    return false;
                },
            },
        };
    }
    async webhook() {
        const body = this.getBodyData();
        const eventType = this.getNodeParameter('event', 'message');
        if (body.type !== eventType)
            return {};
        if (!body.data.hasMedia || !body.data.media.saved) {
            return { workflowData: [this.helpers.returnJsonArray(body)] };
        }
        const credentials = await this.getCredentials("whatsAppWebApi");
        const url = `${credentials.apiUrl}${body.data.media.fileLocation}`;
        const file = await this.helpers.request({
            headers: { Authorization: `Bearer ${credentials.apiKey}` },
            json: false,
            encoding: null,
            url: url,
            resolveWithFullResponse: true,
            method: 'GET',
        });
        const data = Buffer.from(file.body);
        const fileName = body.data.media.fileLocation.split('/').pop();
        const binaryData = await this.helpers.prepareBinaryData(data, fileName);
        return {
            workflowData: [
                [
                    {
                        json: body,
                        binary: {
                            messageMedia: binaryData,
                        },
                    },
                ],
            ],
        };
    }
}
exports.WhatsAppWebTrigger = WhatsAppWebTrigger;
//# sourceMappingURL=WhatsAppWebTrigger.node.js.map