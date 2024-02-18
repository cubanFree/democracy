import InboxCase from "@/components/messages/inbox-case";
import { fetchInbox } from "@/lib/data";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Inbox() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    const { data } = await fetchInbox();

    return <InboxCase data={data} idHost={user?.id} />
}