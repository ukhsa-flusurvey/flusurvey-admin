'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarDays, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface ReportsToolbarClientProps {
    reportKeys: Array<string>;
    pid?: string;
    fromDate?: Date;
    untilDate?: Date;
}

export default function ReportsToolbarClient(props: ReportsToolbarClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [pid, setPid] = React.useState(props.pid || "");
    const [from, setFrom] = React.useState<Date | undefined>(props.fromDate);
    const [until, setUntil] = React.useState<Date | undefined>(props.untilDate);
    const [fromOpen, setFromOpen] = React.useState(false);
    const [untilOpen, setUntilOpen] = React.useState(false);
    const [filtersOpen, setFiltersOpen] = React.useState(false);


    const selectedReportKey = searchParams.get('reportKey') || undefined;

    React.useEffect(() => {
        // if reportKey in URL is not valid anymore, remove it
        const current = new URLSearchParams(searchParams.toString());

        const before = current.toString();
        if (props.reportKeys.length < 1) {
            current.delete('reportKey');
        } else if (!selectedReportKey || !props.reportKeys.includes(selectedReportKey)) {
            current.set('reportKey', props.reportKeys[0]);
        }

        const after = current.toString();
        if (before !== after) {
            const qs = after;
            router.replace(qs ? `${pathname}?${qs}` : pathname);
        }
        return;
    }, [props.reportKeys, selectedReportKey, pathname, router, searchParams]);

    const updateQuery = React.useCallback((updates: Record<string, string | undefined>) => {
        const current = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        router.replace(`${pathname}?${current.toString()}`);
    }, [pathname, router, searchParams]);

    const onSelectReportKey = (value: string) => {
        updateQuery({ reportKey: value || undefined });
    };

    const onApplyFilters = () => {
        updateQuery({
            pid: pid || undefined,
            from: from ? Math.floor(from.getTime() / 1000).toString() : undefined,
            until: until ? Math.floor(until.getTime() / 1000).toString() : undefined,
        });
        setFiltersOpen(false);
    };

    const onClearFilters = () => {
        setPid("");
        setFrom(undefined);
        setUntil(undefined);
        updateQuery({ pid: undefined, from: undefined, until: undefined });
        setFiltersOpen(false);
    };

    const hasActiveFilters = Boolean(searchParams.get('pid') || searchParams.get('from') || searchParams.get('until'));

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedReportKey || ""}
                onValueChange={onSelectReportKey}
            >
                <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select report key" />
                </SelectTrigger>
                <SelectContent>
                    {props.reportKeys.map((rk) => (
                        <SelectItem key={rk} value={rk}>{rk}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                        <Filter className="size-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-2 inline-block size-2 rounded-full bg-primary" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="pid">Participant ID</Label>
                            <Input id="pid" value={pid} onChange={(e) => setPid(e.target.value)} placeholder="Optional" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                                <Label>From</Label>
                                <Popover open={fromOpen} onOpenChange={setFromOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start">
                                            <CalendarDays className="size-4 mr-2" />
                                            {from ? format(from, 'yyyy-MM-dd') : 'Select'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={from}
                                            onSelect={(date) => {
                                                setFrom(date);
                                                if (date) {
                                                    setFromOpen(false);
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Until</Label>
                                <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start">
                                            <CalendarDays className="size-4 mr-2" />
                                            {until ? format(until, 'yyyy-MM-dd') : 'Select'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={until}
                                            onSelect={(date) => {
                                                setUntil(date);
                                                if (date) {
                                                    setUntilOpen(false);
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={onClearFilters}>
                                <X className="size-4 mr-2" /> Clear
                            </Button>
                            <Button size="sm" onClick={onApplyFilters}>Apply</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}


