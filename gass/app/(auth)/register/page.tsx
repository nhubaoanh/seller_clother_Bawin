"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/service/useToas";
import { useFormValidation } from "@/lib/useFormValidation";
import { FormRules } from "@/lib/validator";
import { sighInService } from "@/service/user.service";
import { Loader2, ArrowLeft } from "lucide-react";

// ==================== CONFIG ====================

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFormData = {
  username: "",
  password: "",
  confirmPassword: "",
};

const registerRules: FormRules = {
  username: {
    label: "Identity",
    rules: ["required"],
  },
  password: {
    label: "Security Key",
    rules: ["required"],
  },
  confirmPassword: {
    label: "Confirm Key",
    rules: ["required"],
  },
};

// ==================== COMPONENT ====================

export default function RegisterPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useFormValidation<RegisterFormData>({
    initialValues,
    rules: registerRules,
  });

  const validateConfirmPassword = (): boolean => {
    if (form.values.password !== form.values.confirmPassword) {
      form.setError("confirmPassword", "Security keys do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const isValid = form.validateAll();
    const isPasswordMatch = validateConfirmPassword();

    if (!isValid || !isPasswordMatch) {
      showError("Please verify your registration data.");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        username: form.values.username,
        password: form.values.password,
      };

      const res = await sighInService(dataToSend);

      if (res.success) {
        showSuccess("Identity created. Proceed to authentication.");
        router.push("/login");
      } else {
        showError(res.message || "Registration sequence failed.");
      }
    } catch (err: any) {
      showError("System Error: Connection to Registry failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Editorial Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] text-[20vw] font-black text-gray-50 leading-none select-none -z-10 tracking-tighter uppercase italic">
        ENROLL
      </div>

      <div className="w-full max-w-lg space-y-12 relative z-10">
        {/* Navigation Back */}
        <Link href="/login" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Back to Authentication
        </Link>

        {/* Brand Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-black rounded-full mb-6">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol 0.2: Enrollment</span>
          </div>
          <h1 className="text-6xl font-black text-black tracking-tighter uppercase leading-tight italic">
            New <br /> <span className="not-italic text-gray-200">Identity</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
            Establish your credentials for the master registry
          </p>
        </div>

        {/* Register Form */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Master Username</label>
              <input
                type="text"
                placeholder="USER_NAME"
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("username") ? "ring-red-50 text-red-500" : "text-black"}`}
                {...form.getFieldProps("username")}
              />
              {form.hasError("username") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("username")}</p>}
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Security Key</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("password") ? "ring-red-50 text-red-500" : "text-black"}`}
                {...form.getFieldProps("password")}
              />
              {form.hasError("password") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("password")}</p>}
              <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest ml-4 italic">Complexity requirement: 8+ chars, upper, lower, numeric</p>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Confirm Security Key</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("confirmPassword") ? "ring-red-50 text-red-500" : "text-black"}`}
                {...form.getFieldProps("confirmPassword")}
              />
              {form.hasError("confirmPassword") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("confirmPassword")}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-black text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Establish Identity"}
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-12 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                By establishing an identity, you agree to the <br />
                Master Registry Protocols and Security Terms.
            </p>
        </div>
      </div>
    </div>
  );
}
