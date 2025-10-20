export const participantStudyStatus = {
    active: {
        label: "Active",
        value: "active",
        bgColor: "bg-green-600",
        borderColor: "border-green-600",
    },
    temporary: {
        label: "Temporary",
        value: "temporary",
        bgColor: "bg-yellow-600",
        borderColor: "border-yellow-600",
    },
    accountDeleted: {
        label: "Deleted",
        value: "accountDeleted",
        bgColor: "bg-red-600",
        borderColor: "border-red-600",
    },
    virtual: {
        label: "Virtual",
        value: "virtual",
        bgColor: "bg-blue-600",
        borderColor: "border-blue-600",
    },
    other: {
        label: "Other",
        value: "other",
        bgColor: "bg-gray-600",
        borderColor: "border-gray-600",
    },
} as const;

