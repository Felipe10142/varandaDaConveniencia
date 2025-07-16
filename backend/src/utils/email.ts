// @ts-ignore
import nodemailer from "nodemailer";
// @ts-ignore
import pug from "pug";
// @ts-ignore
import { htmlToText } from "html-to-text";

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Varanda da Conveniência <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Configuración para servicio de email en producción (ejemplo: SendGrid)
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Configuración para desarrollo usando Mailtrap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string, data: any = {}) {
    // 1) Renderizar HTML basado en plantilla pug
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      ...data,
    });

    // 2) Definir opciones de email
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Crear transport y enviar email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "¡Bienvenido a Varanda da Conveniência!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Su token de restablecimiento de contraseña (válido por 10 minutos)",
    );
  }

  async sendOrderConfirmation(order: any) {
    await this.send("orderConfirmation", "Confirmación de su pedido", {
      order,
      orderNumber: order._id,
    });
  }

  async sendOrderStatusUpdate(order: any) {
    await this.send("orderStatus", `Actualización de su pedido #${order._id}`, {
      order,
      status: order.status,
    });
  }

  async sendNewsletter(newsletter: any) {
    await this.send("newsletter", newsletter.subject, {
      content: newsletter.content,
    });
  }
}
