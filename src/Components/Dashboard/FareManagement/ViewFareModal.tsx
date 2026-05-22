import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";

interface ViewFareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fare: IFare | null;
}

const vehicleRow = (label: string, v: IFareVehicle) => (
  <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4 space-y-2">
    <h4 className="font-semibold text-base">{label}</h4>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div><span className="text-muted-foreground">Rate/km:</span> ${v.ratePerKm}</div>
      <div><span className="text-muted-foreground">Booking Fee:</span> ${v.bookingFee}</div>
      <div><span className="text-muted-foreground">Base Fare:</span> ${v.baseFee}</div>
      <div><span className="text-muted-foreground">Min Fare:</span> ${v.minimumFare}</div>
    </div>
  </div>
);

const ViewFareModal = ({ isOpen, onClose, fare }: ViewFareModalProps) => {
  if (!fare) return null;

  return (
    <ReusableModal
      open={isOpen}
      onOpenChange={onClose}
      title={`Pricing for ${fare.country}`}
      maxWidth="sm:max-w-[600px]"
      footer={null}
    >
      <div className="space-y-3">
        {vehicleRow("Mino Go", fare.minoGo)}
        {vehicleRow("Mino XL", fare.minoXL)}
        {vehicleRow("Mino Moto", fare.minoMoto)}

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-base">Waiting Charge</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Enabled:</span>{" "}
              {fare.waitingCharge.enabled ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Grace Period:</span>{" "}
              {fare.waitingCharge.gracePeriod} min
            </div>
            <div>
              <span className="text-muted-foreground">Rate:</span> ${fare.waitingCharge.rate}/min
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-base">Surcharge</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Enabled:</span>{" "}
              {fare.surcharge.enabled ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Value:</span> {fare.surcharge.value}%
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4 text-sm">
          <span className="text-muted-foreground font-semibold">Platform Commission: </span>
          {fare.platformCommissionPercentage}%
        </div>
      </div>
    </ReusableModal>
  );
};

export default ViewFareModal;
