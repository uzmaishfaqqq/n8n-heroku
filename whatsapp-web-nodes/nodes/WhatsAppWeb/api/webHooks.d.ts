import { IExecuteFunctions, IHookFunctions, IHttpRequestMethods, JsonObject } from "n8n-workflow";
export declare function request(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: JsonObject): Promise<any>;
export declare function getWebhooks(this: IHookFunctions): Promise<any>;
export declare function subscribeWebhook(this: IHookFunctions, webhookUrl: string): Promise<any>;
export declare function deleteWebhook(this: IHookFunctions, webhookId: string): Promise<any>;
