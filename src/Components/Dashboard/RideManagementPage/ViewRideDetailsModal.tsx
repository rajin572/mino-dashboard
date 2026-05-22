import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import Tag from '@/Components/ui/CustomUi/ReuseTag';
import { getImageUrl } from '@/helpers/config/envConfig';
import { formatDate, formetDateAndTime } from '@/utils/dateFormet';
import {
    AlertCircle,
    BadgeDollarSign,
    Calendar,
    Car,
    Clock,
    CreditCard,
    Globe,
    Hash,
    MapPin,
    Navigation,
    Percent,
    Receipt,
    Route,
    Star,
    TrendingUp,
    User,
    Zap,
} from 'lucide-react';
import { AllImages } from '../../../../public/images/AllImages';

const statusTheme = (status: string): 'success' | 'error' | 'warning' | 'blue' | 'purple' | 'orange' => {
    switch (status) {
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        case 'ONGOING': return 'blue';
        case 'ACCEPTED': return 'purple';
        case 'REQUESTED': return 'warning';
        case 'ARRIVED_DROPOFF': return 'orange';
        case 'CONFIRM_DROPOFF': return 'orange';
        default: return 'orange';
    }
};

const InfoRow = ({ icon, label, value, valueClass = '' }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            {icon}
            <span className="text-xs sm:text-sm">{label}</span>
        </div>
        <span className={`text-xs sm:text-sm font-semibold text-foreground text-right ml-4 ${valueClass}`}>
            {value}
        </span>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-2 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
    </div>
);

