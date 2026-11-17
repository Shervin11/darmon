import toast from "react-hot-toast";
import { create } from "zustand";
import { api, apiError, clearSession, getToken, saveSession } from "@/lib/api";

// --- Interfaces ---

export interface Category {
  id: number;
  name?: string;
  image?: string;
  subcategories?: string[];
}

export interface Comment {
  id: number;
  userId?: number;
  user: {
    fullName: string;
    image: string;
  };
  rating: number;
  comment: string;
  date: string;
  edited?: boolean;
}

export interface WorkingSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Price {
  current: string;
  old: string;
  currency: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  role: string;
  specialty?: string;
  experience?: number;
  rating?: number;
  recommendation?: number;
  phone?: string;
  price?: Price;
  city?: string;
  clinic?: string;
  image?: string;
  bio?: string;
  workingSchedule?: WorkingSchedule[];
  slotMinutes?: number;
  timeOff?: TimeOff[];
  comments?: Comment[];
  diploma?: string;
  diplomaVerified?: boolean;
  clinicId?: number | null;
  clinicName?: string | null;
}

export interface TimeOff {
  from: string;
  to: string;
  reason?: string;
}

export interface User {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  city?: string;
  image?: string;
  specialty?: string;
  experience?: number;
  clinic?: string;
  bio?: string;
  price?: Price;
  workingSchedule?: WorkingSchedule[];
  slotMinutes?: number;
  timeOff?: TimeOff[];
  comments?: Comment[];
  diploma?: string;
  diplomaVerified?: boolean;
  telegramLinked?: boolean;
  clinicId?: number | null;
  clinicName?: string | null;
  lang?: string;
}

export interface FavoriteDoctor {
  doctorId: number | string;
  name: string;
  specialty?: string;
  photo?: string;
}

export interface WishlistData {
  favorites: FavoriteDoctor[];
}

export type AppointmentStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed" | "no_show";

export interface Appointment {
  id?: number;
  doctorId: number | string;
  clientId: number | string | null;
  doctorName?: string;
  clientName?: string;
  clientPhone?: string;
  specialty?: string;
  date: string;
  time: string;
  durationMinutes?: number;
  symptoms?: string;
  status: AppointmentStatus;
  rejectReason?: string;
  source?: "online" | "phone" | "walkin";
  price?: number;
  paid?: boolean;
}

type Result = { success: boolean };

export interface StoreState {
  category: Category[];
  doctor: Doctor[];
  doctorById: Partial<Doctor>;
  userById: Partial<User>;
  wishlist: WishlistData;
  isLoading: boolean;
  appointments: Appointment[];
  doctorAppointments: Appointment[];
  appointmentsLoading: boolean;
  subcategories: string[];

  registerUser: (newUser: {
    fullName: string;
    email?: string;
    phone?: string;
    password: string;
    consent: boolean;
    lang?: string;
  }) => Promise<{ success: boolean; role?: string }>;
  loginUser: (user: { login: string; password: string }) => Promise<{ success: boolean; role?: string }>;
  loginMe: () => Promise<User | null>;
  logout: () => void;
  getCategory: () => Promise<void>;
  getDoctor: () => Promise<void>;
  getDoctorById: (id: string | number) => Promise<void>;
  edit: (user: User) => Promise<Result>;
  uploadImage: (file: File) => Promise<string | null>;
  addComment: (doctorId: number, rating: number, comment: string) => Promise<Result>;
  updateComment: (doctorId: number, commentId: number, comment: string, rating: number) => Promise<Result>;
  deleteComment: (doctorId: number, commentId: number) => Promise<Result>;
  wishlistUser: () => Promise<void>;
  toggleWishlist: (doctorId: number | string) => Promise<void>;
  deleteWishlist: (doctorId: number | string) => Promise<void>;
  getAppointments: () => Promise<void>;
  getDoctorAppointments: (status?: string) => Promise<void>;
  createAppointment: (data: { doctorId: number; date: string; time: string; symptoms?: string }) => Promise<Result>;
  approveAppointment: (id: number) => Promise<Result>;
  rejectAppointment: (id: number, rejectReason: string) => Promise<Result>;
  /** Status change, reschedule ({date, time}) or payment mark ({paid}). */
  updateAppointment: (id: number, body: Partial<Appointment> & { reason?: string }, successMsg: string) => Promise<Result>;
  getSubcategories: () => Promise<void>;
  uploadDiploma: (file: File) => Promise<Result>;
}

