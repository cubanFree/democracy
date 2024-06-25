import Link from "next/link";
import ProfileDesign from "./profileDesign";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsCoin } from "react-icons/bs";
import { GiBrain } from "react-icons/gi";
import MenuDesign from "./menuDesign";
import SearchBar from "../search/search-bar";

export default function HeaderBar() {

    const allLinks = [
        {
            name: 'money',
            path: '/home',
            icon: MdOutlineAttachMoney,
            size: 20,
            value: '-'
        },
        {
            name: 'simCoins',
            path: '/home',
            icon: BsCoin,
            size: 20,
            value: '-'
        },
        {
            name: 'experience',
            path: '/home',
            icon: GiBrain,
            size: 20,
            value: '-'
        }
    ]

    return (
        <nav className="w-full h-full border-b border-gray-700">
            <ul className="flex h-full justify-between items-center text-md lg:mx-[10%]">

                {/* Menu principal */}
                <li className="p-2">
                    <MenuDesign />
                </li>

                <li className="flex justify-center items-center gap-2">

                    {/* Barra de busqueda */}
                    <SearchBar />

                    <div className="flex h-1/2 border-x border-gray-700 sm:hidden"/>

                    {/* Propiedades personales */}
                    {
                        allLinks.map((link, index) => (
                            <div key={index} className="p-2">
                                <Link href={link.path} className="flex justify-center items-center gap-1 hover:text-gray-500">
                                    <link.icon size={link.size} />
                                    <strong>{link.value}</strong>
                                </Link>
                            </div>
                        ))
                    }

                    {/* Perfil de usuario */}
                    <div className="p-2">
                        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-lg py-2 px-4 dark" />}>
                            <ProfileDesign />
                        </Suspense>
                    </div>
                </li>

            </ul>
        </nav>
    )
}