import { Toast } from '@/renderer/components/Toast';
import { Button } from '@/renderer/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/renderer/components/ui/dialog';
import { Input } from '@/renderer/components/ui/input';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/renderer/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/renderer/components/ui/table';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { format, parse } from 'date-fns';
import custormParseFormat from 'dayjs/plugin/customParseFormat';
import { PSHouse, PSParticipant } from '@/db/sqlite/p_sports/schema';
import { nanoid } from 'nanoid';
import { formatDateToISO, getDayJsDate } from '@/shared/helpers/dates';
import { DateFormats } from '@/shared/constants/constants';

dayjs.extend(custormParseFormat);
type Props = {
    houses: PSHouse[];
    participants: PSParticipant[];
    createNewParticipant: (participant: Omit<PSParticipant, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    fetchHouses: () => Promise<void>;
    fetchParticipants: () => Promise<void>;
    createHouse: (house: Omit<PSHouse, "id" | "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>;
}

export type ParticipantCSV = {
    firstName: string;
    lastName: string;
    dob: string;
    gender: "male" | "female";
    house: string;
}
export const csvHeaders = ["firstName", "lastName", "dob", "gender", "house"];

function ParticipantsCsvImport({ houses, createHouse, fetchHouses, participants, createNewParticipant, fetchParticipants }: Props) {
    const [parsedData, setParsedData] = useState<ParticipantCSV[]>([]);
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState<{ kind: string, state: boolean }>({
        kind: "",
        state: false
    });
    const [selectedDateFormat, setSelectedDateFormat] = useState("YYYY-MM-DD")
    const [dotCount, setDotCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFileSelectClick() {
        inputRef.current?.click(); 
    }
    function onFileSelection(e: ChangeEvent<HTMLInputElement>) {
        const expectedHeaders = ["firstName", "lastName", "dob", "gender", "house"];

        try {
            const file = e.currentTarget.files?.[0];
            if (!file) {
                throw new Error("Please select a CSV file.");
            }

            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const data = reader.result as string;
                    const unformattedRows = data.trim().split(/\r?\n/);

                    // Header validation
                    const headers = unformattedRows[0].split(",").map(h => h.trim());
                    const headerMismatch = expectedHeaders.some((h, i) => h !== headers[i]);

                    if (headerMismatch || headers.length !== expectedHeaders.length) {
                        throw new Error("CSV headers do not match the expected format.");
                    }

                    const rows: ParticipantCSV[] = [];

                    for (let i = 1; i < unformattedRows.length; i++) {
                        const line = unformattedRows[i].trim();
                        if (!line) continue; // skip empty lines

                        const values = line.split(",").map(v => v.trim());

                        if (values.length < 5) {
                            throw new Error(`Row ${i + 1} is incomplete.`);
                        }

                        rows.push({
                            firstName: values[0],
                            lastName: values[1],
                            dob: formatDateToISO(values[2],selectedDateFormat),
                            gender: values[3].toLowerCase() as ParticipantCSV["gender"],
                            house: values[4],
                        });
                    }

                    setParsedData(rows);
                } catch (readError) {
                    Toast({
                        message: readError instanceof Error ? readError.message : "Failed to read CSV.",
                        variation: "error"
                    });
                }
            };
            reader.onloadstart = () => {
                setLoading({ kind: "Reading CSV", state: true });
            }

            reader.onloadend = () => {
                setLoading({ kind: "", state: false });
            }
            reader.readAsText(file);
        } catch (error) {
            Toast({
                message: error instanceof Error ? error.message : "An unexpected error occurred.",
                variation: "error"
            });
        }
    }
    const updateData = (
        index: number,
        key: keyof ParticipantCSV,
        value: string
    ) => {
        const updatedData = [...parsedData];
        updatedData[index][key] = value as any;
        setParsedData(updatedData);
    };

    const handleUpload = async () => {
        setLoading({ kind: "Uploading", state: true });
        try {
            const createdParticipants: Omit<PSParticipant, "id" | "createdAt" | "updatedAt">[] = [...participants]
            const createdHouses: Omit<PSHouse, "createdAt" | "updatedAt" | "deletedAt">[] = [...houses]
            for (const row of parsedData) {
                const participantExists = createdParticipants.some(p => p.firstName.toLowerCase() === row.firstName.toLowerCase() && p.lastName.toLowerCase() === row.lastName.toLowerCase() && p.dob === row.dob);
                if (participantExists) continue;
                let houseId = nanoid();
                const houseExists = createdHouses.some(h => h.name.toLowerCase() === row.house.toLowerCase());
                if (houseExists) houseId = createdHouses.find(h => h.name.toLowerCase() === row.house.toLowerCase()).id;
                else {
                    const newHouse: Omit<PSHouse, "createdAt" | "updatedAt" | "deletedAt"> = {
                        id: houseId,
                        name: row.house,
                        abbreviation: row.house.split("").slice(0, 3).join(""),
                        color: "#cccccc",

                    }
                    await createHouse(newHouse);
                    createdHouses.push(newHouse);
                }
                const { house, ...rest } = row
                const newParticipant: Omit<PSParticipant, "id" | "createdAt" | "updatedAt"> = {
                    ...rest,
                    houseId,
                    deletedAt: null
                }
                await createNewParticipant(newParticipant);
                createdParticipants.push(newParticipant);
            }
            Toast({ message: "Upload complete!", variation: "success" });
            setOpen(false)
        } catch (error) {
            Toast({ message: error instanceof Error ? error.message : "Upload failed.", variation: "error" });
        } finally {
            setLoading({ kind: "", state: false });
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            let csvContent = csvHeaders.join(",") + "\n";
            csvContent += "John,Doe,2006/27/06,male,Midlands Christian College\n" + "Jane,Doe,2006/05/01,female,Midlands Christian School\n"
            await window.api.exportCSV({ data: csvContent, filename: "participants_template.csv" });
            Toast({ message: "Template Successfully exported as 'participants_template.csv' ", variation: "success" })
        } catch (e) {
            console.log(e)
            Toast({ message: "An Error Occured", variation: "error" })
        }
    }

    useEffect(() => {
        if (loading.state) {
            const interval = setInterval(() => {
                setDotCount((prev) => (prev + 1) % 4);
            }, 500);
            return () => clearInterval(interval);
        } else {
            setDotCount(0);
        }
    }, [loading.state]);

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) {
                setParsedData([]);
                setSelectedDateFormat("YYYY-MM-DD");
            }
            setOpen(v)
        }}>
            <DialogTrigger asChild>
                <Button>Import CSV</Button>
            </DialogTrigger>
            <DialogContent className='max-w-[800px]'>
                <DialogHeader className='flex flex-row items-center gap-8'>
                    <DialogTitle>Participants CSV Import</DialogTitle>
                    <Select disabled={parsedData.length > 0} onValueChange={(v) => setSelectedDateFormat(v)} value={selectedDateFormat}>
                        <SelectTrigger className='w-max'>
                            <SelectValue placeholder="Choose a date format from dob" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                DateFormats.map(f => (
                                    <SelectItem key={f} value={f}>{f.toUpperCase()}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </DialogHeader>
                {
                    loading.state ? (
                        <div className='flex items-center justify-center h-full'>
                            <p className='text-lg'>{loading.kind}{'.'.repeat(dotCount)} </p>
                        </div>
                    ) :
                        parsedData.length <= 0 ? (
                            <>
                                <ul className='list-disc'>
                                    <li>Create an Excel file with the columns: <strong>{csvHeaders.join(", ")}</strong></li>
                                    <li>dob is in the format {selectedDateFormat}. If it is not. Change it before importing using the list above.</li>
                                    <li>gender must only be "male" or "female"</li>
                                    <li>students of the same house must have the same house name.</li>
                                </ul>
                                <input onChange={onFileSelection} ref={inputRef} type="file" accept=".csv" className='hidden' />
                                <Button onClick={handleFileSelectClick}>Select CSV</Button>
                                <DialogFooter>
                                    <Button onClick={() => handleDownloadTemplate()}>Download Template</Button>
                                    <Button variant='destructive'>Cancel</Button>
                                </DialogFooter>
                            </>
                        ) : (<div >
                            <ScrollArea className='h-[70dvh] w-full'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>First Name</TableHead>
                                            <TableHead>Last Name</TableHead>
                                            <TableHead>DOB</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead>House</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedData.map((p, index) => (
                                            <TableRow key={p.firstName + index}>
                                                <TableCell>
                                                    <Input
                                                        value={p.firstName}
                                                        onChange={(e) =>
                                                            updateData(index, "firstName", e.target.value)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={p.lastName}
                                                        onChange={(e) =>
                                                            updateData(index, "lastName", e.target.value)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DatePicker value={p.dob ? dayjs(p.dob) : null} onChange={(date, dateString) => {
                                                            updateData(index, "dob", dateString.toString());
                                                        }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={p.gender} onValueChange={(value) => updateData(index, "gender", value)}>
                                                        <SelectTrigger className='w-max'>
                                                            <SelectValue placeholder={"select gender"} />
                                                        </SelectTrigger>
                                                        <SelectContent className='w-max'>
                                                            <SelectItem value='male'>Male</SelectItem>
                                                            <SelectItem value='female'>Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={p.house}
                                                        onChange={(e) =>
                                                            updateData(index, "house", e.target.value)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                            <DialogFooter>
                                <Button onClick={handleUpload} disabled={loading.state}>Upload</Button>
                                <Button onClick={() => handleDownloadTemplate()}>Download Template</Button>
                                <Button variant='destructive'>Cancel</Button>
                            </DialogFooter>
                        </div>)
                }
            </DialogContent>
        </Dialog>
    )
}

export default ParticipantsCsvImport