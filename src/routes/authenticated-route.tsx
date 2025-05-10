import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { useStore } from "../hooks/use-store";

interface Props {
  children: React.ReactNode;
}

export const AuthenticatedRoute = observer(({ children }: Props) => {
  const { authStore: apiStore } = useStore();
  return apiStore.IsAuthenticated ? children : <Navigate to="/login" />;
});
