import ViewRideDetailsModal from "@/Components/Dashboard/RideManagementPage/ViewRideDetailsModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useGetAdminRidesQuery } from "@/redux/features/ride/rideApi";
import { formetDateAndTime } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { AllImages } from "../../public/images/AllImages";

const CancelledRidesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IRide | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetAdminRidesQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: "CANCELLED",
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
            accessorKey: "_id",
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
            header: "Pickup",
            accessorKey: "pickupLocation",
            render: (value: IRideLocation) => (
                <span title={value?.address} className="block max-w-56 truncate text-xs">
                    {value?.address ?? "—"}
                </span>
            ),
        },
        {
            header: "Dropoff",
            accessorKey: "dropoffLocation",
            render: (value: IRideLocation) => (
                <span title={value?.address} className="block max-w-56 truncate text-xs">
                    {value?.address ?? "—"}
                </span>
            ),
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
            header: "Payment",
            accessorKey: "paymentStatus",
            render: (value: string) => (
                <Tag theme={value === "PAID" ? "success" : value === "PENDING" ? "warning" : "error"}>
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
            accessorKey: "_id",
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
        <PageWraper title="Cancelled Rides">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by ride ID..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
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

export default CancelledRidesPage;
