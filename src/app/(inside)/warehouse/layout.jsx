'use client';

import SideBar from "@/components/general/side-bar";
import { MdOutlineSummarize, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { BsCoin } from "react-icons/bs";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { LuListStart, LuListEnd } from "react-icons/lu";
import { TbListSearch } from "react-icons/tb";
import { RiGitRepositoryLine } from "react-icons/ri";

export default function layout({ children }) {

    return (
        <main className="grid gap-4 h-full w-full p-2 grid-rows-[10fr_1fr] md:grid-rows-1 md:grid-cols-[1fr_8fr] lg:grid-cols-[1fr_4fr]">
            
            <div className="flex gap-5 order-2 overflow-x-auto px-auto md:mb-auto md:overflow-y-auto md:border-r md:border-gray-700 md:grid md:order-1">
                <SideBar 
                    className='justify-center md:flex-col md:justify-start'
                    pathList={[
                        { name: 'Summaries', href: '/warehouse/summaries', icon: MdOutlineSummarize, size: 25 },
                        { name: 'Accounting', href: '/warehouse/accounting', icon: MdOutlineAccountBalanceWallet, size: 25 },
                        { name: 'Directors', href: '/warehouse/directors', icon: FaUserTie, size: 25 },
                        { name: 'Finance', href: '/warehouse/finance', icon: AiOutlineStock, size: 25 },
                        { name: 'SimCoin', href: '/warehouse/simcoin', icon: BsCoin, size: 25 },
                        { name: 'Goods', href: '/warehouse/goods', icon: MdOutlineRealEstateAgent, size: 25 },
                        { name: 'Starters', href: '/warehouse/starters', icon: LuListStart, size: 25 },
                        { name: 'Outgoing', href: '/warehouse/outgoing', icon: LuListEnd, size: 25 },
                        { name: 'Statistics', href: '/warehouse/statistics', icon: TbListSearch, size: 25 },
                        { name: 'Investigation', href: '/warehouse/investigation', icon: RiGitRepositoryLine, size: 25 },
                    ]}
                />
            </div>
            
            <div className="flex flex-col gap-4 rounded-xl p-2 bg-card shadow-lg order-1 md:order-2 md:grid">
                {children}
            </div>
        </main>
    )
}