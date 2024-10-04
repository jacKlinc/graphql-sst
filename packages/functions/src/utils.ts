export const sendHttp = (statusCode: number, message: object): { statusCode: number, body: string } => {
    return {
        statusCode,
        body: JSON.stringify(message),
    };
}
