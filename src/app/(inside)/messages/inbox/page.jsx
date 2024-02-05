import InboxCase from "@/components/messages/inbox-case";
import data from "./data.json"

export default function Inbox() {

    return (
        <main className="w-full h-full">
            <InboxCase data={data} />
        </main>
    )
}