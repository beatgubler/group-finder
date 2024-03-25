import { createClient } from "@supabase/supabase-js";
import Column from "../layout/column";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Message() {
  const { id } = useParams();
  const [group, setGroup] = useState<{ [x: string]: any } | null>();
  const formik = useRef<any>();
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();

  useEffect(() => {
    getGroup();
  }, []);

  async function getGroup() {
    const { data } = await supabase
      .from("groups")
      .select()
      .eq("id", id)
      .limit(1)
      .single();
    setGroup(data);
  }

  return (
    <>
      <Column>
        <div className="border p-2 rounded col-start-1 col-span-6 md:col-start-2 md:col-span-4 border-slate-500 bg-mainColor">
          <h1 className="text-xl font-bold pb-4">
            Send message to: {group?.title}
          </h1>
          <div className="pb-4">
            <p>
              Remember to add a way to contact you eg. discord, telegram, etc.
            </p>
            <p className="text-red-500">
              Never share any sensitive information like email, phonenumber,
              address etc.
            </p>
          </div>

          <Formik
            initialValues={{ message: "" }}
            onSubmit={async (values) => {
              await fetch("/.netlify/functions/mail", {
                method: "POST",
                body: JSON.stringify({
                  to: group?.user_id,
                  group: group?.title,
                  text: values.message,
                }),
              }).then((res) => {
                if (res.ok) {
                  setFormSuccess("message sent successfully");
                } else {
                  setFormError("error when sending mail");
                }
                formik.current.resetForm();
              });
            }}
            validationSchema={Yup.object({
              message: Yup.string().min(20).required(),
            })}
            innerRef={formik}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="flex flex-wrap flex-col">
                <label>Message:*</label>
                <Field
                  as="textarea"
                  type="message"
                  name="message"
                  className={`border w-full rounded bg-mainColor p-2 ${
                    touched.message && errors.message
                      ? "border-red-500"
                      : "border-slate-500"
                  }`}
                />
                <ErrorMessage
                  component="p"
                  name="message"
                  className="text-red-500 text-xs"
                />

                <button
                  type="submit"
                  className="border p-2 mt-4 rounded cursor-pointer border-slate-500 hover:bg-mainColorLight disabled:cursor-wait disabled:hover:bg-inherit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
                {formError ? (
                  <p className="text-red-500 text-xs">{formError}</p>
                ) : null}
                {formSuccess ? (
                  <p className="text-green-500 text-xs">{formSuccess}</p>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      </Column>
    </>
  );
}

export default Message;
