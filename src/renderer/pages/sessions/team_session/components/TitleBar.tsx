import { Input } from 'antd/es';
import { Search } from 'lucide-react';
import React from 'react'

type Props = {
    title: string,
    actions?: React.ReactNode,
    search?: boolean
    searchValue?: string,
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
}

export default function TitleBar({ title, actions, search = false, searchValue, setSearchValue }: Props) {
    return (
        <div className="shrink-0 px-4 py-2 flex justify-between items-center border-b">
            <div className="flex flex-col items-start gap-3">
                <h1 className="text-lg font-bold">{title}</h1>
                <div className='flex-1 flex gap-8 items-center justify-between p-3'>
                    {actions}
                </div>
            </div>
            {search && (<div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                />
            </div>)}
        </div>
    )
}