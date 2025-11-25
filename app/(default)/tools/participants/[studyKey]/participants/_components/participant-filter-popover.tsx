'use client'

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ListFilter, Plus, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { participantStudyStatus } from "./utils";

interface FlagEntry {
    key: string;
    value: string;
}

interface SimpleFormState {
    filterType: "none" | "studyStatus" | "participantId" | "flags" | "linkingCodes" | "surveyKey" | "enteredAt" | "lastSubmission";
    studyStatus: string; // "active", "temporary", "deleted", "virtual", "other"
    studyStatusOther?: string;
    participantId: string;
    flags: FlagEntry[];
    linkingCodes: FlagEntry[];
    surveyKey: string;
    enteredAtDirection: "before" | "after";
    enteredAtDate: string; // ISO yyyy-mm-dd
    lastSubmissionDirection: "before" | "after";
    lastSubmissionDate: string; // ISO yyyy-mm-dd
    lastSubmissionSurveyKey: string;
}

// Helper function to build MongoDB query from simple form state
function buildSimpleQuery(form: SimpleFormState): object {
    if (form.filterType === "none") {
        return {};
    }

    if (form.filterType === "studyStatus") {
        const statusValue = form.studyStatus === "other" ? form.studyStatusOther : form.studyStatus;
        if (statusValue) {
            return { studyStatus: statusValue };
        }
        return {};
    }

    if (form.filterType === "participantId" && form.participantId.trim()) {
        return { participantID: form.participantId.trim() };
    }

    if (form.filterType === "flags") {
        const filters: object[] = form.flags
            .filter((flag) => flag.key.trim())
            .map((flag) => ({ [`flags.${flag.key}`]: flag.value }));

        if (filters.length === 0) return {};
        if (filters.length === 1) return filters[0];
        return { $and: filters };
    }

    if (form.filterType === "linkingCodes") {
        const filters: object[] = form.linkingCodes
            .filter((code) => code.key.trim())
            .map((code) => ({ [`linkingCodes.${code.key}`]: code.value }));

        if (filters.length === 0) return {};
        if (filters.length === 1) return filters[0];
        return { $and: filters };
    }

    if (form.filterType === "surveyKey" && form.surveyKey.trim()) {
        return { "assignedSurveys.surveyKey": form.surveyKey.trim() };
    }

    if (form.filterType === "enteredAt" && form.enteredAtDate.trim()) {
        // Convert ISO date string (yyyy-mm-dd) to POSIX timestamp at 00:00 local time
        const date = new Date(form.enteredAtDate + "T00:00:00");
        const timestamp = Math.floor(date.getTime() / 1000);

        if (form.enteredAtDirection === "before") {
            return { enteredAt: { $lte: timestamp } };
        } else {
            return { enteredAt: { $gte: timestamp } };
        }
    }

    if (form.filterType === "lastSubmission" && form.lastSubmissionDate.trim() && form.lastSubmissionSurveyKey.trim()) {
        // Convert ISO date string (yyyy-mm-dd) to POSIX timestamp at 00:00 local time
        const date = new Date(form.lastSubmissionDate + "T00:00:00");
        const timestamp = Math.floor(date.getTime() / 1000);
        const surveyKey = form.lastSubmissionSurveyKey.trim();
        const operator = form.lastSubmissionDirection === "before" ? "$lte" : "$gte";

        return { [`lastSubmission.${surveyKey}`]: { [operator]: timestamp } };
    }

    return {};
}

// Helper function to validate JSON
function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

// Helper function to serialize form state to JSON string
function serializeFormState(tab: "simple" | "custom", filterType: string): string {
    return JSON.stringify({
        activeTab: tab,
        filterType: filterType,
    });
}

// Helper function to deserialize form state from JSON string
function deserializeFormState(jsonStr: string): { tab: "simple" | "custom"; filterType: string } | null {
    try {
        const parsed = JSON.parse(jsonStr);
        return {
            tab: parsed.activeTab || "simple",
            filterType: parsed.filterType || "none",
        };
    } catch {
        return null;
    }
}

