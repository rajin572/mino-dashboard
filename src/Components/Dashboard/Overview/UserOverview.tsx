import { useState } from "react";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";
import Area_Chart from "@/Components/Charts/AreaChart";
import { useGetMonthlyUsersQuery } from "@/redux/features/overview/overviewApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const UserOverview = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: driverData } = useGetMonthlyUsersQuery({ role: "driver", year }, { refetchOnMountOrArgChange: true });
  const { data: passengerData } = useGetMonthlyUsersQuery({ role: "passenger", year }, { refetchOnMountOrArgChange: true });

  const chartData = MONTHS.map((month, i) => {
    const monthNum = i + 1;
    const drivers = driverData?.data?.months?.find((m) => m.month === monthNum)?.count ?? 0;
    const passengers = passengerData?.data?.months?.find((m) => m.month === monthNum)?.count ?? 0;
    return { month, drivers, passengers };
  });

  return (
    <div className="w-full lg:w-1/2 p-3 bg-[#FFFFFF] rounded-lg border border-[#E1E1E1]">
      <div className="flex justify-between text-base-color mt-4">
        <p className="text-2xl text-gradient-color lg:text-3xl font-bold mb-5">
          User Overview
        </p>
        <div>
          <YearOption currentYear={currentYear} setThisYear={setYear} />
        </div>
      </div>
      <div>
        <Area_Chart data={chartData} />
      </div>
    </div>
  );
};

export default UserOverview;
