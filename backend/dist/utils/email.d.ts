export declare class Email {
    to: string;
    firstName: string;
    url: string;
    from: string;
    constructor(user: {
        email: string;
        name: string;
    }, url: string);
    newTransport(): any;
    send(template: string, subject: string, data?: any): Promise<void>;
    sendWelcome(): Promise<void>;
    sendPasswordReset(): Promise<void>;
    sendOrderConfirmation(order: any): Promise<void>;
    sendOrderStatusUpdate(order: any): Promise<void>;
    sendNewsletter(newsletter: any): Promise<void>;
}
