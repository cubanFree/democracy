import InboxCase from "@/components/messages/inbox-case";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Inbox() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    return <InboxCase idHost={user?.id} />
}