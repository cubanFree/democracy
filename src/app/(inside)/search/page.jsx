'use client';

import Pagination from "@/components/general/pagination";
import SearchBar from "@/components/search/search-bar";
import ShowData from "@/components/search/show-data";
import React from "react";

export default function Search() {

    const [data, setData] = React.useState([])

    return (
        <main className="grid grid-rows-[1fr_10fr_1fr] gap-2 w-full h-full p-2">
            <SearchBar setData={setData} />

            {/* Resultados de la busqueda por filtro */}
            <ShowData data={data} />
            
            <Pagination />
        </main>
    )
}