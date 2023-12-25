import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_SERVICEROLE as string
);

const transporter = nodemailer.createTransport({
  host: process.env.VITE_NODEMAILER_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.VITE_NODEMAILER_USER,
    pass: process.env.VITE_NODEMAILER_PASS,
  },
});

const handler: Handler = async (event, context) => {
  const data = JSON.parse(event.body as string);
  const user = await supabase.auth.admin.getUserById(data.to);
  try {
    // Email content
    const mailOptions = {
      from: "admin@gubler-it.com",
      to: user.data.user?.email,
      subject: data.subject,
      text: data.text,
      html: `<h1>Message:</h1><p>${data.text}</p>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully", info }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
