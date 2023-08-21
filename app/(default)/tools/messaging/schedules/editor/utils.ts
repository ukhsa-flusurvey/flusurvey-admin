export const encodeTemplate = (template: string | undefined) => {
    if (!template) { return undefined; }
    // encode with base64
    const encoded = Buffer.from(template).toString('base64');
    return encoded;
}

export const decodeTemplate = (encoded: string | undefined) => {
    if (!encoded) { return undefined; }
    // decode with base64
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return decoded;
}
