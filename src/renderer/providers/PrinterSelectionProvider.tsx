import React from 'react'
import { usePrinters } from '../hooks/use_printers';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import PrinterSelect from '../components/printer_select';
import { Button } from '../components/ui/button';

type Props = {
    children:React.ReactNode
}

function PrinterSelectionProvider({children}: Props) {
    const [isOpen,setIsOpen] = React.useState(false);
    const {selectedPrinter} = usePrinters();
  return (
    <>
    <Dialog open={isOpen} onOpenChange={(v)=>{
        setIsOpen(selectedPrinter?false:true)
    }}>
        <DialogContent className='max-w-md'>
            <DialogHeader>
                <DialogTitle>Please Select A Printer</DialogTitle>
            </DialogHeader>
            <PrinterSelect/>
            <DialogFooter>
                <Button disabled={selectedPrinter?false:true} onClick={()=>setIsOpen(false)}>Done</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    {children} 
    </>
  )
}

export default PrinterSelectionProvider