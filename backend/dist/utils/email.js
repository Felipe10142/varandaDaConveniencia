import nodemailer from "nodemailer";
import pug from "pug";
import { htmlToText } from "html-to-text";
export class Email {
    to;
    firstName;
    url;
    from;
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Varanda da Conveniência <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587"),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async send(template, subject, data = {}) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
            ...data,
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        };
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send("welcome", "¡Bienvenido a Varanda da Conveniência!");
    }
    async sendPasswordReset() {
        await this.send("passwordReset", "Su token de restablecimiento de contraseña (válido por 10 minutos)");
    }
    async sendOrderConfirmation(order) {
        await this.send("orderConfirmation", "Confirmación de su pedido", {
            order,
            orderNumber: order._id,
        });
    }
    async sendOrderStatusUpdate(order) {
        await this.send("orderStatus", `Actualización de su pedido #${order._id}`, {
            order,
            status: order.status,
        });
    }
    async sendNewsletter(newsletter) {
        await this.send("newsletter", newsletter.subject, {
            content: newsletter.content,
        });
    }
}
//# sourceMappingURL=email.js.map