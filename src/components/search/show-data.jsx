'use client';

export default function ShowData({ data }) {

    return (
        <main className="grid bg-card rounded-xl p-2">
            <span>{data}</span>
        </main>
    )
}