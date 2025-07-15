"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppWebApi = void 0;
class WhatsAppWebApi {
    constructor() {
        this.name = 'whatsAppWebApi';
        this.displayName = 'WhatsApp Web API';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: '',
                description: 'The base URL of the WhatsApp Web Server API. For example, "http://localhost:8080". Do not include trailing slashes!',
                required: true,
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                typeOptions: { password: true },
                description: 'The API key for authentication with the WhatsApp Web Server API',
                required: true,
            }
        ];
    }
}
exports.WhatsAppWebApi = WhatsAppWebApi;
//# sourceMappingURL=WhatsAppWebApi.credentials.js.map