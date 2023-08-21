export const encodeTemplate = (template: string | undefined) => {
    if (!template) { return undefined; }
    // encode with base64
    const encoded = Buffer.from(template).toString('base64');
    return encoded;
}
