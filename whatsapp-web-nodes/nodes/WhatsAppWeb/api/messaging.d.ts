import { IExecuteFunctions, INode, INodeExecutionData } from "n8n-workflow";
export declare function validateChatId(node: INode, chatId: string): void;
export declare function validateContactId(node: INode, contactId: string): void;
export declare function validateMessageId(node: INode, messageId: string | undefined): void;
export declare function parseContactBody(this: IExecuteFunctions, i: number): {
    type: string;
    contactIds: string[];
};
export declare function parseMessageBody(this: IExecuteFunctions, item: INodeExecutionData, i: number): Promise<{
    type: string;
    contactIds: string[];
} | {
    type: string;
    address: string;
    latitude: number;
    longitude: number;
    name: string;
    url: string;
} | {
    type: string;
    mediaId: any;
    sendAudioAsVoice: boolean;
    sendVideoAsGif: boolean;
    sendMediaAsSticker: boolean;
    sendMediaAsDocument: boolean;
    isViewOnce: boolean;
    caption: string | undefined;
    stickerAuthor: string | undefined;
    stickerName: string | undefined;
    stickerCategories: string[];
} | {
    type: string;
    name: string;
    options: string[];
    allowMultipleAnswers: boolean;
} | {
    type: string;
    text: string;
}>;
export declare function sendMessage(this: IExecuteFunctions, message: any): Promise<any>;
