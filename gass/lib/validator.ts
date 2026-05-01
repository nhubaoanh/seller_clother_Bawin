/**
 * Validator tổng hợp - Tối ưu và ngắn gọn
 * Sử dụng: validateForm(data, rules) hoặc validateField(name, value, rules)
 */

// ==================== VALIDATORS ====================
export const v = {
  // Bắt buộc nhập
  required: (val: any, label = "Trường này") =>
    val === undefined || val === null || val === "" || (typeof val === "string" && !val.trim())
      ? `${label} không được để trống`
      : null,

  // Email
  email: (val: string, label = "Email") =>
    val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? `${label} không đúng định dạng` : null,

  // Số điện thoại VN
  phone: (val: string, label = "SĐT") =>
    val && !/^(0|\+84)[0-9]{9,10}$/.test(val.replace(/\s/g, ""))
      ? `${label} không đúng (VD: 0912345678)`
      : null,

  // Độ dài tối thiểu (ký tự)
  min: (val: string, n: number, label = "Trường này") =>
    val && val.length < n ? `${label} tối thiểu ${n} ký tự` : null,

  // Độ dài tối đa (ký tự)
  max: (val: string, n: number, label = "Trường này") =>
    val && val.length > n ? `${label} tối đa ${n} ký tự` : null,

  // Giá trị tối thiểu (số)
  minVal: (val: any, n: number, label = "Trường này") =>
    val !== "" && val !== null && Number(val) < n ? `${label} tối thiểu là ${n}` : null,

  // Giá trị tối đa (số)
  maxVal: (val: any, n: number, label = "Trường này") =>
    val !== "" && val !== null && Number(val) > n ? `${label} tối đa là ${n}` : null,

  // Phải là số
  number: (val: any, label = "Trường này") =>
    val !== "" && val !== null && val !== undefined && isNaN(Number(val))
      ? `${label} phải là số`
      : null,

  // Phải là số nguyên
  integer: (val: any, label = "Trường này") =>
    val !== "" && val !== null && !Number.isInteger(Number(val)) ? `${label} phải là số nguyên` : null,

  // Số dương > 0
  positive: (val: any, label = "Trường này") =>
    val !== "" && val !== null && Number(val) <= 0 ? `${label} phải > 0` : null,

  // Số không âm >= 0
  nonNegative: (val: any, label = "Trường này") =>
    val !== "" && val !== null && Number(val) < 0 ? `${label} không được âm` : null,

  // Khoảng giá trị số
  range: (val: any, min: number, max: number, label = "Trường này") => {
    const n = Number(val);
    return val !== "" && val !== null && (isNaN(n) || n < min || n > max)
      ? `${label} phải từ ${min} đến ${max}`
      : null;
  },

  // Ngày hợp lệ
  date: (val: string, label = "Ngày") =>
    val && isNaN(new Date(val).getTime()) ? `${label} không hợp lệ` : null,

  // Không được là ngày tương lai
  notFuture: (val: string, label = "Ngày") =>
    val && new Date(val) > new Date() ? `${label} không được là tương lai` : null,

  // Không được là ngày quá khứ
  notPast: (val: string, label = "Ngày") => {
    if (!val) return null;
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today ? `${label} không được là quá khứ` : null;
  },

  // Mật khẩu (6+ ký tự, có chữ thường + số)
  password: (val: string, label = "Mật khẩu") => {
    if (!val) return null;
    if (val.length < 6) return `${label} tối thiểu 6 ký tự`;
    if (!/[a-z]/.test(val)) return `${label} cần có chữ thường`;
    if (!/[0-9]/.test(val)) return `${label} cần có số`;
    return null;
  },

  // So khớp với field khác
  match: (val: string, compare: string, label = "Xác nhận") =>
    val && val !== compare ? `${label} không khớp` : null,

  // Tên đăng nhập (chữ, số, _)
  username: (val: string, label = "Tên đăng nhập") => {
    if (!val) return null;
    if (!/^[a-zA-Z0-9_]+$/.test(val)) return `${label} chỉ chứa chữ, số, _`;
    if (val.length < 3 || val.length > 30) return `${label} từ 3-30 ký tự`;
    return null;
  },

  // Giới tính (0, 1, 2 hoặc "Nam", "Nữ", "Khác")
  gender: (val: any, label = "Giới tính") => {
    if (val === undefined || val === null || val === "") return null;
    const valid = [0, 1, 2, "0", "1", "2", "Nam", "Nữ", "Khác", "nam", "nữ", "khác"];
    return !valid.includes(val) ? `${label} không hợp lệ` : null;
  },

  // URL hợp lệ
  url: (val: string, label = "URL") => {
    if (!val) return null;
    try {
      new URL(val);
      return null;
    } catch {
      return `${label} không hợp lệ`;
    }
  },

  // Regex tùy chỉnh
  pattern: (val: string, regex: RegExp, msg: string) =>
    val && !regex.test(val) ? msg : null,

  // Custom function
  custom: (val: any, fn: (v: any) => boolean, msg: string) =>
    !fn(val) ? msg : null,

  // ==================== NEW VALIDATORS ====================

  // Chỉ chữ cái (không số, không ký tự đặc biệt) - cho phép khoảng trắng và dấu tiếng Việt
  alpha: (val: string, label = "Trường này") => {
    if (!val) return null;
    // Cho phép chữ cái (có dấu tiếng Việt), khoảng trắng
    if (/\d/.test(val)) return `${label} không được chứa số`;
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~-]/.test(val)) return `${label} không được chứa ký tự đặc biệt`;
    return null;
  },

  // Chỉ chữ và số (alphanumeric)
  alphaNum: (val: string, label = "Trường này") => {
    if (!val) return null;
    if (/[^a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]/.test(val)) return `${label} chỉ được chứa chữ và số`;
    return null;
  },

  // Không chứa số
  noNumber: (val: string, label = "Trường này") => {
    if (!val) return null;
    return /\d/.test(val) ? `${label} không được chứa số` : null;
  },

  // Không chứa ký tự đặc biệt
  noSpecial: (val: string, label = "Trường này") => {
    if (!val) return null;
    return /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~-]/.test(val) ? `${label} không được chứa ký tự đặc biệt` : null;
  },

  // Không chỉ toàn khoảng trắng (đã có trong required nhưng tách riêng)
  notOnlySpaces: (val: string, label = "Trường này") => {
    if (!val) return null;
    return val.trim() === "" ? `${label} không được chỉ toàn khoảng trắng` : null;
  },

  // Họ tên hợp lệ (2-50 ký tự, không số, không ký tự đặc biệt)
  fullName: (val: string, label = "Họ tên") => {
    if (!val) return null;
    const trimmed = val.trim();
    if (trimmed.length < 2) return `${label} tối thiểu 2 ký tự`;
    if (trimmed.length > 50) return `${label} tối đa 50 ký tự`;
    if (/\d/.test(val)) return `${label} không được chứa số`;
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~-]/.test(val)) return `${label} không được chứa ký tự đặc biệt`;
    return null;
  },

  // Tuổi hợp lệ (0-150)
  age: (val: any, label = "Tuổi") => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    if (isNaN(n)) return `${label} phải là số`;
    if (!Number.isInteger(n)) return `${label} phải là số nguyên`;
    if (n < 0 || n > 150) return `${label} phải từ 0-150`;
    return null;
  },

  // Năm hợp lệ (1900 - năm hiện tại + 10)
  year: (val: any, label = "Năm") => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    const maxYear = new Date().getFullYear() + 10;
    if (isNaN(n)) return `${label} phải là số`;
    if (!Number.isInteger(n)) return `${label} phải là số nguyên`;
    if (n < 1900 || n > maxYear) return `${label} phải từ 1900-${maxYear}`;
    return null;
  },

  // Số CMND/CCCD (9 hoặc 12 số)
  idCard: (val: string, label = "CMND/CCCD") => {
    if (!val) return null;
    const cleaned = val.replace(/\s/g, "");
    if (!/^\d{9}$|^\d{12}$/.test(cleaned)) return `${label} phải có 9 hoặc 12 số`;
    return null;
  },
};