// Helper to parse filter JSON into simple form fields for a given filter type
function parseFilterToSimpleValues(filterJsonStr: string, filterType: SimpleFormState["filterType"]): Partial<SimpleFormState> {
    if (!filterJsonStr.trim()) return {};
    try {
        const obj = JSON.parse(filterJsonStr);
        const defaults: Partial<SimpleFormState> = {};
        if (filterType === "studyStatus") {
            const v = obj.studyStatus;
            if (typeof v === "string") {
                const known = ["active", "temporary", "accountDeleted", "virtual"];
                if (known.includes(v)) {
                    return { studyStatus: v };
                }
                return { studyStatus: "other", studyStatusOther: v };
            }
            return defaults;
        }
        if (filterType === "participantId") {
            const v = obj.participantId;
            if (typeof v === "string") {
                return { participantId: v };
            }
            return defaults;
        }
        const extractPairs = (prefix: string): FlagEntry[] => {
            const pairs: FlagEntry[] = [];
            if (obj.$and && Array.isArray(obj.$and)) {
                for (const cond of obj.$and) {
                    if (cond && typeof cond === "object") {
                        for (const k of Object.keys(cond)) {
                            if (k.startsWith(prefix)) {
                                const val = (cond as Record<string, unknown>)[k];
                                pairs.push({ key: k.substring(prefix.length), value: String(val as unknown as string) });
                            }
                        }
                    }
                }
                return pairs;
            }
            for (const k of Object.keys(obj)) {
                if (k.startsWith(prefix)) {
                    pairs.push({ key: k.substring(prefix.length), value: String(obj[k]) });
                }
            }
            return pairs;
        };
        if (filterType === "flags") {
            const flags = extractPairs("flags.");
            if (flags.length > 0) return { flags };
            return defaults;
        }
        if (filterType === "linkingCodes") {
            const linkingCodes = extractPairs("linkingCodes.");
            if (linkingCodes.length > 0) return { linkingCodes };
            return defaults;
        }
        if (filterType === "surveyKey") {
            const v = obj["assignedSurveys.surveyKey"];
            if (typeof v === "string") {
                return { surveyKey: v };
            }
            return defaults;
        }
        if (filterType === "enteredAt") {
            // Parse { "enteredAt": { "$lte": <ts> } } or { "enteredAt": { "$gte": <ts> } }
            if (obj.enteredAt && typeof obj.enteredAt === "object") {
                const isLte = "$lte" in obj.enteredAt;
                const isGte = "$gte" in obj.enteredAt;
                if (isLte || isGte) {
                    const ts = isLte ? obj.enteredAt.$lte : obj.enteredAt.$gte;
                    if (typeof ts === "number") {
                        const date = new Date(ts * 1000);
                        const isoDate = date.toISOString().split("T")[0]; // yyyy-mm-dd
                        return {
                            enteredAtDirection: isLte ? "before" : "after",
                            enteredAtDate: isoDate,
                        };
                    }
                }
            }
            return defaults;
        }
        if (filterType === "lastSubmission") {
            // Parse { "lastSubmissions.K": { "$lte": <ts> } } or { "lastSubmissions.K": { "$gte": <ts> } }
            for (const k of Object.keys(obj)) {
                if (k.startsWith("lastSubmission.")) {
                    const operator = obj[k];
                    if (typeof operator === "object") {
                        const isLte = "$lte" in operator;
                        const isGte = "$gte" in operator;
                        if (isLte || isGte) {
                            const ts = isLte ? operator.$lte : operator.$gte;
                            if (typeof ts === "number") {
                                const date = new Date(ts * 1000);
                                const isoDate = date.toISOString().split("T")[0]; // yyyy-mm-dd
                                const surveyKey = k.substring("lastSubmission.".length);
                                return {
                                    lastSubmissionDirection: isLte ? "before" : "after",
                                    lastSubmissionDate: isoDate,
                                    lastSubmissionSurveyKey: surveyKey,
                                };
                            }
                        }
                    }
                }
            }
            return defaults;
        }
        return defaults;
    } catch {
        return {};
    }
}

