import { createClient } from "@supabase/supabase-js";
import Column from "../layout/column";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

function Group() {
  const { id } = useParams();
  const formik = useRef<any>();
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getGroup();
    } else {
      formik.current.resetForm();
    }
  }, [id]);

  function getImageUrl(name: string) {
    const { data } = supabase.storage.from("images").getPublicUrl(name);
    return data.publicUrl;
  }

  async function getGroup() {
    const { data } = await supabase.from("groups").select().eq("id", id).limit(1).single();
    formik.current.setValues({ title: data?.title, description: data?.desc, category: data?.category });
  }

  async function insertGroup(data: { title: string; desc: string; category: string }) {
    let group: any;
    await supabase
      .from("groups")
      .insert([data])
      .select()
      .then((res) => {
        if (!res.error) {
          group = res;
        } else {
          setFormError("error creating group");
          setFormSuccess("");
        }
      });
    if (group?.data[0]) {
      await supabase.storage
        .from("images")
        .upload(group.data[0].id + ".png", file as File, {
          upsert: false,
        })
        .then((res) => {
          if (!res.error) {
            setFormSuccess("group created");
            setFormError("");
            navigate("/");
          } else {
            setFormError("error uploading picture");
            setFormSuccess("");
          }
        });
    }
    formik.current.resetForm();
  }

  async function updateGroup(data: { title: string; desc: string; category: string }) {
    await supabase
      .from("groups")
      .update(data)
      .eq("id", id)
      .then((res) => {
        if (!res.error) {
          return;
        } else {
          setFormError("error updating group");
          setFormSuccess("");
        }
      });
    await supabase.storage
      .from("images")
      .upload(id + ".png", file as File, {
        upsert: true,
      })
      .then((res) => {
        if (!res.error) {
          setFormSuccess("group updated");
          setFormError("");
          navigate("/");
        } else {
          setFormError("error uploading picture");
          setFormSuccess("");
        }
      });
    formik.current.resetForm();
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
            initialValues={{ title: "", description: "", category: "", picture: "" }}
            onSubmit={async (values) => {
              if (!file) {
                return;
              }
              if (id) {
                await updateGroup({ title: values.title, desc: values.description, category: values.category });
              } else {
                await insertGroup({ title: values.title, desc: values.description, category: values.category });
              }
            }}
            validationSchema={Yup.object({
              title: Yup.string().min(4).required(),
              description: Yup.string().min(4).required(),
              category: Yup.string().required(),
              picture: Yup.string().required("field is required or file is too big, max. 1MB"),
            })}
            innerRef={formik}
          >
            {({ isSubmitting, touched, errors, setFieldValue, setTouched, setErrors }) => (
              <Form className="flex flex-wrap flex-col gap-2">
                <div>
                  <label>Title:</label>
                  <Field
                    type="title"
                    name="title"
                    className={`border w-full rounded bg-mainColor p-2 ${
                      touched.title && errors.title ? "border-red-500" : "border-slate-500"
                    }`}
                  />
                  <ErrorMessage component="p" name="title" className="text-red-500 text-xs" />
                </div>
                <div>
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
                </div>
                <div>
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
                </div>

                <div>
                  <label>Group picture:</label>
                  {id && (
                    <img className="h-28 py-2 rounded aspect-square object-cover" src={getImageUrl(id + ".png")}></img>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className={`border w-full rounded bg-mainColor p-2  ${
                      touched.picture && errors.picture ? "border-red-500" : "border-slate-500"
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const allowedSizeMB = 1;
                      const allowedSizeBytes = allowedSizeMB * 1024 * 1024;
                      if (e.target.files) {
                        if (e.target.files[0].size > allowedSizeBytes) {
                          setTouched({ ...touched, picture: true });
                          setFieldValue("picture", "", true);
                        } else {
                          setFile(e.target.files[0]);
                          setFieldValue("picture", "set", true);
                        }
                      }
                    }}
                  />
                  <Field name="picture" className="hidden"></Field>
                  <ErrorMessage component="p" name="picture" className="text-red-500 text-xs" />
                </div>

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
