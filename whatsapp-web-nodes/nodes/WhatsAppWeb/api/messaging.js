"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChatId = validateChatId;
exports.validateContactId = validateContactId;
exports.validateMessageId = validateMessageId;
exports.parseContactBody = parseContactBody;
exports.parseMessageBody = parseMessageBody;
exports.sendMessage = sendMessage;
const n8n_workflow_1 = require("n8n-workflow");
const webHooks_1 = require("./webHooks");
const mimetypes_json_1 = __importDefault(require("./mimetypes.json"));
const idRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.]+$/;
function validateChatId(node, chatId) {
    if (!chatId || chatId.length === 0)
        throw new n8n_workflow_1.NodeOperationError(node, 'Setting a chat id is required');
    if (!chatId.match(idRegex))
        throw new n8n_workflow_1.NodeOperationError(node, 'A chat id must be in the format <id>@<server> - for example 491242314@c.us');
}
function validateContactId(node, contactId) {
    if (!contactId || contactId.length === 0)
        throw new n8n_workflow_1.NodeOperationError(node, 'A contact id may not be blank');
    if (!contactId.match(idRegex))
        throw new n8n_workflow_1.NodeOperationError(node, 'A contact id must be in the format <id>@<server> - for example 491242314@c.us');
}
function validateMessageId(node, messageId) {
    if (!messageId || messageId.length === 0)
        return;
    if (!messageId.match(idRegex))
        throw new n8n_workflow_1.NodeOperationError(node, 'A message id must be in the format <id>@<server> - for example 491242314@c.us');
}
function parseContactBody(i) {
    const contactIds = this.getNodeParameter('contactIds', i);
    if (contactIds.length === 0)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one contact ID to send is required');
    contactIds.forEach((contactId) => validateContactId(this.getNode(), contactId));
    return {
        type: 'contact',
        contactIds: contactIds,
    };
}
function parseLocationBody(i) {
    return {
        type: 'location',
        address: this.getNodeParameter('locationOptions.locationAddress', i),
        latitude: this.getNodeParameter('latitude', i),
        longitude: this.getNodeParameter('longitude', i),
        name: this.getNodeParameter('locationOptions.locationName', i),
        url: this.getNodeParameter('locationOptions.locationUrl', i),
    };
}
async function parseMediaBody(item, i) {
    var _a;
    const items = this.getInputData();
    if (items.length === 0)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No input data was found');
    const binaryMediaName = this.getNodeParameter('binaryMediaName', i);
    const binaryData = item.binary[binaryMediaName];
    const fileName = (_a = binaryData.fileName) === null || _a === void 0 ? void 0 : _a.toString();
    if (!fileName)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The binary data "${binaryMediaName}" does not contain a file name`);
    if (!mimetypes_json_1.default.find(t => t === binaryData.mimeType))
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The mime type "${binaryData.mimeType}" is not supported by WhatsApp`);
    const mediaType = this.getNodeParameter('mediaType', i);
    const mimeSplit = binaryData.mimeType.split('/')[0];
    if (mediaType === 'audio' && mimeSplit !== 'audio' ||
        mediaType === 'video' && mimeSplit !== 'video' ||
        mediaType === 'image' && mimeSplit !== 'image' ||
        mediaType === 'document' && mimeSplit !== 'application')
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The mime type "${binaryData.mimeType}" does not match the selected media type "${mediaType}"`);
    const uploadData = binaryData.id ? (await this.helpers.getBinaryStream(binaryData.id)) : Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
    const credentials = await this.getCredentials('whatsAppWebApi');
    const response = await this.helpers.request({
        formData: {
            media: {
                value: uploadData,
                options: {
                    filename: fileName,
                    contentType: binaryData.mimeType,
                },
            }
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${credentials.apiKey}`,
        },
        method: 'POST',
        url: `${credentials.apiUrl}/media/upload`,
        json: true,
    });
    return {
        type: 'media',
        mediaId: response.mediaId,
        sendAudioAsVoice: this.getNodeParameter('sendAudioAsVoice', i, false),
        sendVideoAsGif: this.getNodeParameter('sendVideoAsGif', i, false),
        sendMediaAsSticker: this.getNodeParameter('sendMediaAsSticker', i, false),
        sendMediaAsDocument: this.getNodeParameter('sendMediaAsDocument', i, false),
        isViewOnce: this.getNodeParameter('isViewOnce', i, false),
        caption: this.getNodeParameter('caption', i, '') || undefined,
        stickerAuthor: this.getNodeParameter('stickerAuthor', i, '') || undefined,
        stickerName: this.getNodeParameter('stickerName', i, '') || undefined,
        stickerCategories: this.getNodeParameter('stickerCategories', i, []) || undefined,
    };
}
function parsePollBody(i) {
    const pollName = this.getNodeParameter('pollName', i);
    if (!pollName || pollName.length === 0)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'A poll name is required');
    const pollOptions = this.getNodeParameter('pollOptions', i);
    if (pollOptions.length <= 1)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least two poll options are required');
    pollOptions.forEach((option) => { if (!option || option.length === 0)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'A poll option may not be blank'); });
    return {
        type: 'poll',
        name: pollName,
        options: pollOptions,
        allowMultipleAnswers: this.getNodeParameter('allowMultipleAnswers', i),
    };
}
function parseTextBody(i) {
    const text = this.getNodeParameter('text', i);
    if (!text || text.length === 0)
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'A text message is required');
    return {
        type: 'text',
        text: text,
    };
}
async function parseMessageBody(item, i) {
    const contentType = this.getNodeParameter('contentType', i);
    switch (contentType) {
        case 'contact': return parseContactBody.call(this, i);
        case 'location': return parseLocationBody.call(this, i);
        case 'media': return await parseMediaBody.call(this, item, i);
        case 'poll': return parsePollBody.call(this, i);
        case 'text': return parseTextBody.call(this, i);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown content type "${contentType}"`);
}
async function sendMessage(message) {
    return webHooks_1.request.call(this, 'POST', '/message', message);
}
//# sourceMappingURL=messaging.js.map