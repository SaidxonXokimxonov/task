import { Route, Routes, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import Cars from "./pages/cars";
import Loads from "./pages/loads";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { useAppSelector } from "./store/hooks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/cars" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { token } = useAppSelector((state)=> state.auth)

  return (
    <SidebarProvider className="max-w-full">
      <div className="flex">
        {token && <AppSidebar />}

        <div
          className={
            token ? "w-screen md:w-[calc(100vw-230px)]" : "w-screen"
          }
        >
          <Routes>
            <Route
              path="/auth/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />

            <Route
              path="/cars"
              element={
                <ProtectedRoute>
                  <Cars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loads"
              element={
                <ProtectedRoute>
                  <Loads />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/cars" replace />
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />

            <Route
              path="*"
              element={
                token ? (
                  <Navigate to="/cars" replace />
                ) : (
                  <Navigate to="/auth/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
}
