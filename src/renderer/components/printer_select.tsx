import React from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from './ui/button';
import { usePrinters } from "../hooks/use_printers";
import { ChevronDown } from 'lucide-react';

export default function PrinterSelect() {
  const {printers,selectedPrinter,setSelectedPrinter} = usePrinters()
  return (
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="p-0 hover:bg-transparent focus:outline-none border-none hover:text-muted-foreground transition-all duration-200"
              variant="ghost"
            >
              <span>{selectedPrinter?.displayName ?? "No Printer Selected"}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
    
          <DropdownMenuContent>
            {printers.map((p) => (
              <DropdownMenuItem
                key={p.displayName}
                onClick={() => setSelectedPrinter(p)}
              >
                {p.displayName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
  )
}