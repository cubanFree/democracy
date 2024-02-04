import InboxCase from "@/components/messages/inbox-case";
import data from "./data.json"

export default function Inbox() {

    return (
        <main className="w-full h-full grid grid-rows-[1fr_20fr] gap-2">
            <div className="w-full flex flex-col gap-2">
                <span className="text-2xl">Inbox</span>
                <div className="w-full border-b border-gray-700" />
            </div>

            <InboxCase data={data} />
        </main>
    )
}