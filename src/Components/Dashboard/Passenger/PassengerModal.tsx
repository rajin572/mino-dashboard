import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import { getImageUrl } from '@/helpers/config/envConfig';
import { formatDate, formetDateAndTime } from '@/utils/dateFormet';
import {
    AlertTriangle,
    Calendar,
    Clock,
    Globe,
    Mail,
    Phone,
    Star,
    Wallet,
} from 'lucide-react';
import { AllImages } from '../../../../public/images/AllImages';

const calcAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const ViewPassengerModal = ({
    isOpen,
    handleCancle,
    currentRecord,
    onBan,
    onWarn,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IUser | null;
    onBan: (record: IUser) => void;
    onWarn: (record: IUser) => void;
}) => {
    const serverUrl = getImageUrl();
    const isBanned = currentRecord?.status === 'banned';
    const warningLogs = currentRecord?.warnings?.logs ?? [];

    const infoRows = [
        {
            icon: <Mail className="size-3.5 text-muted-foreground" />,
            label: 'Email',
            value: currentRecord?.email || '—',
        },
        {
            icon: <Phone className="size-3.5 text-muted-foreground" />,
            label: 'Phone',
            value: currentRecord
                ? `${currentRecord.countryCode} ${currentRecord.phoneNumber}`
                : '—',
        },
        {
            icon: <Globe className="size-3.5 text-muted-foreground" />,
            label: 'Country',
            value: currentRecord?.country || '—',
        },
        {
            icon: <Calendar className="size-3.5 text-muted-foreground" />,
            label: 'Age',
            value: currentRecord?.dateOfBirth
                ? `${calcAge(currentRecord.dateOfBirth)} yrs`
                : '—',
        },
        {
            icon: <Star className="size-3.5 text-muted-foreground" />,
            label: 'Rating',
            value: `${currentRecord?.averageRating?.toFixed(1) ?? '0.0'} (${currentRecord?.totalReview ?? 0})`,
        },
        {
            icon: <Wallet className="size-3.5 text-muted-foreground" />,
            label: 'Wallet',
            value: `$${currentRecord?.wallet ?? 0}`,
        },
    ];

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="User Details"
            footer={null}
        >
            <div className="flex flex-col gap-4">
                {/* Profile Hero */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-4 ring-background shadow-md">
                            <img
                                src={
                                    currentRecord?.profileImage
                                        ? `${serverUrl}${currentRecord.profileImage}`
                                        : AllImages.profile
                                }
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span
                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-sm ${isBanned
                                ? 'bg-red-100 text-red-600'
                                : 'bg-emerald-100 text-emerald-600'
                                }`}
                        >
                            {isBanned ? 'Blocked' : 'Active'}
                        </span>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                            {currentRecord?.name || '—'}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground capitalize mt-0.5">
                            {currentRecord?.gender || ''} · Member since{' '}
                            {currentRecord?.createdAt
                                ? formatDate(currentRecord.createdAt)
                                : '—'}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {infoRows.map((row, i) => (
                        <div
                            key={i}
                            className="bg-muted/50 rounded-xl px-3 py-3 flex flex-col gap-1.5"
                        >
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {row.icon}
                                <span className="text-xs sm:text-sm font-medium">
                                    {row.label}
                                </span>
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-foreground truncate">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Warning Logs */}
                {warningLogs.length > 0 && (
                    <div className="rounded-xl border border-amber-200 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-3.5 text-white" />
                                <span className="text-xs sm:text-sm font-semibold text-white">
                                    Warning Logs
                                </span>
                            </div>
                            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {warningLogs.length}
                            </span>
                        </div>
                        <div className="divide-y divide-amber-100 bg-amber-50">
                            {warningLogs.map((log, i) => (
                                <div key={log._id} className="flex gap-3 px-4 py-3">
                                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold text-amber-800">
                                            Warning #{i + 1}
                                        </p>
                                        {log.reason && (
                                            <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                                                {log.reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500 shrink-0">
                                        <Clock className="size-3" />
                                        <span className="text-[10px] sm:text-[11px]">
                                            {formetDateAndTime(log.warnedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ban Reason */}
                {isBanned && currentRecord?.banReason && (
                    <div className="rounded-xl border border-red-200 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500">
                            <AlertTriangle className="size-3.5 text-white" />
                            <span className="text-xs sm:text-sm font-semibold text-white">Ban Reason</span>
                        </div>
                        <div className="bg-red-50 px-4 py-3 flex items-end justify-between gap-3">
                            <p className="text-xs sm:text-sm text-red-700 font-medium">
                                {currentRecord.banReason}
                            </p>
                            {currentRecord.bannedAt && (
                                <p className="text-[10px] sm:text-xs text-red-400 shrink-0">
                                    {formatDate(currentRecord.bannedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pb-1">
                    <button
                        onClick={() => currentRecord && onWarn(currentRecord)}
                        className="w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors cursor-pointer bg-[#FE9A00] text-background hover:bg-[#FE9A00]/90"
                    >
                        Send Warning
                    </button>
                    <button
                        onClick={() => currentRecord && onBan(currentRecord)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors cursor-pointer text-white ${isBanned
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        {isBanned ? 'Unban Passenger' : 'Ban Passenger'}
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
};

export default ViewPassengerModal;
