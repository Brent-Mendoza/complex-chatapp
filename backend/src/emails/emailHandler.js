import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Brent's ChatApp",
    html: createWelcomeEmailTemplate(name, clientURL),
  })

  if (error) {
    console.log(error)
    throw new Error(error)
  }

  console.log("Welcome email sent successfully", data)
}
