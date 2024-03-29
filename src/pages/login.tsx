import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Column from "../layout/column";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { BiLogoGoogle } from "react-icons/bi";

import { useDispatch } from "react-redux";
import { setSession } from "../redux/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";

import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Login() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const captcha = useRef<HCaptcha>(null);
  const formik = useRef<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function GoogleLogin() {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <>
      <Column>
        <div className="border p-2 rounded col-start-1 col-span-6 md:col-start-2 md:col-span-4 border-slate-500 bg-mainColor">
          <Formik
            initialValues={{ email: "", password: "", captcha: "" }}
            onSubmit={async (values) => {
              if (isRegister) {
                const { data, error } = await supabase.auth.signUp({
                  email: values.email,
                  password: values.password,
                  options: { captchaToken },
                });
                if (data.session) {
                  dispatch(setSession(data.session as object));
                  navigate("/");
                }
                if (error) {
                  setFormError(error.message);
                }
              } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: values.email,
                  password: values.password,
                  options: { captchaToken },
                });
                if (data.session) {
                  dispatch(setSession(data.session as object));
                  navigate("/");
                }
                if (error) {
                  setFormError(error.message);
                }
              }
              captcha.current?.resetCaptcha();
              formik.current.resetForm();
            }}
            validationSchema={Yup.object({
              email: Yup.string().min(4).required().email(),
              password: Yup.string().min(4).required(),
              captcha: Yup.string().required(),
            })}
            innerRef={formik}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="flex flex-wrap flex-col gap-2">
                <div>
                  <label>Email:</label>
                  <Field
                    type="email"
                    name="email"
                    className={`border w-full rounded bg-mainColor p-2 ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-slate-500"
                    }`}
                  />
                  <ErrorMessage
                    component="p"
                    name="email"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div>
                  <label>Password:</label>
                  <Field
                    type="password"
                    name="password"
                    className={`border w-full rounded bg-mainColor p-2 ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-slate-500"
                    }`}
                  />
                  <ErrorMessage
                    component="p"
                    name="password"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="">
                  <HCaptcha
                    ref={captcha}
                    sitekey={import.meta.env.VITE_HCAPTCHA_KEY}
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      formik.current.setFieldValue("captcha", token);
                    }}
                    theme="dark"
                  />
                  <Field className="hidden" name="captcha" type="captcha" />
                  <ErrorMessage
                    component="p"
                    name="captcha"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    type="submit"
                    className="border p-2 rounded cursor-pointer bg-slate-600 border-slate-500 hover:bg-mainColorLight disabled:cursor-wait disabled:hover:bg-inherit"
                    disabled={isSubmitting}
                  >
                    {isRegister ? <>Register</> : <>Login</>}
                  </button>
                  <a
                    className="border p-2 rounded cursor-pointer border-slate-500 hover:bg-mainColorLight disabled:cursor-wait disabled:hover:bg-inherit flex gap-2"
                    onClick={() => GoogleLogin()}
                  >
                    <BiLogoGoogle size={25} />
                    Login with Google
                  </a>
                  <a
                    href="#"
                    onClick={() => setIsRegister(!isRegister)}
                    className="rounded cursor-pointer "
                  >
                    {!isRegister ? (
                      <>You don't have an account yet? Click here.</>
                    ) : (
                      <>You already have an account? Click here.</>
                    )}
                  </a>
                </div>
                {formError ? (
                  <p className="text-red-500 text-xs">{formError}</p>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      </Column>
    </>
  );
}

export default Login;
