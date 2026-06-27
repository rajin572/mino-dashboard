import ViewPassengerModal from "@/Components/Dashboard/Passenger/PassengerModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import {
    useBanUserMutation,
    useGetPassengersQuery,
    useUnbanUserMutation,
    useWarnUserMutation,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";

const PassengerPage = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IUser | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data, isFetching } = useGetPassengersQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: filterStatus,
    }, { refetchOnMountOrArgChange: true });

    const [banUser, { isLoading: isBanning }] = useBanUserMutation();
    const [unbanUser, { isLoading: isUnbanning }] = useUnbanUserMutation();
    const [warnUser, { isLoading: isWarning }] = useWarnUserMutation();

    const passengers: IUser[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenView = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseView = () => {
        setCurrentRecord(null);
        setIsViewModalOpen(false);
    };

    const handleBanClick = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(false);
        setIsBanModalOpen(true);
    };

    const handleWarnClick = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(false);
        setIsWarnModalOpen(true);
    };

    const handleBanConfirm = async (record: IUser, reason?: string) => {
        try {
            if (record.status === "banned") {
                await unbanUser({ userId: record.id }).unwrap();
                toast.success("User unbanned successfully");
            } else {
                await banUser({ userId: record.id, reason: reason ?? "" }).unwrap();
                toast.success("User banned successfully");
            }
            setIsBanModalOpen(false);
            setCurrentRecord(null);
        } catch {
            toast.error("Failed to update ban status");
        }
    };

    const handleWarnConfirm = async (record: IUser, reason?: string) => {
        try {
            await warnUser({ userId: record.id, reason: reason ?? "" }).unwrap();
            toast.success("Warning sent successfully");
            setIsWarnModalOpen(false);
            setCurrentRecord(null);
        } catch {
            toast.error("Failed to send warning");
        }
    };

    const isBanned = currentRecord?.status === "banned";

    const columns: Column<IUser>[] = [
        {
            header: "ID",
            accessorKey: "id",
            headerClassName: "",
            cellClassName: "font-medium",
            fixed: true,
            width: 100,
            render: (_: unknown, __: IUser, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Full Name",
            accessorKey: "name",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone Number",
            accessorKey: "phoneNumber",
        },
        {
            header: "Gender",
            accessorKey: "gender",
        },
        {
            header: "Age",
            accessorKey: "dateOfBirth",
            render: (value: string) => {
                if (!value) return "—";
                const birth = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                return age;
            },
        },
        {
            header: "Rating",
            accessorKey: "rating",
            render: (value: number) => <ReuseRating value={value} size={20} showValue />,
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${value === "banned"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                        }`}
                >
                    {value === "banned" ? "Blocked" : "Active"}
                </span>
            ),
        },
        {
            header: "Action",
            accessorKey: "name",
            render: (_: unknown, record: IUser) => (
                <div>
                    <ReusableTooltip content="View Details">
                        <IoEyeOutline
                            onClick={() => handleOpenView(record)}
                            className="text-2xl cursor-pointer"
                        />
                    </ReusableTooltip>
                </div>
            ),
        },
    ];

    return (
        <PageWraper title="Passengers">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All" },
                        { value: "active", label: "Active" },
                        { value: "banned", label: "Banned" },
                    ]}
                    onChange={setFilterStatus}
                />
            </div>

            <ReusableTable<IUser>
                data={passengers}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            {/* View Details Modal */}
            <ViewPassengerModal
                isOpen={isViewModalOpen}
                handleCancle={handleCloseView}
                currentRecord={currentRecord}
                onBan={handleBanClick}
                onWarn={handleWarnClick}
            />

            {/* Ban / Unban Confirm Modal */}
            <ConfirmModal<IUser>
                open={isBanModalOpen}
                onCancel={() => {
                    setIsBanModalOpen(false);
                    setCurrentRecord(null);
                }}
                currentRecord={currentRecord}
                onConfirm={handleBanConfirm}
                title={isBanned ? "Unban this user?" : "Ban this user?"}
                description={
                    isBanned
                        ? "The user will regain full access to the platform."
                        : "The user will be blocked from accessing the platform."
                }
                confirmText={isBanned ? "Unban" : "Ban"}
                variant={isBanned ? "success" : "danger"}
                iconPreset={isBanned ? "unblock" : "block"}
                withReason={!isBanned}
                reasonLabel="Ban Reason"
                loading={isBanning || isUnbanning}
            />

            {/* Send Warning Confirm Modal */}
            <ConfirmModal<IUser>
                open={isWarnModalOpen}
                onCancel={() => {
                    setIsWarnModalOpen(false);
                    setCurrentRecord(null);
                }}
                currentRecord={currentRecord}
                onConfirm={handleWarnConfirm}
                title="Send Warning"
                description="A warning notification will be sent to this user."
                confirmText="Send Warning"
                variant="warning"
                iconPreset="decline"
                withReason={true}
                reasonLabel="Warning Reason"
                loading={isWarning}
            />
        </PageWraper>
    );
};

export default PassengerPage;
