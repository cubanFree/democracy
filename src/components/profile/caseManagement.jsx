import { fetchProfileData } from "@/lib/data";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function CaseInfoManagement({ idTarget }) {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('ID user not found');

    // fetching informacion de la Compania
    const { data: dataCompany, error: errorCompany } = await fetchProfileData(idTarget || user?.id, 'info_management', 
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

    const invoices = [
        {
          table: "Directors",
          value: dataCompany?.directors,
        },
        {
            table: "Employees",
            value: [
                {
                    name: "Workers",
                    data: dataCompany?.employees_workers
                },
                {
                    name: "Administration",
                    data: dataCompany?.employees_administration
                },
                {
                    name: "Admin_expenses",
                    data: dataCompany?.administrative_expenses,
                    adjective: '%'
                },
            ],
        },
        {
            table: "Bonus",
            value: [
                {
                    name: "Production_speed",
                    data: dataCompany?.bonus_production_speed,
                    adjective: '%'
                },
                {
                    name: "Sales_speed",
                    data: dataCompany?.bonus_sales_speed,
                    adjective: '%'
                },
            ],
        },
        {
            table: "Valuation",
            value: [
                {
                    name: "Company",
                    data: dataCompany?.company_valuation,
                    adjective: '$'
                },
                {
                    name: "Infrastructure",
                    data: dataCompany?.infrastructure_valuation,
                    adjective: '$'
                },
                {
                    name: "Patents",
                    data: dataCompany?.patents_valuation,
                    adjective: '$'
                },
            ],
        },
        {
            table: "Passives",
            value: [
                {
                    name: "Bonds_sold",
                    data: dataCompany?.liabilities_bonds_sold,
                    adjective: '$'
                },
                {
                    name: "Interest_payment",
                    data: dataCompany?.liabilities_interest_payment,
                    adjective: '$/day'
                },
            ],
        }
    ]

    return (
        <div className="flex flex-col gap-4 rounded-xl p-2 bg-card shadow-lg">
            <span className="text-yellow-600 flex w-full">Information Management</span>
            {
                invoices.map((invoice, index) => (
                    <Table key={index}>

                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-full text-blue-400 h-10">{invoice.table}</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                invoice.value?.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="w-full p-2 text-left">{value.name}</TableCell>
                                        <TableCell className="w-full p-2 justify-end flex gap-1"><p>{value.data}</p>{value.adjective && value.adjective}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>

                    </Table>
                ))
            }
        </div>
    )
}