// ==================== TYPES ====================
export type Rule =
  | "required"
  | "email"
  | "phone"
  | "number"
  | "integer"
  | "positive"
  | "nonNegative"
  | "date"
  | "notFuture"
  | "notPast"
  | "password"
  | "username"
  | "gender"
  | "url"
  | "alpha"
  | "alphaNum"
  | "noNumber"
  | "noSpecial"
  | "notOnlySpaces"
  | "fullName"
  | "age"
  | "year"
  | "idCard"
  | { min: number }
  | { max: number }
  | { minVal: number }
  | { maxVal: number }
  | { range: [number, number] }
  | { match: string }
  | { pattern: RegExp; msg: string }
  | { custom: (val: any, data?: any) => boolean; msg: string };

export interface FieldConfig {
  label: string;
  rules: Rule[];
}

export type FormRules = Record<string, FieldConfig>;
export type FormErrors = Record<string, string | null>;

// ==================== VALIDATE FIELD ====================
export function validateField(
  name: string,
  value: any,
  rules: FormRules,
  formData?: Record<string, any>
): string | null {
  const config = rules[name];
  if (!config) return null;

  const { label, rules: fieldRules } = config;

  for (const rule of fieldRules) {
    let error: string | null = null;

    if (typeof rule === "string") {
      switch (rule) {
        case "required": error = v.required(value, label); break;
        case "email": error = v.email(value, label); break;
        case "phone": error = v.phone(value, label); break;
        case "number": error = v.number(value, label); break;
        case "integer": error = v.integer(value, label); break;
        case "positive": error = v.positive(value, label); break;
        case "nonNegative": error = v.nonNegative(value, label); break;
        case "date": error = v.date(value, label); break;
        case "notFuture": error = v.notFuture(value, label); break;
        case "notPast": error = v.notPast(value, label); break;
        case "password": error = v.password(value, label); break;
        case "username": error = v.username(value, label); break;
        case "gender": error = v.gender(value, label); break;
        case "url": error = v.url(value, label); break;
        case "alpha": error = v.alpha(value, label); break;
        case "alphaNum": error = v.alphaNum(value, label); break;
        case "noNumber": error = v.noNumber(value, label); break;
        case "noSpecial": error = v.noSpecial(value, label); break;
        case "notOnlySpaces": error = v.notOnlySpaces(value, label); break;
        case "fullName": error = v.fullName(value, label); break;
        case "age": error = v.age(value, label); break;
        case "year": error = v.year(value, label); break;
        case "idCard": error = v.idCard(value, label); break;
      }
    } else {
      if ("min" in rule) error = v.min(value, rule.min, label);
      else if ("max" in rule) error = v.max(value, rule.max, label);
      else if ("minVal" in rule) error = v.minVal(value, rule.minVal, label);
      else if ("maxVal" in rule) error = v.maxVal(value, rule.maxVal, label);
      else if ("range" in rule) error = v.range(value, rule.range[0], rule.range[1], label);
      else if ("match" in rule) error = v.match(value, formData?.[rule.match], label);
      else if ("pattern" in rule) error = v.pattern(value, rule.pattern, rule.msg);
      else if ("custom" in rule) error = v.custom(value, (val) => rule.custom(val, formData), rule.msg);
    }

    if (error) return error;
  }

  return null;
}

// ==================== VALIDATE FORM ====================
export function validateForm(
  data: Record<string, any>,
  rules: FormRules
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};
  let isValid = true;

  for (const name of Object.keys(rules)) {
    const error = validateField(name, data[name], rules, data);
    errors[name] = error;
    if (error) isValid = false;
  }

  return { isValid, errors };
}

// ==================== QUICK VALIDATORS ====================
export const validate = v;
