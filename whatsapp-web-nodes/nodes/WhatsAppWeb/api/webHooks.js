"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = request;
exports.getWebhooks = getWebhooks;
exports.subscribeWebhook = subscribeWebhook;
exports.deleteWebhook = deleteWebhook;
const n8n_workflow_1 = require("n8n-workflow");
async function request(method, endpoint, body) {
    const credentials = await this.getCredentials("whatsAppWebApi");
    const options = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${credentials.apiKey}`,
        },
        method: method,
        body: body,
        json: true,
        uri: `${credentials.apiUrl}${endpoint}`,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function getWebhooks() {
    return request.call(this, 'GET', '/webhook');
}
async function subscribeWebhook(webhookUrl) {
    return request.call(this, 'POST', '/webhook/subscribe', { url: webhookUrl });
}
async function deleteWebhook(webhookId) {
    return request.call(this, 'DELETE', `/webhook/${webhookId}`);
}
//# sourceMappingURL=webHooks.js.map