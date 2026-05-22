import ViewEarningModal from "@/Components/Dashboard/EarningPage/ViewEarningModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useGetPaymentsQuery } from "@/redux/features/payment/paymentApi";
import { formetDateAndTime } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { AllImages } from "../../public/images/AllImages";

const EarningPage = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRecord, setCurrentRecord] = useState<IPayment | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetPaymentsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
    }, { refetchOnMountOrArgChange: true });

    const payments: IPayment[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenView = (record: IPayment) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseView = () => {
        setCurrentRecord(null);
        setIsViewModalOpen(false);
    };

    const columns: Column<IPayment>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IPayment, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Transaction ID",
            accessorKey: "transactionId",
            cellClassName: "font-medium font-mono",
        },
        {
            header: "Passenger",
            accessorKey: "passengerId",
            render: (value: IPaymentPassenger) => (
                <div className="flex items-center gap-2">
                    <img
                        src={
                            value?.profileImage
                                ? `${serverUrl}${value.profileImage}`
                                : AllImages.profile
                        }
                        alt={value?.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <span>{value?.name || "—"}</span>
                </div>
            ),
        },
        {
            header: "Total Fare",
            accessorKey: "amount",
            render: (value: number) => (
                <span className="font-semibold">${value}</span>
            ),
        },
        {
            header: "Admin Commission",
            accessorKey: "adminCommission",
            render: (value: number) => `$${value}`,
        },
        {
            header: "Driver Earning",
            accessorKey: "driverEarning",
            render: (value: number) => `$${value}`,
        },
        // {
        //     header: "Method",
        //     accessorKey: "paymentMethod",
        //     render: (value: string) => (
        //         <span className="capitalize text-xs font-medium">
        //             {value?.charAt(0) + value?.slice(1).toLowerCase()}
        //         </span>
        //     ),
        // },
        {
            header: "Status",
            accessorKey: "paymentStatus",
            render: (value: string) => (
                <Tag theme={value === "PAID" ? "success" : value === "PENDING" ? "warning" : "error"}>
                    {value?.charAt(0) + value?.slice(1).toLowerCase()}
                </Tag>
            ),
        },
        {
            header: "Date",
            accessorKey: "paidAt",
            render: (value: string) =>
                value ? formetDateAndTime(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IPayment) => (
                <ReusableTooltip content="View Details">
                    <IoEyeOutline
                        onClick={() => handleOpenView(record)}
                        className="text-2xl cursor-pointer"
                    />
                </ReusableTooltip>
            ),
        },
    ];

    return (
        <PageWraper title="Earnings">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by transaction ID..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
            </div>
            <ReusableTable<IPayment>
                data={payments}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewEarningModal
                isOpen={isViewModalOpen}
                handleCancle={handleCloseView}
                currentRecord={currentRecord}
            />
        </PageWraper>
    );
};

export default EarningPage;
