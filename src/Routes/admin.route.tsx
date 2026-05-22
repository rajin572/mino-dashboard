import CancelledRidesPage from "@/pages/CancelledRides";
import AllDriversPage from "@/pages/Drivers/AllDriversPage";
import DriversRequestPage from "@/pages/Drivers/DriversRequest";
import EarningPage from "@/pages/EarningPage";
import FareManagement from "@/pages/FareManagementPage";
import Overview from "@/pages/OverviewPage";
import PassengerPage from "@/pages/PassengerPage";
import ProfileSettingsPage from "@/pages/ProfileSettings";
import ReportsPage from "@/pages/Reports";
import RidesManagementPage from "@/pages/RidesManagement";
import UserFeedback from "@/pages/UserFeedback";
import PromoPage from "@/pages/PromoPage";
import {
  LayoutDashboard,
  Users,
  Car,
  Wallet,
  Route,
  Receipt,
  Flag,
  MessageCircle,
  Tag,
  Settings,
  // Users kept for Passengers
} from "lucide-react";

export const adminRoutes = [
  {
    title: "",
    items: [
      {
        title: "Overview",
        url: "overview",
        icon: LayoutDashboard,
        element: <Overview />, // JSX element for route
      },
      {
        title: "Passengers",
        url: "passengers",
        icon: Users,
        element: <PassengerPage />, // JSX element for route
      },
      {
        title: "Drivers",
        icon: Car,
        items: [
          {
            title: "All Drivers",
            url: "drivers/all-drivers",
            element: <AllDriversPage />,
          },
          {
            title: "Driver Request",
            url: "drivers/driver-request",
            element: <DriversRequestPage />,
          },
        ],
      },
      {
        title: "Earnings",
        url: "earnings",
        icon: Wallet,
        element: <EarningPage />, // JSX element for route
      },
      {
        title: "Rides Management",
        icon: Route,
        items: [
          {
            title: "All Rides",
            url: "rides-management",
            element: <RidesManagementPage />,
          },
          {
            title: "Cancelled Rides",
            url: "cancelled-rides",
            element: <CancelledRidesPage />,
          },
        ],
      },
      {
        title: "Fare Management",
        url: "fare-management",
        icon: Receipt,
        element: <FareManagement />,
      },
      {
        title: "Reports",
        url: "reports",
        icon: Flag,
        element: <ReportsPage />,
      },
      {
        title: "User Feedback",
        url: "user-feedback",
        icon: MessageCircle,
        element: <UserFeedback />,
      },
      {
        title: "Promo",
        url: "promo",
        icon: Tag,
        element: <PromoPage />,
      },
      {
        title: "Profile Settings",
        url: "profile-settings",
        icon: Settings,
        element: <ProfileSettingsPage />,
      },
    ],
  }
];
