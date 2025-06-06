import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import NoHouseHoldDashboard from "./no-house-hold-dashboard";
import HouseHoldCardListDashboard from "./household-card-list-dashboard";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/user";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

const DashboardComponent = observer(() => {
  const { authStore } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [showNoHousehold, setShowNoHousehold] = useState(false);
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await authStore.gerUserProfile();
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setUser(data);
    },
  });

  useEffect(() => {
    if (user?.households.length == 0) {
      setShowNoHousehold(true);
    } else {
      setShowNoHousehold(false);
    }
  }, [user]);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Loader />
      </div>
    );

  return user?.households.length == 0 || showNoHousehold ? (
    <NoHouseHoldDashboard />
  ) : (
    <HouseHoldCardListDashboard />
  );
});

export default DashboardComponent;
