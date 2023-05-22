import { Link, useNavigate } from "react-router-dom";

import type { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Session, createClient } from "@supabase/supabase-js";
import { setSession } from "../redux/authSlice";
import { BiMessageAdd } from "react-icons/bi";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

function Navigation() {
  const session = useSelector((state: RootState) => state.auth.session) as Session;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    supabase.auth.signOut().then(() => {
      dispatch(setSession({}));
      navigate("/");
    });
  }

  return (
    <div className="h-16 flex items-center p-4 sticky top-0 justify-between border-b font-bold border-slate-500 bg-mainColorDark select-none">
      <div className="flex gap-4">
        <Link to="/" className="">
          HOME
        </Link>
        {session?.user ? (
          <Link to="/group/add">
            <div className="flex gap-1 ">
              Add group
              <BiMessageAdd size={25} />
            </div>
          </Link>
        ) : null}
      </div>
      <div className="flex gap-4">
        <p className="hidden sm:block">{session?.user?.email}</p>
        {!session?.user ? <Link to="/login">Login</Link> : <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
}

export default Navigation;
