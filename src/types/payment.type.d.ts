interface IPaymentPassenger {
    id: string;
    name: string;
    phoneNumber: string;
    profileImage: string;
}

interface IPayment {
    id: string;
    rideId: string;
    passenger: IPaymentPassenger;
    driverId: string;
    totalFare: number;
    amount: number;
    tip: number;
    promo: string | null;
    promoDiscount: number;
    paymentMethod: string;
    paymentStatus: string;
    stripePaymentIntentId: string;
    transactionId: string;
    adminCommission: number;
    driverEarning: number;
    estimatedFare: number;
    paidAt: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
