import { fetchProfileData } from "@/lib/data";
import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { MdOutlineDateRange } from "react-icons/md";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import moment from "moment/moment";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import AvatarConf from "./avatar-conf";

export default async function CaseProfile() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('ID user not found');

    // fetching informacion del Profile
    const { data: dataUser, error: errorUser } = await fetchProfileData(user?.id, 'users', 
        ['avatar_url', 
        'user_name', 
        'status', 
        'created_at', 
        'citizenship', 
        'residenceship', 
        'roles', 
        'description']);
    if (errorUser) throw new Error('ERROR 500: something goes wrong when getting Information Profile.');

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
    const { data: dataAbout, error: errorAbout } = await fetchProfileData(user?.id, 'info_about', ['ranking_local', 'ranking_global', 'rating']);
    if (errorAbout) throw new Error('ERROR 500: something goes wrong when getting Information About.');

    // fetching informacion de la Compania
    const { data: dataCompany, error: errorCompany } = await fetchProfileData(user?.id, 'info_management', 
        ['directors', 
        'employees_workers', 
        'employees_administration', 
        'administrative_expenses', 
        'bonus_production_speed', 
        'bonus_sales_speed', 
        'company_valuation', 
        'infrastructure_valuation', 
        'patents_valuation', 
        'liabilities_bonds_sold', 
        'liabilities_interest_payment']);
    if (errorCompany) throw new Error('ERROR 500: something goes wrong when getting Information Company.');

    // convertir fecha de creacion
    const dataPerfil = moment(dataUser?.created_at).fromNow();

    return (
        <main className="w-full gap-4">
            <div className="w-full flex gap-4 lg:gap-2 lg:flex-col">
                <AvatarConf avatar_url={dataUser?.avatar_url} status={dataUser?.status}/>
                
                <div className="w-full flex flex-col items-start gap-3 lg:items-center">
                    <div className="flex-wrap justify-center gap-2 items-center sm:flex">
                        <span className="text-xl font-bold text-center lg:text-2xl">{dataUser?.user_name || 'Unknown'}</span>
                        <span className="text-gray-500 text-sm flex justify-center items-center gap-2">
                            <span className="text-gray-500">•</span>
                            <MdOutlineDateRange size={17} />
                            <span>{dataPerfil}</span>
                        </span>
                    </div>

                    <span 
                        className={cn(
                            'w-full',
                            !dataUser?.description && 'text-gray-500 lg:text-center'
                        )}
                        >
                            {dataUser?.description || 'no description'}
                    </span>
                    <DropdownMenuSeparator  className="w-full hidden lg:bg-gray-800 lg:flex"/>

                    {/* Information about */}
                    <div className="w-full flex flex-col items-start text-sm">
                        <span className="font-bold text-yellow-600"><strong>Information about</strong></span>
                        <div className="w-full flex flex-col pl-[10%] gap-2 border border-gray-800 rounded-md p-2">
                            <span><strong>Citizenship:</strong> <span className="fond-light text-gray-400">{citizenship?.data?.name || 'N/A'}</span></span>
                            <span><strong>Residenceship:</strong> <span className="fond-light text-gray-400">{residenceship?.data?.name || 'N/A'}</span></span>
                            <span><strong>Roles:</strong> <span className="fond-light text-gray-400">{dataUser?.roles || 'N/A'}</span></span>
                            <span><strong>Ranking_local:</strong> <span className="fond-light text-gray-400"># {dataAbout?.ranking_local || 'N/A'}</span></span>
                            <span><strong>Ranking_global:</strong> <span className="fond-light text-gray-400"># {dataAbout?.ranking_global || 'N/A'}</span></span>
                            <span><strong>Rating:</strong> <span className="fond-light text-gray-400">{dataAbout?.rating || 'N/A'}</span></span>
                        </div>
                    </div>

                    {/* Company information */}
                    <div className="w-full flex flex-col items-start text-sm">
                        <span className="font-bold text-yellow-600"><strong>Company information</strong></span>
                        <div className="w-full flex flex-col pl-[10%] gap-2 border border-gray-800 rounded-md p-2">

                            {/* directors */}
                            <span><strong className="text-blue-500">Directors:</strong> <span className="fond-light text-gray-400">{dataCompany?.directors.length || 'not yet'}</span></span>

                            {/* employees */}
                            <span className="w-full flex-wrap">
                                <strong className="text-blue-500">Employees</strong>
                                <div className="w-full flex flex-col pl-[10%] gap-2">
                                    <span><strong>Workers:</strong> <span className="fond-light text-gray-400">{dataCompany?.employees_workers || '0'}</span></span>
                                    <span><strong>Administration:</strong> <span className="fond-light text-gray-400">{dataCompany?.employees_administration || '0'}</span></span>
                                    <span><strong>Admin_expenses:</strong> <span className="fond-light text-gray-400">{dataCompany?.administrative_expenses || '0'}%</span></span>
                                </div>
                            </span>

                            {/* bonus */}
                            <span className="w-full flex-wrap">
                                <strong className="text-blue-500">Bonus</strong>
                                <div className="w-full flex flex-col pl-[10%] gap-2">
                                    <span><strong>Production_speed:</strong> <span className="fond-light text-gray-400">{dataCompany?.bonus_production_speed || '0'}%</span></span>
                                    <span><strong>Sales_speed:</strong> <span className="fond-light text-gray-400">{dataCompany?.bonus_sales_speed || '0'}%</span></span>
                                </div>
                            </span>

                            {/* bonus */}
                            <span className="w-full flex-wrap">
                                <strong className="text-blue-500">Valuation</strong>
                                <div className="w-full flex flex-col pl-[10%] gap-2">
                                    <span><strong>Company:</strong> <span className="fond-light text-gray-400">${dataCompany?.company_valuation || '0'}</span></span>
                                    <span><strong>Infrastructure:</strong> <span className="fond-light text-gray-400">${dataCompany?.infrastructure_valuation || '0'}</span></span>
                                    <span><strong>Patents:</strong> <span className="fond-light text-gray-400">${dataCompany?.patents_valuation || '0'}</span></span>
                                </div>
                            </span>

                            {/* passives */}
                            <span className="w-full flex-wrap">
                                <strong className="text-blue-500">Passives</strong>
                                <div className="w-full flex flex-col pl-[10%] gap-2">
                                    <span><strong>Bonds_sold:</strong> <span className="fond-light text-gray-400">${dataCompany?.liabilities_bonds_sold || '0'}</span></span>
                                    <span><strong>Interest_payment:</strong> <span className="fond-light text-gray-400">${dataCompany?.liabilities_interest_payment || '0'} /day</span></span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                
            </div>
        </main>
    )
}