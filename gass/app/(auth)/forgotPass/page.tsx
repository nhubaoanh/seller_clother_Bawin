"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/service/useToas";
import { useFormValidation } from "@/lib/useFormValidation";
import { FormRules } from "@/lib/validator";
import { resetPasswordUser } from "@/service/user.service";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

// ==================== CONFIG ====================

interface ForgotFormData {
  username: string;
}

const initialValues: ForgotFormData = {
  username: "",
};

const forgotRules: FormRules = {
  username: {
    label: "Identity",
    rules: ["required"],
  },
};

// ==================== COMPONENT ====================

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useFormValidation<ForgotFormData>({
    initialValues,
    rules: forgotRules,
  });

  const handleSubmit = async () => {
    if (!form.validateAll()) {
      showError("Please enter your master identity.");
      return;
    }

    setLoading(true);
    try {
      // Mapping to the expected structure if needed, or passing as partial IUser
      const response = await resetPasswordUser({ email: form.values.username } as any);
      
      if (response.success) {
        showSuccess("Recovery sequence initiated. Check your inbox.");
        setSent(true);
      } else {
        showError(response.message || "Identity not found in Registry.");
      }
    } catch (error: any) {
      showError("System Error: Connection to Recovery Server failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      {/* Editorial Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] text-[20vw] font-black text-gray-50 leading-none select-none -z-10 tracking-tighter uppercase italic">
        RECOVERY
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol 0.3: Recovery</span>
          </div>
          <h1 className="text-6xl font-black text-black tracking-tighter uppercase leading-tight italic">
            Access <br /> <span className="not-italic text-gray-200">Restoration</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
            Request a secure key reset for your identity
          </p>
        </div>

        {/* Status Message */}
        {sent && (
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-[11px] font-black uppercase tracking-widest text-black leading-loose">
                    ✅ Recovery link dispatched to your registered communication channel. Please verify within 24 hours.
                </p>
            </div>
        )}

        {/* Recovery Form */}
        <div className="space-y-8">
          {!sent && (
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Registered Username / Email</label>
              <div className="relative">
                <input
                    type="text"
                    placeholder="IDENTITY@JMFASHION.COM"
                    className={`w-full px-8 py-5 bg-gray-50 border-none rounded-[2rem] outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest transition-all ${form.hasError("username") ? "ring-red-50 text-red-500" : "text-black"}`}
                    {...form.getFieldProps("username")}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200">
                    <Mail size={18} />
                </div>
              </div>
              {form.hasError("username") && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-4">{form.getError("username")}</p>}
            </div>
          )}

          <button
            onClick={sent ? () => router.push("/login") : handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-black text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : sent ? (
                "Return to Login"
            ) : (
                "Request Recovery Link"
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-12 text-center">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                Protected by Editorial Encryption Protocol. <br />
                Recovery attempts are logged for security.
            </p>
        </div>
      </div>
    </div>
  );
}