const ViewRideDetailsModal = ({
    isOpen,
    handleCancle,
    currentRecord,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IRide | null;
}) => {
    const serverUrl = getImageUrl();
    const passenger = currentRecord?.passenger;
    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Ride Details"
            footer={null}
        >
            <div className="flex flex-col gap-5">

                {/* Passenger + Status */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <img
                        src={passenger?.profileImage ? `${serverUrl}${passenger.profileImage}` : AllImages.profile}
                        alt={passenger?.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                            {passenger?.name || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {currentRecord?.rideId || '—'}
                        </p>
                    </div>
                    {currentRecord?.status && (
                        <Tag theme={statusTheme(currentRecord.status)} className="shrink-0">
                            {currentRecord.status.charAt(0) + currentRecord.status.slice(1).toLowerCase()}
                        </Tag>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Route className="size-3.5" />
                            <span className="text-[10px] font-medium">Distance</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{currentRecord?.distanceKm ?? 0} km</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-3.5" />
                            <span className="text-[10px] font-medium">Duration</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{currentRecord?.durationMin ?? 0} min</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Car className="size-3.5" />
                            <span className="text-[10px] font-medium">Vehicle</span>
                        </div>
                        <p className="text-[11px] font-bold text-foreground leading-tight">
                            {currentRecord?.vehicleCategory?.replace(/_/g, ' ') ?? '—'}
                        </p>
                    </div>
                </div>

                {/* Route */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Route" />
                    <div className="px-4 py-4 flex flex-col">
                        {/* Pickup row */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center shrink-0">
                                <Navigation className="size-4 text-green-500 shrink-0" />
                                <div className="w-px flex-1 bg-border mt-2" />
                            </div>
                            <div className="pb-5 flex-1">
                                <p className="text-xs text-muted-foreground font-medium mb-0.5">Pickup</p>
                                <p className="text-sm font-semibold text-foreground">
                                    {currentRecord?.pickupLocation?.address || '—'}
                                </p>
                                {currentRecord?.pickupLocation?.location?.coordinates && (
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        {currentRecord.pickupLocation.location.coordinates[1]}, {currentRecord.pickupLocation.location.coordinates[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Dropoff row */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center shrink-0">
                                <MapPin className="size-4 text-red-500 shrink-0" />
                                {currentRecord?.actualDropoffLocation && (
                                    <div className="w-px flex-1 bg-border mt-2" />
                                )}
                            </div>
                            <div className={`flex-1 ${currentRecord?.actualDropoffLocation ? 'pb-5' : ''}`}>
                                <p className="text-xs text-muted-foreground font-medium mb-0.5">Dropoff</p>
                                <p className="text-sm font-semibold text-foreground">
                                    {currentRecord?.dropoffLocation?.address || '—'}
                                </p>
                                {currentRecord?.dropoffLocation?.location?.coordinates && (
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        {currentRecord.dropoffLocation.location.coordinates[1]}, {currentRecord.dropoffLocation.location.coordinates[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Actual Dropoff row (conditional) */}
                        {currentRecord?.actualDropoffLocation && (
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center shrink-0">
                                    <MapPin className="size-4 text-orange-500 shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Actual Dropoff</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {currentRecord.actualDropoffLocation.address}
                                    </p>
                                    {currentRecord.actualDropoffLocation.location?.coordinates && (
                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                            {currentRecord.actualDropoffLocation.location.coordinates[1]}, {currentRecord.actualDropoffLocation.location.coordinates[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Ride Info */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Ride Info" />
                    <div className="px-4">
                        <InfoRow icon={<Zap className="size-3.5" />} label="Service Type" value={currentRecord?.serviceType ?? '—'} />
                        <InfoRow icon={<Navigation className="size-3.5" />} label="Pickup Type" value={currentRecord?.pickupType ?? '—'} />
                        <InfoRow icon={<Globe className="size-3.5" />} label="Country" value={currentRecord?.country ?? '—'} />
                        <InfoRow
                            icon={<Clock className="size-3.5" />}
                            label="Driver Accepted At"
                            value={currentRecord?.driverAcceptedAt ? formetDateAndTime(currentRecord.driverAcceptedAt) : '—'}
                        />
                        {currentRecord?.scheduledAt && (
                            <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Scheduled At"
                                value={formetDateAndTime(currentRecord.scheduledAt)}
                            />
                        )}
                        <InfoRow
                            icon={<Clock className="size-3.5" />}
                            label="Created At"
                            value={currentRecord?.createdAt ? formetDateAndTime(currentRecord.createdAt) : '—'}
                        />
                    </div>
                </div>

                {/* Fare Breakdown */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Fare Breakdown" />
                    <div className="px-4">
                        <InfoRow icon={<Receipt className="size-3.5" />} label="Estimated Fare" value={`$${currentRecord?.estimatedFare ?? 0}`} />
                        <InfoRow icon={<BadgeDollarSign className="size-3.5" />} label="Total Fare" value={`$${currentRecord?.totalFare ?? 0}`} valueClass="text-green-600" />
                        <InfoRow icon={<TrendingUp className="size-3.5" />} label="Tip" value={`$${currentRecord?.tip ?? 0}`} />
                        <InfoRow icon={<Percent className="size-3.5" />} label="Promo Discount" value={`$${currentRecord?.promoDiscount ?? 0}`} valueClass={(currentRecord?.promoDiscount ?? 0) > 0 ? 'text-emerald-600' : ''} />
                    </div>
                </div>

                {/* Earnings Split */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-blue-500">
                            <User className="size-3.5" />
                            <span className="text-xs font-medium">Admin Commission</span>
                        </div>
                        <p className="text-lg font-bold text-blue-700">${currentRecord?.adminCommission ?? 0}</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-violet-500">
                            <BadgeDollarSign className="size-3.5" />
                            <span className="text-xs font-medium">Driver Earning</span>
                        </div>
                        <p className="text-lg font-bold text-violet-700">${currentRecord?.driverEarning ?? 0}</p>
                    </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Payment" />
                    <div className="px-4">
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Method"
                            value={currentRecord?.paymentMethod
                                ? currentRecord.paymentMethod.charAt(0) + currentRecord.paymentMethod.slice(1).toLowerCase()
                                : '—'}
                        />
                        <InfoRow
                            icon={<Hash className="size-3.5" />}
                            label="Status"
                            value={currentRecord?.paymentStatus
                                ? <Tag theme={currentRecord.paymentStatus === 'PAID' ? 'success' : currentRecord.paymentStatus === 'PENDING' ? 'warning' : 'error'}>
                                    {currentRecord.paymentStatus.charAt(0) + currentRecord.paymentStatus.slice(1).toLowerCase()}
                                </Tag>
                                : '—'}
                        />
                    </div>
                </div>

                {/* Cancellations */}
                {(currentRecord?.cancellations?.length ?? 0) > 0 && (
                    <div className="rounded-xl border border-red-200 overflow-hidden">
                        <div className="px-4 py-2 bg-red-500 border-b border-red-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-3.5 text-white" />
                                <p className="text-xs font-semibold text-white uppercase tracking-wide">Cancellations</p>
                            </div>
                            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {currentRecord?.cancellations.length}
                            </span>
                        </div>
                        <div className="px-4 py-3 bg-red-50 flex flex-col gap-2">
                            {(currentRecord?.cancellations as { reason?: string; cancelledAt?: string; cancelledBy?: string }[]).map((c, i) => (
                                <div key={i} className="text-xs text-red-700">
                                    <p className="font-semibold">{c.reason || 'No reason provided'}</p>
                                    {c.cancelledAt && <p className="text-red-400 mt-0.5">{formetDateAndTime(c.cancelledAt)}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Passenger Review */}
                {currentRecord?.passengerReview && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Passenger Review" />
                        <div className="px-4 py-3 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`size-4 ${i < (currentRecord.passengerReview?.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="text-sm font-semibold ml-1">{currentRecord.passengerReview.rating}/5</span>
                            </div>
                            {currentRecord.passengerReview.comment && (
                                <p className="text-xs sm:text-sm text-muted-foreground">{currentRecord.passengerReview.comment}</p>
                            )}
                            <p className="text-[10px] text-muted-foreground">{formatDate(currentRecord.passengerReview.givenAt)}</p>
                        </div>
                    </div>
                )}

                {/* Driver Review */}
                {currentRecord?.driverReview && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Driver Review" />
                        <div className="px-4 py-3 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`size-4 ${i < (currentRecord.driverReview?.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="text-sm font-semibold ml-1">{currentRecord.driverReview.rating}/5</span>
                            </div>
                            {currentRecord.driverReview.comment && (
                                <p className="text-xs sm:text-sm text-muted-foreground">{currentRecord.driverReview.comment}</p>
                            )}
                            <p className="text-[10px] text-muted-foreground">{formatDate(currentRecord.driverReview.givenAt)}</p>
                        </div>
                    </div>
                )}

                {/* Status History */}
                {(currentRecord?.statusHistory?.length ?? 0) > 0 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Status History" />
                        <div className="px-4 py-3 flex flex-col gap-2">
                            {currentRecord?.statusHistory.map((h, i) => (
                                <div key={h._id} className="flex items-center gap-3">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                                        {i < (currentRecord.statusHistory.length - 1) && <div className="w-px h-4 bg-border" />}
                                    </div>
                                    <div className="flex items-center justify-between flex-1 pb-1">
                                        <Tag theme={statusTheme(h.status)}>
                                            {h.status.charAt(0) + h.status.slice(1).toLowerCase().replace(/_/g, ' ')}
                                        </Tag>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                            {formetDateAndTime(h.changedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </ReusableModal>
    );
};

export default ViewRideDetailsModal;
