import { Session, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Column from "../layout/column";

import { BiTrash, BiMailSend, BiEdit } from "react-icons/bi";
import DateTime from "../components/date-time";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

function Home() {
  const [groups, setGroups] = useState<object[] | null>([]);
  const session = useSelector((state: RootState) => state.auth.session) as Session;

  useEffect(() => {
    getGroups();
  }, []);

  function getImageUrl(name: string) {
    const { data } = supabase.storage.from("images").getPublicUrl(name);
    return data.publicUrl;
  }

  async function getGroups() {
    const { data } = await supabase.from("groups").select().order("created_at");
    setGroups(data);
  }

  async function _handleDelete(groupID: number) {
    await supabase.from("groups").delete().match({ id: groupID });
    getGroups();
  }

  return (
    <>
      <Column>
        {groups?.map((group: any) => (
          <div
            key={group.id}
            className="border p-2 rounded flex gap-2 col-span-6 items-start bg-mainColor border-slate-500"
          >
            <img className="h-28 rounded aspect-square object-cover" src={getImageUrl("image001.jpg")}></img>
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-lg font-bold">{group.title}</h1>
              <p className="text-sm  italic">
                <DateTime timestamp={group.created_at} /> | Category: {group.category}
              </p>
              <p>{group.desc}</p>
            </div>
            <div className="flex flex-col gap-2">
              {session.user && (
                <Link
                  to={`/group/message/${group.id}`}
                  className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-green-500"
                >
                  <BiMailSend size={25} />
                  Contact
                </Link>
              )}
              {session?.user?.id === group.user_id && (
                <>
                  <Link
                    to={`/group/edit/${group.id}`}
                    className="p-2 gap-1 border rounded flex border-slate-500 hover:bg-green-500"
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
            </div>
          </div>
        ))}
      </Column>
    </>
  );
}

export default Home;
