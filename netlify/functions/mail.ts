import { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "key-yourkeyhere" });
const supabase = createClient(process.env.VITE_SUPABASE_URL as string, process.env.VITE_SUPABASE_SERVICEROLE as string);

const handler: Handler = async (event: HandlerEvent) => {
  const data = JSON.parse(event.body as string);

  const user = await supabase.auth.admin.getUserById(data.to);

  return mg.messages
    .create(process.env.MAILGUN_API_URL as string, {
      from: data.from,
      to: user.data.user?.email,
      subject: data.subject,
      text: data.text,
      html: `<h1>Message:</h1><p>${data.text}</p>`,
    })
    .then((msg) => ({
      statusCode: 200,
      body: JSON.stringify({
        data: "mail sent",
      }),
    })) // logs response data
    .catch((err) => ({
      statusCode: 500,
      body: JSON.stringify({
        data: "error",
      }),
    }));
};

export { handler };
