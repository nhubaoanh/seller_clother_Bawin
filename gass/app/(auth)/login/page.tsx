"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import storage from "@/utils/storage";
import { useToast } from "@/service/useToas";
import { useFormValidation } from "@/lib/useFormValidation";
import { FormRules } from "@/lib/validator";
import { loginService } from "@/service/user.service";
import { Loader2 } from "lucide-react";

// ==================== CONFIG ====================

interface LoginFormData {
  username: string;
  password: string;
}

const initialValues: LoginFormData = {
  username: "",
  password: "",
};

const loginRules: FormRules = {
  username: {
    label: "Identity",
    rules: ["required"],
  },
  password: {
    label: "Security Key",
    rules: ["required"],
  },
};

// ==================== COMPONENT ====================

export default function LoginPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<LoginFormData>({
    initialValues,
    rules: loginRules,
  });

  const handleSubmit = async () => {
    if (!form.validateAll()) {
      showError("Please verify your access credentials.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginService(form.values);
      
      // The API returns { success: true, data: { token, user_id, role_code, ... }, ... }
      if (response?.success && response?.data) {
        const result = response.data;
        const token = result.token || response.token; // Fallback if token is at root

        // Strict Role-based Access Control (Admin only: role_id/role_code/role === 1)
        const userRole = Number(result.role_id || result.role_code || result.role);
        
        if (userRole !== 1) {
          showError("Access Denied: Administrative Clearance Required.");
          setLoading(false);
          return;
        }

        if (!token) {
          showError("Authentication Error: Security Token not found.");
          setLoading(false);
          return;
        }

        storage.setToken(token);
        storage.setUser({
          user_id: result.user_id,
          username: result.username,
          online_flag: result.online_flag,
          full_name: result.full_name,
          email: result.email,
          phone: result.phone,
          address: result.address,
          birthday: result.birthday,
          gender: result.gender,
          img_ure: result.img_ure,
          role_id: userRole,
          role_code: result.role_code?.toString() || userRole.toString(),
          role_name: result.role_name,
          permission_code: result.permission_code,
          permission_name: result.permission_name,
        });

        showSuccess("Authentication successful. Entering Registry.");
        router.push("/dashboard");
      } else {
        showError(response?.message || "Invalid Identity Credentials.");
      }
    } catch (err: any) {
      showError("System Error: Connection to Authentication Server failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Editorial Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] text-[20vw] font-black text-gray-50 leading-none select-none -z-10 tracking-tighter uppercase">
        FASHION
      </div>
      <div className="absolute bottom-[-5%] left-[-2%] text-[20vw] font-black text-gray-50 leading-none select-none -z-10 tracking-tighter uppercase">
        REGISTRY
      </div>

      <div className="w-full max-w-lg space-y-12">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-black rounded-full mb-6">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Auth Protocol 0.1</span>
          </div>
          <h1 className="text-7xl font-black text-black tracking-tighter uppercase leading-tight italic">
            SELLER <br /> <span className="not-italic text-gray-200 text-6xl">System</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
            Identity Verification Required for Master Control
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Master Identity (Username)</label>
              <input
                type="text"
                placeholder="ADMIN_USER"
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("username") ? "ring-red-50 text-red-500" : "text-black"}`}
                {...form.getFieldProps("username")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {form.hasError("username") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("username")}</p>}
            </div>

            <div className="group space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Security Key</label>
                <Link href="/forgotPass" className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-black transition-colors">Recover Access?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("password") ? "ring-red-50 text-red-500" : "text-black"}`}
                {...form.getFieldProps("password")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {form.hasError("password") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("password")}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-black text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Initiate Connection"}
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-12 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                Protected by Editorial Encryption Protocol. <br />
                Unauthorized access is recorded.
            </p>
        </div>
      </div>
    </div>
  );
}
