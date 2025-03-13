import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import { AuthProvider } from "./context/AuthProvider";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Roles from "./pages/admin/Roles/Roles";
import ForgetPassword from "./pages/auth/ForgetPassword";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import VerifyCode from "./pages/auth/VerifyCode";
import Home from "./pages/website/home/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <AuthProvider>
      <Routes>
          <Route path="/auth">
            <Route index element={<Navigate to="/auth/sign-in" replace />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="verify-code" element={<VerifyCode />} />
          </Route>

          {/*User Side */}
          <Route path="/" element={<UserLayout />}>
            <Route path="" element={<Home />} />
          </Route>

          {/* Admin Side */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="roles" element={<Roles />} />
          </Route>

          <Route path="*" element={<div>Page not found</div>} />
      </Routes>
        </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
