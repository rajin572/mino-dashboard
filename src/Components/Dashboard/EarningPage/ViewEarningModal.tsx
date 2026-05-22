import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import { getImageUrl } from '@/helpers/config/envConfig';
import { formetDateAndTime } from '@/utils/dateFormet';
import {
    BadgeDollarSign,
    CalendarDays,
    CreditCard,
    Hash,
    Percent,
    Receipt,
    Tag,
    TrendingUp,
    User,
} from 'lucide-react';
import { AllImages } from '../../../../public/images/AllImages';

const Row = ({
    icon,
    label,
    value,
    valueClass = '',
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span className="text-xs sm:text-sm">{label}</span>
        </div>
        <span className={`text-xs sm:text-sm font-semibold text-foreground ${valueClass}`}>
            {value}
        </span>
    </div>
);

const ViewEarningModal = ({
    isOpen,
    handleCancle,
    currentRecord,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IPayment | null;
}) => {
    const serverUrl = getImageUrl();
    const passenger = currentRecord?.passengerId;

    const statusColor =
        currentRecord?.paymentStatus === 'PAID'
            ? 'bg-green-100 text-green-600'
            : currentRecord?.paymentStatus === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-600';

    return (
        <ReusableModal
            maxWidth="sm:max-w-lg"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Payment Details"
            footer={null}
        >
            <div className="flex flex-col gap-5">

                {/* Passenger Header */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <img
                        src={
                            passenger?.profileImage
                                ? `${serverUrl}${passenger.profileImage}`
                                : AllImages.profile
                        }
                        alt={passenger?.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                            {passenger?.name || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {passenger?.phoneNumber || '—'}
                        </p>
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${statusColor}`}
                    >
                        {currentRecord?.paymentStatus
                            ? currentRecord.paymentStatus.charAt(0) +
                            currentRecord.paymentStatus.slice(1).toLowerCase()
                            : '—'}
                    </span>
                </div>

                {/* Transaction Info */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2 bg-muted/40 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Transaction Info
                        </p>
                    </div>
                    <div className="px-4">
                        <Row
                            icon={<Hash className="size-3.5" />}
                            label="Transaction ID"
                            value={currentRecord?.transactionId || '—'}
                            valueClass="font-mono"
                        />
                        <Row
                            icon={<CreditCard className="size-3.5" />}
                            label="Payment Method"
                            value={
                                currentRecord?.paymentMethod
                                    ? currentRecord.paymentMethod.charAt(0) +
                                    currentRecord.paymentMethod.slice(1).toLowerCase()
                                    : '—'
                            }
                        />
                        <Row
                            icon={<CalendarDays className="size-3.5" />}
                            label="Paid At"
                            value={
                                currentRecord?.paidAt
                                    ? formetDateAndTime(currentRecord.paidAt)
                                    : '—'
                            }
                        />
                    </div>
                </div>

                {/* Fare Breakdown */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2 bg-muted/40 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Fare Breakdown
                        </p>
                    </div>
                    <div className="px-4">
                        <Row
                            icon={<Receipt className="size-3.5" />}
                            label="Estimated Fare"
                            value={`$${currentRecord?.estimatedFare ?? 0}`}
                        />
                        <Row
                            icon={<BadgeDollarSign className="size-3.5" />}
                            label="Total Fare"
                            value={`$${currentRecord?.amount ?? 0}`}
                        />
                        <Row
                            icon={<TrendingUp className="size-3.5" />}
                            label="Tip"
                            value={`$${currentRecord?.tip ?? 0}`}
                        />
                        {currentRecord?.promo && (
                            <Row
                                icon={<Tag className="size-3.5" />}
                                label="Promo"
                                value={currentRecord.promo}
                            />
                        )}
                        {(currentRecord?.promoDiscount ?? 0) > 0 && (
                            <Row
                                icon={<Percent className="size-3.5" />}
                                label="Promo Discount"
                                value={`-$${currentRecord?.promoDiscount}`}
                                valueClass="text-emerald-600"
                            />
                        )}
                    </div>
                </div>

                {/* Earnings Split */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-blue-500">
                            <User className="size-3.5" />
                            <span className="text-xs font-medium">Admin Commission</span>
                        </div>
                        <p className="text-lg font-bold text-blue-700">
                            ${currentRecord?.adminCommission ?? 0}
                        </p>
                    </div>
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-violet-500">
                            <BadgeDollarSign className="size-3.5" />
                            <span className="text-xs font-medium">Driver Earning</span>
                        </div>
                        <p className="text-lg font-bold text-violet-700">
                            ${currentRecord?.driverEarning ?? 0}
                        </p>
                    </div>
                </div>
            </div>
        </ReusableModal>
    );
};

export default ViewEarningModal;