const useStore = create<StoreState>((set, get) => {
  /** Reviews endpoints return the updated doctor (with recalculated rating). */
  const reviewRequest = async (request: Promise<{ data: Doctor }>, successMsg: string, errorMsg: string) => {
    try {
      const { data } = await request;
      set({ doctorById: data });
      toast.success(successMsg);
      return { success: true };
    } catch (error) {
      toast.error(apiError(error, errorMsg));
      return { success: false };
    }
  };

  const setAppointmentStatus = async (id: number, body: object, successMsg: string) => {
    try {
      await api.patch(`/appointments/${id}`, body);
      toast.success(successMsg);
      return { success: true };
    } catch (error) {
      toast.error(apiError(error, "Хатогӣ"));
      return { success: false };
    }
  };

  return {
    category: [],
    doctor: [],
    doctorById: {},
    userById: {},
    wishlist: { favorites: [] },
    isLoading: true,
    appointments: [],
    doctorAppointments: [],
    appointmentsLoading: false,
    subcategories: [],

    // ── Auth ──────────────────────────────────────────
    async registerUser(newUser) {
      try {
        const { data } = await api.post("/register", newUser);
        saveSession(data.token);
        set({ userById: data.user });
        toast.success("Хуш омадед!");
        return { success: true, role: data.user.role };
      } catch (error) {
        toast.error(apiError(error, "Хатогӣ ҳангоми бақайдгирӣ"));
        return { success: false };
      }
    },

    async loginUser(credentials) {
      try {
        const { data } = await api.post("/auth", credentials);
        saveSession(data.token);
        set({ userById: data.user });
        toast.success("Хуш омадед!");
        return { success: true, role: data.user.role };
      } catch {
        return { success: false };
      }
    },

    async loginMe() {
      if (!getToken()) return null;
      try {
        const { data } = await api.get("/auth_me");
        set({ userById: data });
        return data;
      } catch {
        return null;
      }
    },

    logout() {
      clearSession();
      set({ userById: {}, wishlist: { favorites: [] } });
    },

    // ── Categories & Doctors ──────────────────────────
    async getCategory() {
      try {
        const { data } = await api.get("/category");
        set({ category: data });
      } catch (error) {
        console.error(error);
      }
    },

    async getDoctor() {
      try {
        set({ isLoading: true });
        const { data } = await api.get("/users", { params: { role: "doctor" } });
        set({ doctor: data });
      } catch (error) {
        console.error(error);
      } finally {
        set({ isLoading: false });
      }
    },

    async getDoctorById(id) {
      try {
        const { data } = await api.get(`/users/${id}`);
        set({ doctorById: data });
      } catch (error) {
        console.error(error);
      }
    },

    async getSubcategories() {
      try {
        const { data } = await api.get<Category[]>("/category");
        set({ subcategories: [...new Set(data.flatMap((c) => c.subcategories || []))] });
      } catch (error) {
        console.error(error);
      }
    },

    // ── Profile ───────────────────────────────────────
    async edit(user) {
      try {
        const { data } = await api.patch(`/users/${user.id}`, user);
        set({ userById: data });
        toast.success("Маълумот бомуваффақият иваз шуд!");
        return { success: true };
      } catch (error) {
        toast.error(apiError(error, "Хатогӣ ҳангоми ивазкунӣ"));
        return { success: false };
      }
    },

    async uploadImage(file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/uploads", formData);
        // Store the relative path; the API turns it into a full URL in responses
        return data.path ?? data.url;
      } catch (error) {
        toast.error(apiError(error, "Хатогӣ ҳангоми боргузории акс"));
        return null;
      }
    },

    // The backend verifies the diploma with AI and only then marks it as verified
    async uploadDiploma(file) {
      const toastId = toast.loading("Диплом бо зеҳни сунъӣ тафтиш мешавад...");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/users/me/diploma", formData);
        set({ userById: data });
        toast.success("✅ Дипломи шумо бомуваффақият тасдиқ шуд!", { id: toastId });
        return { success: true };
      } catch (error) {
        toast.error(apiError(error, "Хатогӣ: Диплом тасдиқ нашуд."), { id: toastId });
        return { success: false };
      }
    },

    // ── Reviews ───────────────────────────────────────
    addComment: (doctorId, rating, comment) =>
      reviewRequest(api.post(`/doctors/${doctorId}/comments`, { rating, comment }), "Шарҳи шумо илова шуд!", "Хатогӣ ҳангоми иловаи шарҳ"),

    updateComment: (doctorId, commentId, comment, rating) =>
      reviewRequest(api.patch(`/doctors/${doctorId}/comments/${commentId}`, { rating, comment }), "Шарҳ иваз карда шуд!", "Хатогӣ ҳангоми ивази шарҳ"),

    deleteComment: (doctorId, commentId) =>
      reviewRequest(api.delete(`/doctors/${doctorId}/comments/${commentId}`), "Шарҳ нест карда шуд", "Хатогӣ ҳангоми нест кардан"),

    // ── Wishlist ──────────────────────────────────────
    async wishlistUser() {
      try {
        const { data } = await api.get("/wishlist");
        set({ wishlist: data });
      } catch (error) {
        console.error(error);
      }
    },

    async toggleWishlist(doctorId) {
      const isFavorite = get().wishlist.favorites.some((f) => f.doctorId == doctorId);
      try {
        const { data } = isFavorite ? await api.delete(`/wishlist/${doctorId}`) : await api.post("/wishlist", { doctorId });
        set({ wishlist: data });
        toast.success(isFavorite ? "Аз интихобшудаҳо гирифта шуд!" : "Ба интихобшудаҳо илова шуд!");
      } catch (error) {
        console.error(error);
      }
    },

    async deleteWishlist(doctorId) {
      try {
        const { data } = await api.delete(`/wishlist/${doctorId}`);
        set({ wishlist: data });
        toast.success("Аз интихобшудаҳо гирифта шуд!");
      } catch (error) {
        console.error(error);
      }
    },

    // ── Appointments ──────────────────────────────────
    async getAppointments() {
      try {
        set({ appointmentsLoading: true });
        const { data } = await api.get("/appointments");
        set({ appointments: data });
      } catch (error) {
        console.error(error);
      } finally {
        set({ appointmentsLoading: false });
      }
    },

    async getDoctorAppointments(status) {
      try {
        set({ appointmentsLoading: true });
        const { data } = await api.get("/appointments", { params: { status } });
        set({ doctorAppointments: data });
      } catch (error) {
        console.error(error);
      } finally {
        set({ appointmentsLoading: false });
      }
    },

    // Slot conflicts are checked by the backend (409)
    async createAppointment(appointment) {
      try {
        const { data } = await api.post("/appointments", appointment);
        set((state) => ({ appointments: [...state.appointments, data] }));
        toast.success("Дархости шумо бомуваффақият ирсол шуд!");
        return { success: true };
      } catch (error) {
        toast.error(apiError(error, "Хатогӣ ҳангоми ирсоли дархост"));
        return { success: false };
      }
    },

    // Approving also auto-rejects other pending requests that overlap it (backend)
    approveAppointment: (id) => setAppointmentStatus(id, { status: "approved" }, "Навбат тасдиқ шуд!"),

    rejectAppointment: (id, rejectReason) => setAppointmentStatus(id, { status: "rejected", rejectReason }, "Навбат рад шуд"),

    updateAppointment: (id, body, successMsg) => setAppointmentStatus(id, body, successMsg),
  };
});

export default useStore;
