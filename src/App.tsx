import { Outlet } from "react-router-dom";
import "./App.css";

import Footer from "./components/footer";
import Navigation from "./components/navigation";
import { useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { setSession } from "./redux/authSlice";
import { useDispatch } from "react-redux";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

function App() {
  const dispatch = useDispatch();

  const initUser = useCallback(async () => {
    if (localStorage.getItem("sb-feebqdmsujrpexkvirys-auth-token")) {
      const { data, error } = await supabase.auth.setSession({
        access_token: JSON.parse(localStorage.getItem("sb-feebqdmsujrpexkvirys-auth-token") as string).access_token,
        refresh_token: JSON.parse(localStorage.getItem("sb-feebqdmsujrpexkvirys-auth-token") as string).refresh_token,
      });
      if (data.session) {
        dispatch(setSession(data.session as object));
      }
      if (error) {
        console.log(error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <>
      <div className="min-h-screen text-slate-300 bg-mainColorDark">
        <Navigation />
        <div className="py-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
