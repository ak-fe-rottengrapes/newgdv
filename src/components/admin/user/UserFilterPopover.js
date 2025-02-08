'use client'
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from '@/lib/utils'

const UserFilterPopover = ({ filter, setFilter }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[110px] text-white hover:text-white hover:bg-[#303d4b] bg-[#3e4f61] justify-between">
                    {filter}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 ">
                <Command className='bg-[#3e4f61] text-white'>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup className='text-white'>
                            {["All", "Active", "Inactive"].map(status => (
                                <CommandItem
                                    key={status}
                                    value={status}
                                    onSelect={() => {
                                        setFilter(status);
                                        setOpen(false);
                                    }}
                                >
                                    {status}
                                    <Check className={cn("ml-auto", filter === status ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default UserFilterPopover; 