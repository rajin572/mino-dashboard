import { useState } from "react";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import { getImageUrl } from "@/helpers/config/envConfig";
import { formatDate, formetDateAndTime } from "@/utils/dateFormet";
import { AllImages } from "../../../../public/images/AllImages";
import ImagePreviewer from "@/Components/ui/CustomUi/ImagePreviewer";
import {
    AlertTriangle,
    Ban,
    Calendar,
    Car,
    CheckCircle2,
    FileText,
    Globe,
    Hash,
    Mail,
    Phone,
    Receipt,
    Route,
    Shield,
    ShieldCheck,
    Star,
    User,
    Wallet,
    XCircle,
    Wifi,
    AlertOctagon,
} from "lucide-react";
import {
    useBanUserMutation,
    useUnbanUserMutation,
    useWarnUserMutation,
} from "@/redux/features/user/userApi";
import {
    useApproveDriverMutation,
    useRejectDriverMutation,
} from "@/redux/features/driver/driverApi";
import { toast } from "sonner";

const calcAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-2 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
        </p>
    </div>
);

const InfoRow = ({
    icon,
    label,
    value,
    valueClass = "",
}: {
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
        <span
            className={`text-xs sm:text-sm font-semibold text-foreground text-right ml-4 ${valueClass}`}
        >
            {value ?? "—"}
        </span>
    </div>
);

const DocImage = ({ src, alt, serverUrl }: { src?: string; alt: string; serverUrl: string }) => (
    <div className="w-full h-44 bg-muted/30 rounded-xl overflow-hidden border border-border">
        {src ? (
            <ImagePreviewer src={`${serverUrl}${src}`} alt={alt} />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileText className="size-6" />
                <span className="text-xs">{alt}</span>
            </div>
        )}
    </div>
);

type ConfirmAction = "ban" | "unban" | "warn" | "approve" | "reject" | null;

const ViewDriverDetailsPage = ({
    isOpen,
    handleCancle,
    currentRecord,
    approvalModal = false,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IDriver | null;
    approvalModal?: boolean;
}) => {
    const serverUrl = getImageUrl();
    const profile = currentRecord?.driverProfile;
    const isBanned = currentRecord?.status === "banned";
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

    const [banUser, { isLoading: banning }] = useBanUserMutation();
    const [unbanUser, { isLoading: unbanning }] = useUnbanUserMutation();
    const [warnUser, { isLoading: warning }] = useWarnUserMutation();
    const [approveDriver, { isLoading: approving }] = useApproveDriverMutation();
    const [rejectDriver, { isLoading: rejecting }] = useRejectDriverMutation();

    const isActionLoading =
        banning || unbanning || warning || approving || rejecting;

    const handleConfirm = async (_: IDriver, reason?: string) => {
        if (!currentRecord) return;
        try {
            if (confirmAction === "ban") {
                await banUser({
                    userId: currentRecord.id,
                    reason: reason || "Banned by admin",
                }).unwrap();
                toast.success("Driver banned successfully");
            } else if (confirmAction === "unban") {
                await unbanUser({ userId: currentRecord.id }).unwrap();
                toast.success("Driver unbanned successfully");
            } else if (confirmAction === "warn") {
                await warnUser({
                    userId: currentRecord.id,
                    reason: reason || "",
                }).unwrap();
                toast.success("Warning sent successfully");
            } else if (confirmAction === "approve") {
                await approveDriver({ driverId: currentRecord.id }).unwrap();
                toast.success("Driver approved successfully");
            } else if (confirmAction === "reject") {
                await rejectDriver({
                    userId: currentRecord.id,
                    reason: reason || "",
                }).unwrap();
                toast.success("Driver rejected");
            }
            setConfirmAction(null);
            handleCancle();
        } catch {
            toast.error("Action failed. Please try again.");
        }
    };

    const confirmConfig: Record<
        Exclude<ConfirmAction, null>,
        {
            title: string;
            description: string;
            confirmText: string;
            variant: "danger" | "warning" | "success" | "info";
            iconPreset:
            | "delete"
            | "block"
            | "unblock"
            | "decline"
            | "accept"
            | "approve"
            | "cancel";
            withReason: boolean;
            reasonLabel: string;
        }
    > = {
        warn: {
            title: "Send Warning",
            description: `Send a warning to ${currentRecord?.name ?? "this driver"}. Please provide a reason for the warning.`,
            confirmText: "Send Warning",
            variant: "warning" as const,
            iconPreset: "cancel" as const,
            withReason: true,
            reasonLabel: "Warning Reason",
        },
        ban: {
            title: "Ban Driver",
            description: `Are you sure you want to ban ${currentRecord?.name ?? "this driver"}? They will lose access to the platform.`,
            confirmText: "Ban Driver",
            variant: "danger" as const,
            iconPreset: "block" as const,
            withReason: true,
            reasonLabel: "Ban Reason",
        },
        unban: {
            title: "Unban Driver",
            description: `Are you sure you want to unban ${currentRecord?.name ?? "this driver"}? They will regain access to the platform.`,
            confirmText: "Unban Driver",
            variant: "success" as const,
            iconPreset: "unblock" as const,
            withReason: false,
            reasonLabel: "",
        },
        approve: {
            title: "Approve Driver",
            description: `Are you sure you want to approve ${currentRecord?.name ?? "this driver"}? They will be able to start accepting rides.`,
            confirmText: "Approve",
            variant: "success" as const,
            iconPreset: "approve" as const,
            withReason: false,
            reasonLabel: "",
        },
        reject: {
            title: "Reject Driver",
            description: `Are you sure you want to reject ${currentRecord?.name ?? "this driver"}? Please provide a reason.`,
            confirmText: "Reject",
            variant: "danger" as const,
            iconPreset: "decline" as const,
            withReason: true,
            reasonLabel: "Rejection Reason",
        },
    };

    const activeConfig = confirmAction ? confirmConfig[confirmAction] : null;

    return (
        <>
            <ReusableModal
                maxWidth="sm:max-w-2xl"
                open={isOpen}
                onOpenChange={handleCancle}
                title="Driver Details"
                footer={null}
            >
                <div className="flex flex-col gap-5">
                    {/* Header — Profile */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <img
                            src={
                                currentRecord?.profileImage
                                    ? `${serverUrl}${currentRecord.profileImage}`
                                    : AllImages.profile
                            }
                            alt={currentRecord?.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground text-base sm:text-lg truncate">
                                {currentRecord?.name || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {currentRecord?.email || "—"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {currentRecord?.adminVerified === "verified" && (
                                    <Tag
                                        theme={
                                            currentRecord?.status === "active"
                                                ? "success"
                                                : currentRecord?.status === "banned"
                                                    ? "error"
                                                    : "warning"
                                        }
                                        className="capitalize"
                                    >
                                        {currentRecord?.status || "inactive"}
                                    </Tag>
                                )}
                                <Tag
                                    theme={
                                        currentRecord?.adminVerified === "verified"
                                            ? "success"
                                            : currentRecord?.adminVerified === "rejected"
                                                ? "error"
                                                : "warning"
                                    }
                                    className="capitalize"
                                >
                                    {currentRecord?.adminVerified || "pending"}
                                </Tag>
                                {profile?.isOnline !== undefined && (
                                    <Tag theme={profile.isOnline ? "success" : "warning"}>
                                        {profile.isOnline ? "Online" : "Offline"}
                                    </Tag>
                                )}
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                            <ReuseRating
                                value={currentRecord?.averageRating ?? 0}
                                size={16}
                                showValue
                            />
                            <span className="text-sm text-muted-foreground capitalize">
                                {currentRecord?.driverType || "—"}
                            </span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Route className="size-3.5" />
                                <span className="text-[10px] font-medium">Total Trips</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {profile?.totalTrips ?? 0}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Receipt className="size-3.5" />
                                <span className="text-[10px] font-medium">Earnings</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                ${profile?.totalEarnings ?? 0}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Wallet className="size-3.5" />
                                <span className="text-[10px] font-medium">Wallet</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                ${profile?.walletBalance ?? currentRecord?.wallet ?? 0}
                            </p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Personal Information" />
                        <div className="px-4">
                            <InfoRow
                                icon={<Mail className="size-3.5" />}
                                label="Email"
                                value={currentRecord?.email}
                            />
                            <InfoRow
                                icon={<Phone className="size-3.5" />}
                                label="Phone"
                                value={
                                    currentRecord
                                        ? `${currentRecord.countryCode} ${currentRecord.phoneNumber}`
                                        : "—"
                                }
                            />
                            <InfoRow
                                icon={<Globe className="size-3.5" />}
                                label="Country"
                                value={
                                    <span className="capitalize">
                                        {currentRecord?.country?.toLowerCase() || "—"}
                                    </span>
                                }
                            />
                            <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Age"
                                value={
                                    currentRecord?.dateOfBirth
                                        ? `${calcAge(currentRecord.dateOfBirth)} yrs`
                                        : "—"
                                }
                            />
                            <InfoRow
                                icon={<User className="size-3.5" />}
                                label="Gender"
                                value={
                                    <span className="capitalize">
                                        {currentRecord?.gender || "—"}
                                    </span>
                                }
                            />
                            <InfoRow
                                icon={<Star className="size-3.5" />}
                                label="Rating"
                                value={`${currentRecord?.averageRating?.toFixed(1) ?? "0.0"} (${currentRecord?.totalReview ?? 0} reviews)`}
                            />
                            <InfoRow
                                icon={<Hash className="size-3.5" />}
                                label="SSN (Social Security Number)"
                                value={
                                    <span className="font-mono">
                                        {profile?.socialSecurityNumber || "—"}
                                    </span>
                                }
                            />
                            <InfoRow
                                icon={<Hash className="size-3.5" />}
                                label="Warnings"
                                value={`${currentRecord?.warnings?.count ?? 0}`}
                                valueClass={
                                    (currentRecord?.warnings?.count ?? 0) > 0
                                        ? "text-amber-600"
                                        : ""
                                }
                            />
                            {!approvalModal &&
                                <InfoRow
                                    icon={<Wifi className="size-3.5" />}
                                    label="On Ride"
                                    value={
                                        <Tag theme={profile?.isOnRide ? "blue" : "warning"}>
                                            {profile?.isOnRide ? "Yes" : "No"}
                                        </Tag>
                                    }
                                />}
                            {/* <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Home Address"
                                value={
                                    <div className="text-right">
                                        <p>{currentRecord?.homeAddress?.address || profile?.address || "—"}</p>
                                        {currentRecord?.homeAddress?.location?.coordinates && (
                                            <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                                {currentRecord.homeAddress.location.coordinates[1]}, {currentRecord.homeAddress.location.coordinates[0]}
                                            </p>
                                        )}
                                    </div>
                                }
                            /> */}
                            <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Joined"
                                value={
                                    currentRecord?.createdAt
                                        ? formatDate(currentRecord.createdAt)
                                        : "—"
                                }
                            />
                        </div>
                    </div>

                    {/* Driver License */}
                    {profile && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="Driver License" />
                            <div className="px-4">
                                <InfoRow
                                    icon={<Shield className="size-3.5" />}
                                    label="License Number"
                                    value={
                                        <span className="font-mono">
                                            {profile.licenseNumber || "—"}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    icon={<Calendar className="size-3.5" />}
                                    label="License Expiry"
                                    value={
                                        profile.licenseExpiryDate
                                            ? formatDate(profile.licenseExpiryDate)
                                            : "—"
                                    }
                                />
                            </div>
                            <div className="px-4 pb-4 pt-2">
                                <p className="text-sm font-semibold text-foreground mb-2">
                                    License Image
                                </p>
                                <DocImage
                                    src={profile.licenseImage}
                                    alt="Driver License"
                                    serverUrl={serverUrl}
                                />
                            </div>
                        </div>
                    )}

                    {/* Vehicle Information */}
                    {profile && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="Vehicle Information" />
                            <div className="px-4">
                                <InfoRow
                                    icon={<Car className="size-3.5" />}
                                    label="Brand"
                                    value={profile.vehicleBrand}
                                />
                                <InfoRow
                                    icon={<Car className="size-3.5" />}
                                    label="Model"
                                    value={profile.vehicleModel}
                                />
                                <InfoRow
                                    icon={<Car className="size-3.5" />}
                                    label="Color"
                                    value={profile.vehicleColor}
                                />
                                <InfoRow
                                    icon={<Car className="size-3.5" />}
                                    label="Type"
                                    value={profile.vehicleType?.replace(/_/g, " ")}
                                />
                                <InfoRow
                                    icon={<Car className="size-3.5" />}
                                    label="Driver Type"
                                    value={
                                        <span className="capitalize">
                                            {profile.driverType || "—"}
                                        </span>
                                    }
                                />
                            </div>
                            {(profile.vehicleImages?.length ?? 0) > 0 && (
                                <div className="px-4 pb-4 pt-2">
                                    <p className="text-sm font-semibold text-foreground mb-2">
                                        Vehicle Photos
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {profile.vehicleImages.map((img, i) => (
                                            <DocImage
                                                key={i}
                                                src={img}
                                                alt={`Vehicle ${i + 1}`}
                                                serverUrl={serverUrl}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents */}
                    {profile &&
                        (profile.registrationImage ||
                            profile.roadworthinessCertificate) && (
                            <div className="rounded-xl border border-border overflow-hidden">
                                <SectionHeader title="Documents" />
                                <div className="px-4 pb-4 pt-3 flex flex-col gap-4">
                                    {profile.registrationImage && (
                                        <div>
                                            <p className="text-sm font-semibold text-foreground mb-2">
                                                Vehicle Registration
                                            </p>
                                            <DocImage
                                                src={profile.registrationImage}
                                                alt="Vehicle Registration"
                                                serverUrl={serverUrl}
                                            />
                                        </div>
                                    )}
                                    {profile.roadworthinessCertificate && (
                                        <div>
                                            <p className="text-sm font-semibold text-foreground mb-2">
                                                Roadworthiness Certificate
                                            </p>
                                            <DocImage
                                                src={profile.roadworthinessCertificate}
                                                alt="Roadworthiness Certificate"
                                                serverUrl={serverUrl}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Warning Logs */}
                    {(currentRecord?.warnings?.logs?.length ?? 0) > 0 && (
                        <div className="rounded-xl border border-amber-200 overflow-hidden">
                            <div className="px-4 py-2 bg-amber-500 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="size-3.5 text-white" />
                                    <p className="text-xs font-semibold text-white uppercase tracking-wide">
                                        Warning Logs
                                    </p>
                                </div>
                                <span className="bg-white text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {currentRecord?.warnings?.count}
                                </span>
                            </div>
                            <div className="px-4 py-3 bg-amber-50 flex flex-col gap-3">
                                {currentRecord?.warnings?.logs.map((log) => (
                                    <div key={log.id} className="flex flex-col gap-0.5 text-xs">
                                        <p className="font-semibold text-amber-800">
                                            {log.reason || "No reason provided"}
                                        </p>
                                        <p className="text-amber-500">
                                            {log.warnedAt ? formetDateAndTime(log.warnedAt) : "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ban Reason */}
                    {!approvalModal && isBanned && currentRecord?.banReason && (
                        <div className="rounded-xl border border-red-200 overflow-hidden">
                            <div className="px-4 py-2 bg-red-500">
                                <div className="flex items-center gap-2">
                                    <Ban className="size-3.5 text-white" />
                                    <p className="text-xs font-semibold text-white uppercase tracking-wide">
                                        Ban Reason
                                    </p>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-red-50">
                                <p className="text-sm text-red-700 font-medium">
                                    {currentRecord.banReason}
                                </p>
                                {currentRecord.bannedAt && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {formetDateAndTime(currentRecord.bannedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason (for request modal) */}
                    {approvalModal && profile?.rejectionReason && (
                        <div className="rounded-xl border border-red-200 overflow-hidden">
                            <div className="px-4 py-2 bg-red-500">
                                <div className="flex items-center gap-2">
                                    <XCircle className="size-3.5 text-white" />
                                    <p className="text-xs font-semibold text-white uppercase tracking-wide">
                                        Rejection Reason
                                    </p>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-red-50">
                                <p className="text-sm text-red-700 font-medium">
                                    {profile.rejectionReason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {!approvalModal ? (
                        <div className="flex flex-col gap-2 pt-1">
                            <button
                                onClick={() => setConfirmAction("warn")}
                                disabled={isActionLoading}
                                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 bg-[#FE9A00] hover:bg-[#FE9A00]/90 text-white"
                            >
                                <AlertOctagon className="size-4" />
                                Send Warning
                            </button>
                            <button
                                onClick={() => setConfirmAction(isBanned ? "unban" : "ban")}
                                disabled={isActionLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${isBanned
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}
                            >
                                {isBanned ? (
                                    <ShieldCheck className="size-4" />
                                ) : (
                                    <Ban className="size-4" />
                                )}
                                {isBanned ? "Unban Driver" : "Ban Driver"}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <button
                                onClick={() => setConfirmAction("reject")}
                                disabled={isActionLoading}
                                className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <XCircle className="size-4" />
                                Reject
                            </button>
                            <button
                                onClick={() => setConfirmAction("approve")}
                                disabled={isActionLoading}
                                className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="size-4" />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </ReusableModal>

            {/* Confirm Modal */}
            {activeConfig && confirmAction && (
                <ConfirmModal<IDriver>
                    open={!!confirmAction}
                    onCancel={() => setConfirmAction(null)}
                    currentRecord={currentRecord}
                    onConfirm={handleConfirm}
                    title={activeConfig.title}
                    description={activeConfig.description}
                    confirmText={activeConfig.confirmText}
                    variant={activeConfig.variant}
                    iconPreset={activeConfig.iconPreset}
                    withReason={activeConfig.withReason}
                    reasonLabel={activeConfig.reasonLabel}
                    reasonRequired={activeConfig.withReason}
                    loading={isActionLoading}
                />
            )}
        </>
    );
};

export default ViewDriverDetailsPage;
