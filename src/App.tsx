import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ForgetPassword from "./pages/auth/ForgetPassword";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import VerifyCode from "./pages/auth/VerifyCode";
import Home from "./pages/website/home/Home";
import { User } from "lucide-react";
import UserLayout from "./components/layout/UserLayout";

function App() {
  return (
    <BrowserRouter>
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
          {/* <Route index element={<Navigate to="/admin/dashboard" replace />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
