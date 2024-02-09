import { Session, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Column from "../layout/column";

import { BiTrash, BiMailSend, BiEdit, BiSearch } from "react-icons/bi";
import DateTime from "../components/date-time";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

type IGroup = {
  id: string;
  title: string;
  created_at: string;
  desc: string;
  category: string;
  user_id: string;
};

function Home() {
  const [groups, setGroups] = useState<{ [x: string]: any } | null>();
  const [searchString, setSearchString] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const session = useSelector(
    (state: RootState) => state.auth.session
  ) as Session;

  useEffect(() => {
    getGroups();
  }, []);

  function getImageUrl(name: string) {
    const { data } = supabase.storage.from("images").getPublicUrl(name);
    return data.publicUrl;
  }

  function search() {
    getGroups(searchCategory, searchString);
  }

  async function getGroups(category?: string, searchString?: string) {
    if (searchString) {
      const { data } = await supabase
        .from("groups")
        .select()
        .ilike("title", `*${searchString}*`)
        .order("created_at");
      setGroups(data);
      return;
    }
    if (category) {
      const { data } = await supabase
        .from("groups")
        .select()
        .eq("category", category)
        .order("created_at");
      setGroups(data);
      return;
    }
    if (searchString && category) {
      const { data } = await supabase
        .from("groups")
        .select()
        .eq("category", category)
        .like("title", searchString)
        .order("created_at");
      setGroups(data);
      return;
    }
    const { data } = await supabase.from("groups").select().order("created_at");
    setGroups(data);
  }

  async function _handleDelete(groupID: string) {
    await supabase.from("groups").delete().match({ id: groupID });
    await supabase.storage.from("images").remove([groupID + ".png"]);
    getGroups();
  }

  return (
    <>
      <Column>
        <form
          className="col-span-6 flex gap-4 flex-col sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          Search:
          <input
            className="border w-full rounded bg-mainColor p-2 disabled"
            onChange={(e) => setSearchString(e.target.value)}
          ></input>
          Category:
          <select
            name="category"
            className="border w-full rounded bg-mainColor p-2"
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value=""></option>
            <option value="hobby">hobby</option>
            <option value="outdoor">outdoor</option>
            <option value="gaming">gaming</option>
            <option value="friendship">friendship</option>
            <option value="other">...other</option>
          </select>
          <button className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-slate-700">
            <BiSearch size={25} />
            Search
          </button>
        </form>

        {groups?.map((group: IGroup) => (
          <div
            key={group.id}
            className="group border p-2 rounded flex gap-2 col-span-6 items-start bg-mainColor border-slate-500"
          >
            <div className="w-80 rounded overflow-hidden">
              <img
                className="group-hover:scale-110 duration-300"
                src={getImageUrl(group.id + ".png")}
              ></img>
            </div>
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-lg font-bold">{group.title}</h1>
              <p className="text-sm  italic">
                <DateTime timestamp={group.created_at} /> | Category:{" "}
                {group.category}
              </p>
              <p>{group.desc}</p>
            </div>
            <div className="flex flex-col gap-2">
              {session.user && (
                <Link
                  to={`/group/${group.id}/message`}
                  className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-green-500"
                >
                  <BiMailSend size={25} />
                  Contact
                </Link>
              )}
              {session?.user?.id === group.user_id && (
                <>
                  <Link
                    to={`/group/${group.id}/edit`}
                    className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-orange-500"
                  >
                    <BiEdit size={25} />
                    Edit
                  </Link>
                  <button
                    onClick={() => _handleDelete(group.id)}
                    className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-red-500"
                  >
                    <BiTrash size={25} />
                    Delete
                  </button>
                </>
              )}
              {!session.user && (
                <>
                  <small>Please login to message this group.</small>
                </>
              )}
            </div>
          </div>
        ))}
        {!groups && (
          <div className="col-span-6">
            Error while getting groups from database...
          </div>
        )}
      </Column>
    </>
  );
}

export default Home;
