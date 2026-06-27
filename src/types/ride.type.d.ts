interface IRidePassenger {
    id: string;
    name: string;
    profileImage: string;
}

interface IRideDriver {
    id: string;
}

interface IRideLocation {
    location: {
        type: string;
        coordinates: [number, number];
    };
    address: string;
}

interface IRideStatusHistory {
    id: string;
    status: string;
    changedAt: string;
}

interface IRideReview {
    rating: number;
    comment: string;
    givenAt: string;
}

interface IRide {
    id: string;
    rideId: string;
    country: string;
    passenger: IRidePassenger;
    driver: IRideDriver;
    serviceType: string;
    vehicleCategory: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupLocation: IRideLocation;
    dropoffLocation: IRideLocation;
    actualDropoffLocation: IRideLocation | null;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    distanceKm: number;
    durationMin: number;
    estimatedFare: number;
    totalFare: number;
    driverEarning: number;
    adminCommission: number;
    promoDiscount: number;
    tip: number;
    pickupType: string;
    scheduledAt: string | null;
    parcelDetails: unknown | null;
    driverAcceptedAt: string | null;
    statusHistory: IRideStatusHistory[];
    isDeleted: boolean;
    cancellations: unknown[];
    createdAt: string;
    updatedAt: string;
    isDriverReviewed: boolean;
    isPassengerReviewed: boolean;
    passengerReview: IRideReview | null;
    driverReview: IRideReview | null;
}
