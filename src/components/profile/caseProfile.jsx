import { fetchProfileData } from "@/lib/data";
import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { MdOutlineDateRange } from "react-icons/md";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

export default async function CaseProfile() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await fetchProfileData(user?.id, 'users', ['avatar_url', 'user_name', 'status', 'created_at', 'citizenship', 'residenceship', 'roles', 'description']);

    const req1 = fetchProfileData(data?.citizenship, 'countries', ['name']);
    let citizenship, residenceship;
    if (data?.residenceship) {
        // Cuando 'residenceship' está presente, ejecutar ambas promesas
        const req2 = fetchProfileData(data?.residenceship, 'countries', ['name']);
        [citizenship, residenceship] = await Promise.allSettled([req1, req2]);
    } else {
        // Cuando 'residenceship' no está presente, ejecutar solo la primera promesa
        citizenship = await req1;
    }

    return (
        <main className="w-full gap-4">
            <div className="w-full flex gap-4 lg:gap-2 lg:flex-col">
                <Image 
                    src={data?.avatar_url || '/avatar_default.jpg'}
                    alt="avatar profile"
                    width={1000}
                    height={1000}
                    className={cn("object-cover w-16 h-16 rounded-lg lg:rounded-3xl lg:w-28 lg:h-28 lg:mx-auto", 
                        data?.status === 'online' ? 'border-4 border-transparent ring-2 ring-green-700' : data?.status === 'offline' ? 'border-4 border-transparent ring-2 ring-red-900' : 'border-4 border-transparent ring-2 ring-gray-500'
                    )}
                />
                <div className="w-full flex flex-col items-start gap-4 font-mono lg:items-center">
                    <div className="flex items-start justify-center gap-2 lg:items-center md:flex-wrap lg:flex">
                        <span className="text-xl font-bold text-center lg:text-2xl">{data?.user_name || 'Unknown'}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-sm flex justify-center items-center gap-1">
                            <MdOutlineDateRange size={17} />
                            <span>a year ago</span>
                        </span>
                    </div>
                    <DropdownMenuSeparator  className="w-full hidden lg:bg-gray-700 lg:flex"/>
                    <div className="w-full flex flex-col items-start gap-1">
                        <span><strong>Citizenship:</strong> <span className="text-gray-400">{citizenship?.data?.name || 'N/A'}</span></span>
                        <span><strong>Residenceship:</strong> <span className="text-gray-400">{residenceship?.data?.name || 'N/A'}</span></span>
                        <span><strong>Roles:</strong> <span className="text-gray-400">{data?.roles || 'N/A'}</span></span>
                    </div>
                    <Textarea className="w-full flex items-start bg-transparent" value={data?.description || 'No description'} disabled />
                </div>
            </div>

            <div>
                
            </div>
        </main>
    )
}