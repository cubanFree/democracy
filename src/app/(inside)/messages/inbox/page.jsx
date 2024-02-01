import InboxCase from "@/components/messages/inbox-case";
import data from "./data.json"

export default function Inbox() {

    return (
        <main className="flex flex-col w-full h-full gap-2">
            <div className="flex flex-col gap-2">
                <span className="text-2xl">Inbox</span>
                <div className="w-full border-b border-gray-700" />
            </div>

            <div className="w-full h-full overflow-hidden flex flex-col gap-2">
                <InboxCase data={data} />
            </div>
        </main>
    )
}