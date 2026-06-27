import ViewRideDetailsModal from "@/Components/Dashboard/RideManagementPage/ViewRideDetailsModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useGetAdminRidesQuery } from "@/redux/features/ride/rideApi";
import { formetDateAndTime } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { AllImages } from "../../public/images/AllImages";

const statusTheme = (status: string): 'success' | 'error' | 'warning' | 'blue' | 'purple' | 'orange' => {
    switch (status) {
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        case 'ONGOING': return 'blue';
        case 'ACCEPTED': return 'purple';
        case 'REQUESTED': return 'warning';
        default: return 'orange';
    }
};

const RidesManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IRide | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetAdminRidesQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: filterStatus,
    }, { refetchOnMountOrArgChange: true });

    const rides: IRide[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenModal = (record: IRide) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRecord(null);
        setIsModalOpen(false);
    };

    const columns: Column<IRide>[] = [
        {
            header: "#",
            accessorKey: "id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IRide, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Ride ID",
            accessorKey: "rideId",
            cellClassName: "font-mono font-medium",
        },
        {
            header: "Passenger",
            accessorKey: "passenger",
            render: (value: IRidePassenger) => (
                <div className="flex items-center gap-2">
                    <img
                        src={value?.profileImage ? `${serverUrl}${value.profileImage}` : AllImages.profile}
                        alt={value?.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <span>{value?.name || "—"}</span>
                </div>
            ),
        },
        {
            header: "Service",
            accessorKey: "serviceType",
            render: (value: string) => (
                <span className="text-xs font-medium capitalize">{value?.toLowerCase()}</span>
            ),
        },
        {
            header: "Pickup",
            accessorKey: "pickupAddress",
            render: (value: string) => {
                return (
                    <span title={value} className="block max-w-56 truncate text-xs">
                        {value}
                    </span>
                );
            },
        },
        {
            header: "Dropoff",
            accessorKey: "dropoffAddress",
            render: (value: string) => {
                return (
                    <span title={value} className="block max-w-56 truncate text-xs">
                        {value}
                    </span>
                );
            },
        },
        {
            header: "Distance",
            accessorKey: "distanceKm",
            render: (value: number) => `${value} km`,
        },
        {
            header: "Fare",
            accessorKey: "totalFare",
            render: (value: number) => <span className="font-semibold">${value}</span>,
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={statusTheme(value)}>
                    {value?.charAt(0) + value?.slice(1).toLowerCase()}
                </Tag>
            ),
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            render: (value: string) => value ? formetDateAndTime(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "id",
            render: (_: unknown, record: IRide) => (
                <ReusableTooltip content="View Details">
                    <IoEyeOutline
                        onClick={() => handleOpenModal(record)}
                        className="text-2xl cursor-pointer"
                    />
                </ReusableTooltip>
            ),
        },
    ];

    return (
        <PageWraper title="All Rides">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by ride ID..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All Status" },
                        { value: "REQUESTED", label: "Requested" },
                        { value: "ACCEPTED", label: "Accepted" },
                        { value: "ONGOING", label: "Ongoing" },
                        { value: "COMPLETED", label: "Completed" },
                    ]}
                    onChange={setFilterStatus}
                />
            </div>

            <ReusableTable<IRide>
                data={rides}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewRideDetailsModal
                isOpen={isModalOpen}
                handleCancle={handleCloseModal}
                currentRecord={currentRecord}
            />
        </PageWraper>
    );
};

export default RidesManagementPage;
