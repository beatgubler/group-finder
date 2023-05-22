import { createClient } from "@supabase/supabase-js";
import Column from "../layout/column";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

function Group() {
  const { id } = useParams();
  const formik = useRef<any>();
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();

  useEffect(() => {
    if (id) {
      getGroup();
    } else {
      formik.current.resetForm();
    }
  }, [id]);

  async function getGroup() {
    const { data } = await supabase.from("groups").select().eq("id", id).limit(1).single();
    formik.current.setValues({ title: data?.title, description: data?.desc, category: data?.category });
  }

  return (
    <>
      <Column>
        <div className="border p-2 rounded col-start-1 col-span-6 md:col-start-2 md:col-span-4 border-slate-500 bg-mainColor">
          <h1 className="text-xl font-bold pb-4">{id ? "Edit group" : "Add group"}</h1>
          <div className="pb-4">
            <p className="text-red-500">Do not share any sensitive information like email, phonenumber, address etc.</p>
          </div>
          <Formik
            initialValues={{ title: "", description: "", category: "" }}
            onSubmit={async (values) => {
              if (id) {
                await supabase
                  .from("groups")
                  .update({ title: values.title, desc: values.description, category: values.category })
                  .eq("id", id)
                  .then((res) => {
                    if (!res.error) {
                      setFormSuccess("group updated");
                      setFormError("");
                    } else {
                      setFormError("error updating group");
                      setFormSuccess("");
                    }
                    formik.current.resetForm();
                  });
                // navigate("/");
              } else {
                await supabase
                  .from("groups")
                  .insert([{ title: values.title, desc: values.description, category: values.category }])
                  .then((res) => {
                    if (!res.error) {
                      setFormSuccess("group created");
                      setFormError("");
                    } else {
                      setFormError("error creating group");
                      setFormSuccess("");
                    }
                    formik.current.resetForm();
                  });
                // navigate("/");
              }
            }}
            validationSchema={Yup.object({
              title: Yup.string().min(4).required(),
              description: Yup.string().min(4).required(),
              category: Yup.string().required(),
            })}
            innerRef={formik}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="flex flex-wrap flex-col">
                <label>Title:</label>
                <Field
                  type="title"
                  name="title"
                  className={`border w-full rounded bg-mainColor p-2 ${
                    touched.title && errors.title ? "border-red-500" : "border-slate-500"
                  }`}
                />
                <ErrorMessage component="p" name="title" className="text-red-500 text-xs" />

                <label>Description:</label>
                <Field
                  as="textarea"
                  type="description"
                  name="description"
                  className={`border w-full rounded bg-mainColor p-2 ${
                    touched.description && errors.description ? "border-red-500" : "border-slate-500"
                  }`}
                />
                <ErrorMessage component="p" name="description" className="text-red-500 text-xs" />

                <label>Category:</label>
                <Field
                  as="select"
                  name="category"
                  className={`border w-full rounded bg-mainColor p-2  ${
                    touched.category && errors.category ? "border-red-500" : "border-slate-500"
                  }`}
                >
                  <option value=""></option>
                  <option value="hobby">hobby</option>
                  <option value="outdoor">outdoor</option>
                  <option value="gaming">gaming</option>
                  <option value="friendship">friendship</option>
                  <option value="other">...other</option>
                </Field>
                <ErrorMessage component="p" name="category" className="text-red-500 text-xs" />

                <button
                  type="submit"
                  className="border p-2 mt-4 rounded cursor-pointer border-slate-500 hover:bg-mainColorLight disabled:cursor-wait disabled:hover:bg-inherit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
                {formError ? <p className="text-red-500 text-xs">{formError}</p> : null}
                {formSuccess ? <p className="text-green-500 text-xs">{formSuccess}</p> : null}
              </Form>
            )}
          </Formik>
        </div>
      </Column>
    </>
  );
}

export default Group;