export default function ParticipantFilterPopover({ surveyKeys = [] }: { surveyKeys?: string[] }): JSX.Element {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"simple" | "custom">("simple");

    // Get initial filter from URL
    const initialFilterStr = decodeURIComponent(searchParams.get('filter') || '');

    // Simple form state
    const [simpleForm, setSimpleForm] = useState<SimpleFormState>({
        filterType: "none",
        studyStatus: "active",
        studyStatusOther: "",
        participantId: "",
        flags: [],
        linkingCodes: [],
        surveyKey: "",
        enteredAtDirection: "after",
        enteredAtDate: "",
        lastSubmissionDirection: "after",
        lastSubmissionDate: "",
        lastSubmissionSurveyKey: "",
    });

    // Custom JSON state
    const [customFilter, setCustomFilter] = useState<string>("");
    const [customFilterError, setCustomFilterError] = useState<string>("");

    // Initialize from URL on mount
    useEffect(() => {
        if (initialFilterStr) {
            setCustomFilter(initialFilterStr);
        }

        // Load form state from URL if available (only activeTab and filterType)
        const formStateStr = searchParams.get('formState');
        if (formStateStr) {
            const decoded = decodeURIComponent(formStateStr);
            const deserialized = deserializeFormState(decoded);
            if (deserialized) {
                setActiveTab(deserialized.tab);
                setSimpleForm((prev) => ({
                    ...prev,
                    filterType: deserialized.filterType as SimpleFormState["filterType"],
                }));
            }
        }
    }, [initialFilterStr, searchParams]);


    const handleAddFlag = () => {
        setSimpleForm((prev) => ({
            ...prev,
            flags: [...prev.flags, { key: "", value: "" }],
        }));
    };

    const handleRemoveFlag = (index: number) => {
        setSimpleForm((prev) => ({
            ...prev,
            flags: prev.flags.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateFlag = (index: number, key: "key" | "value", value: string) => {
        setSimpleForm((prev) => ({
            ...prev,
            flags: prev.flags.map((flag, i) =>
                i === index ? { ...flag, [key]: value } : flag
            ),
        }));
    };

    const handleAddLinkingCode = () => {
        setSimpleForm((prev) => ({
            ...prev,
            linkingCodes: [...prev.linkingCodes, { key: "", value: "" }],
        }));
    };

    const handleRemoveLinkingCode = (index: number) => {
        setSimpleForm((prev) => ({
            ...prev,
            linkingCodes: prev.linkingCodes.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateLinkingCode = (index: number, key: "key" | "value", value: string) => {
        setSimpleForm((prev) => ({
            ...prev,
            linkingCodes: prev.linkingCodes.map((code, i) =>
                i === index ? { ...code, [key]: value } : code
            ),
        }));
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams);
        let filterQuery: object;

        if (activeTab === "custom") {
            if (!customFilter.trim()) {
                params.delete('filter');
            } else {
                if (!isValidJSON(customFilter)) {
                    setCustomFilterError("Invalid JSON");
                    return;
                }
                params.set('filter', encodeURIComponent(customFilter));
            }
        } else {
            filterQuery = buildSimpleQuery(simpleForm);
            if (Object.keys(filterQuery).length === 0) {
                params.delete('filter');
            } else {
                params.set('filter', encodeURIComponent(JSON.stringify(filterQuery)));
            }
        }

        // Save current activeTab and filterType to URL
        const formState = serializeFormState(activeTab, simpleForm.filterType);
        params.set('formState', encodeURIComponent(formState));

        // Reset page to 1 when filter changes
        params.set('page', '1');

        replace(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const handleClear = () => {
        setSimpleForm({
            filterType: "none",
            studyStatus: "active",
            studyStatusOther: "",
            participantId: "",
            flags: [],
            linkingCodes: [],
            surveyKey: "",
            enteredAtDirection: "after",
            enteredAtDate: "",
            lastSubmissionDirection: "after",
            lastSubmissionDate: "",
            lastSubmissionSurveyKey: "",
        });
        setCustomFilter("");
        setCustomFilterError("");
        setActiveTab("simple");

        // Apply clear to URL and close
        const params = new URLSearchParams(searchParams);
        params.delete('filter');
        const formState = serializeFormState("simple", "none");
        params.set('formState', encodeURIComponent(formState));
        // Reset page to 1 on clear as well
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handlePopoverOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // Restore activeTab and filterType from URL
            const formStateStr = searchParams.get('formState');
            if (formStateStr) {
                const decoded = decodeURIComponent(formStateStr);
                const deserialized = deserializeFormState(decoded);
                if (deserialized) {
                    setActiveTab(deserialized.tab);
                    setSimpleForm((prev) => ({
                        ...prev,
                        filterType: deserialized.filterType as SimpleFormState["filterType"],
                        // reset values, then populate from filter below
                        studyStatus: "active",
                        studyStatusOther: "",
                        participantId: "",
                        flags: [],
                        linkingCodes: [],
                        surveyKey: "",
                        enteredAtDirection: "after",
                        enteredAtDate: "",
                        lastSubmissionDirection: "after",
                        lastSubmissionDate: "",
                        lastSubmissionSurveyKey: "",
                    }));
                }
            } else {
                // default open state
                setActiveTab("simple");
                setSimpleForm((prev) => ({
                    ...prev,
                    filterType: "none",
                    studyStatus: "active",
                    studyStatusOther: "",
                    participantId: "",
                    flags: [],
                    linkingCodes: [],
                    surveyKey: "",
                    enteredAtDirection: "after",
                    enteredAtDate: "",
                    lastSubmissionDirection: "after",
                    lastSubmissionDate: "",
                    lastSubmissionSurveyKey: "",
                }));
            }

            // Populate values from filter URL if applicable
            const filterStr = searchParams.get('filter');
            if (filterStr) {
                const decodedFilter = decodeURIComponent(filterStr);
                setCustomFilter(decodedFilter);
                const values = parseFilterToSimpleValues(decodedFilter, (formStateStr ? (deserializeFormState(decodeURIComponent(formStateStr || ''))?.filterType as SimpleFormState["filterType"]) : simpleForm.filterType));
                if (values && Object.keys(values).length > 0) {
                    setSimpleForm((prev) => ({ ...prev, ...values }));
                }
            } else {
                setCustomFilter("");
            }
        }
    };

    const handleCustomFilterChange = (value: string) => {
        setCustomFilter(value);
        if (value.trim() && !isValidJSON(value)) {
            setCustomFilterError("Invalid JSON format");
        } else {
            setCustomFilterError("");
        }
    };

    const hasFilters = initialFilterStr.length > 0;

    return (
        <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
                <Button variant='outline' className='rounded-full shadow-sm'>
                    <ListFilter className='size-4 me-1' />
                    Filter
                    {hasFilters && <span className="inline-block size-2 rounded-full bg-primary" />}
                    <ChevronDown className='size-4 ml-2' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="rounded-xl w-[500px] p-0 flex flex-col">
                <div className="p-4 border-b border-border">
                    <Tabs
                        value={activeTab}
                        onValueChange={(v) => setActiveTab(v as "simple" | "custom")}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="simple">Simple Filter</TabsTrigger>
                            <TabsTrigger value="custom">Custom JSON</TabsTrigger>
                        </TabsList>

                        <TabsContent value="simple" className="mt-4 space-y-4">
                            <div className="space-y-6 max-h-96 overflow-y-auto p-2">
                                {/* Filter Type Selection */}
                                <Field className="gap-2">
                                    <FieldLabel>Filter Type</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            onValueChange={(value) => {
                                                setSimpleForm((prev) => ({
                                                    ...prev,
                                                    filterType: value as SimpleFormState["filterType"],
                                                }));
                                            }} defaultValue={simpleForm.filterType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a filter type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No filter</SelectItem>
                                                <SelectItem value="studyStatus">Study Status</SelectItem>
                                                <SelectItem value="participantId">Participant ID</SelectItem>
                                                <SelectItem value="flags">Participant Flags</SelectItem>
                                                <SelectItem value="linkingCodes">Linking Codes</SelectItem>
                                                <SelectItem value="surveyKey">Survey Key</SelectItem>
                                                <SelectItem value="enteredAt">Joined</SelectItem>
                                                <SelectItem value="lastSubmission">Last Submission</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>

                                {/* Study Status Filter */}
                                {simpleForm.filterType === "studyStatus" && (
                                    <Field className="gap-1">
                                        <FieldLabel>Select Status</FieldLabel>
                                        <FieldContent>
                                            <RadioGroup
                                                value={simpleForm.studyStatus}
                                                className="flex flex-col gap-0"
                                                onValueChange={(value) => setSimpleForm((prev) => ({ ...prev, studyStatus: value, studyStatusOther: "" }))}
                                            >
                                                <Label htmlFor="status-active" className="font-normal cursor-pointer grow flex items-center gap-2 hover:bg-muted rounded-md p-2">
                                                    <RadioGroupItem value={participantStudyStatus.active.value} id="status-active" />
                                                    {participantStudyStatus.active.label}
                                                </Label>
                                                <Label htmlFor="status-temporary" className="font-normal cursor-pointer grow flex items-center gap-2 hover:bg-muted rounded-md p-2">
                                                    <RadioGroupItem value={participantStudyStatus.temporary.value} id="status-temporary" />
                                                    {participantStudyStatus.temporary.label}
                                                </Label>
                                                <Label htmlFor="status-deleted" className="font-normal cursor-pointer grow flex items-center gap-2 hover:bg-muted rounded-md p-2">
                                                    <RadioGroupItem value={participantStudyStatus.accountDeleted.value} id="status-deleted" />
                                                    {participantStudyStatus.accountDeleted.label}
                                                </Label>
                                                <Label htmlFor="status-virtual" className="font-normal cursor-pointer grow flex items-center gap-2 hover:bg-muted rounded-md p-2">
                                                    <RadioGroupItem value={participantStudyStatus.virtual.value} id="status-virtual" />
                                                    {participantStudyStatus.virtual.label}
                                                </Label>
                                                <Label htmlFor="status-other" className="font-normal cursor-pointer grow flex items-center gap-2 hover:bg-muted rounded-md p-2">
                                                    <RadioGroupItem value={participantStudyStatus.other.value} id="status-other" />
                                                    {participantStudyStatus.other.label}
                                                </Label>
                                            </RadioGroup>
                                            {simpleForm.studyStatus === participantStudyStatus.other.value && (
                                                <Input
                                                    placeholder="Enter custom status value"
                                                    value={simpleForm.studyStatusOther}
                                                    onChange={(e) => setSimpleForm((prev) => ({ ...prev, studyStatusOther: e.target.value }))}
                                                    className="mt-2"
                                                />
                                            )}
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Participant ID Filter */}
                                {simpleForm.filterType === "participantId" && (
                                    <Field>
                                        <FieldLabel htmlFor="participant-id">Enter Participant ID</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id="participant-id"
                                                placeholder="Enter participant ID"
                                                value={simpleForm.participantId}
                                                onChange={(e) => setSimpleForm((prev) => ({ ...prev, participantId: e.target.value }))}
                                            />
                                            <FieldDescription>Filter for a single participant by ID</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Flags Filter */}
                                {simpleForm.filterType === "flags" && (
                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel>Participant Flags</FieldLabel>
                                            <Button size="sm" variant="ghost" onClick={handleAddFlag}>
                                                <Plus className="size-3 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                        <FieldContent>
                                            {simpleForm.flags.length === 0 && (
                                                <p className="text-sm text-muted-foreground text-center p-4 border border-dashed border-border rounded-md">No flags added</p>
                                            )}
                                            {simpleForm.flags.map((flag, index) => (
                                                <div key={index} className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Flag key"
                                                            value={flag.key}
                                                            onChange={(e) => handleUpdateFlag(index, "key", e.target.value)}
                                                            size={1}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Flag value"
                                                            value={flag.value}
                                                            onChange={(e) => handleUpdateFlag(index, "value", e.target.value)}
                                                            size={1}
                                                        />
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveFlag(index)}
                                                        className="h-10 w-10 flex-shrink-0"
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <FieldDescription>Filter by participant flags (key and value). If you add multiple flags, all must match.</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Linking Codes Filter */}
                                {simpleForm.filterType === "linkingCodes" && (
                                    <Field>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel>Linking Codes</FieldLabel>
                                            <Button size="sm" variant="ghost" onClick={handleAddLinkingCode}>
                                                <Plus className="size-3 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                        <FieldContent>
                                            {simpleForm.linkingCodes.length === 0 && (
                                                <p className="text-sm text-muted-foreground text-center p-4 border border-dashed border-border rounded-md">No linking codes added</p>
                                            )}
                                            {simpleForm.linkingCodes.map((code, index) => (
                                                <div key={index} className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Code key"
                                                            value={code.key}
                                                            onChange={(e) => handleUpdateLinkingCode(index, "key", e.target.value)}
                                                            size={1}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Code value"
                                                            value={code.value}
                                                            onChange={(e) => handleUpdateLinkingCode(index, "value", e.target.value)}
                                                            size={1}
                                                        />
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveLinkingCode(index)}
                                                        className="h-10 w-10 flex-shrink-0"
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <FieldDescription>Filter by linking codes (key and value). If you add multiple codes, all must match.</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Survey Key Filter */}
                                {simpleForm.filterType === "surveyKey" && (
                                    <Field>
                                        <FieldLabel htmlFor="survey-key">Enter Survey Key</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id="survey-key"
                                                placeholder="Enter survey key"
                                                value={simpleForm.surveyKey}
                                                onChange={(e) => setSimpleForm((prev) => ({ ...prev, surveyKey: e.target.value }))}
                                            />
                                            <FieldDescription>Filter for participants with this survey assigned</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Joined (enteredAt) Filter */}
                                {simpleForm.filterType === "enteredAt" && (
                                    <Field>
                                        <FieldLabel>Filter by Joined Date</FieldLabel>
                                        <FieldContent>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium">Before or After</label>
                                                    <RadioGroup
                                                        value={simpleForm.enteredAtDirection}
                                                        className="flex gap-4 mt-2"
                                                        onValueChange={(value) => setSimpleForm((prev) => ({ ...prev, enteredAtDirection: value as "before" | "after" }))}
                                                    >
                                                        <Label htmlFor="entered-before" className="font-normal cursor-pointer flex items-center gap-2">
                                                            <RadioGroupItem value="before" id="entered-before" />
                                                            Before
                                                        </Label>
                                                        <Label htmlFor="entered-after" className="font-normal cursor-pointer flex items-center gap-2">
                                                            <RadioGroupItem value="after" id="entered-after" />
                                                            After
                                                        </Label>
                                                    </RadioGroup>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Select Date</label>
                                                    <Input
                                                        type="date"
                                                        value={simpleForm.enteredAtDate}
                                                        onChange={(e) => setSimpleForm((prev) => ({ ...prev, enteredAtDate: e.target.value }))}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                            <FieldDescription>Filter participants by their join date (inclusive)</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}

                                {/* Last Submission Filter */}
                                {simpleForm.filterType === "lastSubmission" && (
                                    <Field>
                                        <FieldLabel>Filter by Last Submission</FieldLabel>
                                        <FieldContent>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium">Before or After</label>
                                                    <RadioGroup
                                                        value={simpleForm.lastSubmissionDirection}
                                                        className="flex gap-4 mt-2"
                                                        onValueChange={(value) => setSimpleForm((prev) => ({ ...prev, lastSubmissionDirection: value as "before" | "after" }))}
                                                    >
                                                        <Label htmlFor="lastSub-before" className="font-normal cursor-pointer flex items-center gap-2">
                                                            <RadioGroupItem value="before" id="lastSub-before" />
                                                            Before
                                                        </Label>
                                                        <Label htmlFor="lastSub-after" className="font-normal cursor-pointer flex items-center gap-2">
                                                            <RadioGroupItem value="after" id="lastSub-after" />
                                                            After
                                                        </Label>
                                                    </RadioGroup>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Select Date</label>
                                                    <Input
                                                        type="date"
                                                        value={simpleForm.lastSubmissionDate}
                                                        onChange={(e) => setSimpleForm((prev) => ({ ...prev, lastSubmissionDate: e.target.value }))}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Survey Key</label>
                                                    <Select
                                                        onValueChange={(value) => setSimpleForm((prev) => ({ ...prev, lastSubmissionSurveyKey: value }))}
                                                        defaultValue={simpleForm.lastSubmissionSurveyKey}
                                                    >
                                                        <SelectTrigger className="mt-2">
                                                            <SelectValue placeholder="Select survey key" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {surveyKeys.map((key) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {key}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <FieldDescription>Filter participants by their last submission date for a specific survey (inclusive)</FieldDescription>
                                        </FieldContent>
                                    </Field>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="mt-4">
                            <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                                <div>
                                    <label className="text-sm font-medium">MongoDB Query</label>
                                    <Textarea
                                        placeholder='{ "studyStatus": "active" }'
                                        value={customFilter}
                                        rows={5}
                                        onChange={(e) => handleCustomFilterChange(e.target.value)}
                                        className={`mt-2 font-mono text-xs ${customFilterError ? "border-destructive" : ""}`}
                                    />
                                    {customFilterError && (
                                        <p className="text-destructive text-xs mt-1">{customFilterError}</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t border-border">
                    <Button variant="outline" onClick={handleClear}>
                        Clear Filter
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply}>
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
