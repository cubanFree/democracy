import { fetchProfileData } from "@/lib/data";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { MdOutlineDateRange, MdOutlineLocationOn } from "react-icons/md";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import moment from "moment/moment";
import AvatarConf from "./avatar-conf";
import { IoEarth } from "react-icons/io5";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { FaBuildingWheat } from "react-icons/fa6"; // icono de empresa beginner
// import { FaBuildingCircleExclamation } from "react-icons/fa6"; // icono de con riesgos
// import { FaBuildingCircleXmark } from "react-icons/fa6"; // icono de empresa en banca rota
// import { FaBuildingCircleCheck } from "react-icons/fa6"; // icono de empresa sin riesgos
// import { FaBuildingShield } from "react-icons/fa6"; // icono de empresa segura
// import { RiGovernmentLine } from "react-icons/ri"; // icono de governador del pais
import { HiOutlineIdentification } from "react-icons/hi2"; // icono de identidad
import { SlOptionsVertical } from "react-icons/sl"; // icono de Options
import { Button } from "../ui/button";
import DesignSendMessage from "./design-sendMessage";

export default async function CaseProfile({ idTarget }) {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('ID user not found');

    // fetching informacion del Profile
    const { data: dataUser, error: errorUser } = await fetchProfileData(idTarget || user?.id, 'users', 
        ['avatar_url', 
        'user_name', 
        'status', 
        'created_at', 
        'citizenship', 
        'residenceship', 
        'roles', 
        'description']);
    if (errorUser) throw new Error('(Try refresh, else): It is recommended that you Log out, and then Log in. If it doesn`t work, please contact us or send a report.');

    // fetching citizenship y residenceship(si existe)
    const req1 = fetchProfileData(dataUser?.citizenship, 'countries', ['name']);
    let citizenship, residenceship;
    if (dataUser?.residenceship) {
        const req2 = fetchProfileData(dataUser?.residenceship, 'countries', ['name']);
        [citizenship, residenceship] = await Promise.allSettled([req1, req2]);
    } else {
        citizenship = await req1;
    }

    // fetching informacion del About
    const { data: dataAbout, error: errorAbout } = await fetchProfileData(idTarget || user?.id, 'info_about', ['ranking_local', 'ranking_global', 'rating']);
    if (errorAbout) throw new Error('(Try refresh, else): It is recommended that you Log out, and then Log in. If it doesn`t work, please contact us or send a report.');

    // convertir fecha de creacion
    const dataPerfil = moment(dataUser?.created_at).fromNow();

    // lista de los rankings
    const listsRanking = [
        { name: 'Ranking local', value: dataAbout?.ranking_local, icon: MdOutlineLocationOn, size: 20},
        { name: 'Ranking global', value: dataAbout?.ranking_global, icon: IoEarth, size: 20},
    ]

    return (
        <main className="w-full gap-4">
            <div className="w-full flex gap-4 lg:gap-2 lg:flex-col">
                <AvatarConf avatar_url={dataUser?.avatar_url} status={dataUser?.status}/>
                
                <div className="flex flex-col items-start gap-2 lg:items-center">

                    {/* nombre y roles */}
                    <span className="flex gap-2 justify-center items-center text-xl font-bold text-center lg:text-2xl">
                        {dataUser?.user_name || 'Unknown'}
                        {
                            dataUser?.roles.includes('beginner')
                                ? <FaBuildingWheat size={15} color="green"/> 
                                : null
                        }
                    </span>

                    {/* fecha de creacion */}
                    <span className="text-gray-500 text-sm flex justify-center items-center gap-2">
                        <MdOutlineDateRange size={20} />
                        joined {dataPerfil}
                    </span>

                    {/* citizenship */}
                    <span className="flex justify-center items-center gap-2 text-gray-400">
                        <HiOutlineIdentification size={20} />
                        {citizenship?.data?.name || 'N/A'}
                    </span>

                    {/* lista de los rankings */}
                    <div 
                        className='w-full text-gray-400 flex gap-5 lg:justify-center'
                        >
                            {
                                listsRanking.map((item, index) => (
                                    <TooltipProvider key={index}>
                                        <Tooltip>

                                            <TooltipTrigger>
                                                <span className="flex gap-1 items-center justify-center cursor-default"><item.icon size={item.size} /> <strong>{item.value || 'N/A'}</strong></span>
                                            </TooltipTrigger>

                                            <TooltipContent className="bg-foreground text-black">
                                                <p>{item.name}</p>
                                            </TooltipContent>
                                            
                                        </Tooltip>
                                    </TooltipProvider>
                                ))
                            }
                    </div>

                    {/* Friends - Send Message - opciones */}
                    <div className="w-full flex justify-between items-center gap-5">
                        <Button variant="default" className="w-full flex justify-center items-center bg-card text-gray-300">
                            Friends
                        </Button>

                        {
                            idTarget && (
                                <DesignSendMessage idHost={user?.id} idTarget={idTarget} user_name={dataUser?.user_name} />
                            )
                        }
                        
                        <div className="flex justify-end items-center">
                            <SlOptionsVertical size={15} className="" />
                        </div>
                    </div>

                    {/* description */}
                    {
                        dataUser?.description && (
                            <span 
                                className='w-full text-gray-500 lg:text-center'
                                >
                                    {dataUser?.description}
                            </span>
                        )
                    }

                    <DropdownMenuSeparator  className="w-full hidden lg:bg-gray-800 lg:flex"/>

                    {/* Information about
                    <div className="w-full flex flex-col gap-2 items-start text-sm">
                        <span><strong>Residenceship:</strong> <span className="fond-light text-gray-400">{residenceship?.data?.name || 'N/A'}</span></span>
                        <span><strong>Rating:</strong> <span className="fond-light text-gray-400">{dataAbout?.rating || 'N/A'}</span></span>
                    </div> */}

                </div>
            </div>

            <div>
                
            </div>
        </main>
    )
}