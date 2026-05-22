import ViewDriverDetailsPage from "@/Components/Dashboard/AllDriversPage/ViewDriverDetailsPage";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useGetApprovedDriversQuery } from "@/redux/features/driver/driverApi";
import { formatDate } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { AllImages } from "../../../public/images/AllImages";

const AllDriversPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IDriver | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetApprovedDriversQuery(
        { page: currentPage, limit, searchTerm: search || undefined },
        { refetchOnMountOrArgChange: true }
    );

    const drivers: IDriver[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenModal = (record: IDriver) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
    };

    const columns: Column<IDriver>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IDriver, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Driver",
            accessorKey: "name",
            render: (value: string, record: IDriver) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.profileImage ? `${serverUrl}${record.profileImage}` : AllImages.profile}
                        alt={value}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <span className="font-medium">{value || "—"}</span>
                </div>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone",
            accessorKey: "phoneNumber",
            render: (value: string, record: IDriver) =>
                `${record.countryCode} ${value}`,
        },
        {
            header: "Gender",
            accessorKey: "gender",
            render: (value: string) => <span className="capitalize">{value || "—"}</span>,
        },
        {
            header: "Vehicle Type",
            accessorKey: "driverProfileId",
            render: (value: IDriverProfile | null) => value?.vehicleType?.replace(/_/g, ' ') || "—",
        },
        {
            header: "Rating",
            accessorKey: "averageRating",
            render: (value: number) => <ReuseRating value={value ?? 0} size={16} showValue />,
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={value === "active" ? "success" : value === "banned" ? "error" : "warning"} className="capitalize">
                    {value}
                </Tag>
            ),
        },
        {
            header: "Joined",
            accessorKey: "createdAt",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IDriver) => (
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
        <PageWraper title="All Drivers">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by name or email..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
            </div>
            <ReusableTable<IDriver>
                data={drivers}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />
            <ViewDriverDetailsPage
                isOpen={isModalOpen}
                handleCancle={handleCloseModal}
                currentRecord={currentRecord}
                approvalModal={false}
            />
        </PageWraper>
    );
};

export default AllDriversPage;
