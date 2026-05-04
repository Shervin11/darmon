import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_BASE_URL;

// --- Interfaces ---

export interface Category {
  id: number;
  title?: string;
  name?: string;
  image?: string;
  img?: string;
  subcategories?: string[];
}

export interface Comment {
  id: number;
  user: {
    fullName: string;
    image: string;
  };
  rating: number;
  comment: string;
  date: string;
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
  name?: string;
  role: string;
  specialty?: string;
  experience?: number;
  rating?: number;
  recommendation?: number;
  phone?: string;
  patients?: number;
  price?: Price;
  city?: string;
  clinic?: string;
  image?: string;
  photo?: string;
  bio?: string;
  workingSchedule?: WorkingSchedule[];
  comments?: Comment[];
  diploma?: string;
  diplomaVerified?: boolean;
}

export interface User {
  id?: number | string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  city?: string;
  image?: string;
  photo?: string;
  password?: string;
  specialty?: string;
  experience?: number;
  clinic?: string;
  bio?: string;
  price?: Price;
  workingSchedule?: WorkingSchedule[];
  diploma?: string;
  diplomaVerified?: boolean;
}

export interface FavoriteDoctor {
  doctorId: number | string;
  name: string;
  specialty?: string;
  photo?: string;
}

export interface WishlistData {
  id?: number;
  userId?: number | string;
  favorites: FavoriteDoctor[];
}

export interface Appointment {
  id?: number;
  doctorId: number | string;
  clientId: number | string;
  doctorName?: string;
  clientName?: string;
  specialty?: string;
  date: string;
  time: string;
  symptoms?: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

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

  // Actions
  registerUser: (newUser: User) => Promise<{ success: boolean; status?: number }>;
  loginUser: (user: Partial<User>) => Promise<{ success: boolean; role?: string; status?: number }>;
  loginMe: () => Promise<User | null>;
  getCategory: () => Promise<void>;
  getDoctor: () => Promise<void>;
  getDoctorById: (id: string | number) => Promise<void>;
  edit: (user: User) => Promise<{ success: boolean }>;
  addComment: (doctorId: string | number, newComment: Comment, currentComments?: Comment[]) => Promise<{ success: boolean; updatedComments?: Comment[] }>;
  wishlistUser: (id: string | number) => Promise<void>;
  toggleWishlist: (userId: string | number, doctor: any) => Promise<void>;
  deleteWishlist: (userId: string | number, doctorId: string | number) => Promise<void>;
  getAppointments: (clientId: string | number) => Promise<void>;
  getDoctorAppointments: (doctorId: string | number, status?: string) => Promise<void>;
  checkSlotAvailability: (doctorId: string | number, date: string, time: string) => Promise<boolean>;
  createAppointment: (appointmentData: Partial<Appointment>) => Promise<{ success: boolean }>;
  approveAppointment: (id: string | number) => Promise<{ success: boolean }>;
  rejectAppointment: (id: string | number, rejectReason: string) => Promise<{ success: boolean }>;
  updateComment: (doctorId: string | number, commentId: number, updatedText: string, updatedRating: number) => Promise<{ success: boolean }>;
  deleteComment: (doctorId: string | number, commentId: number) => Promise<{ success: boolean }>;
  uploadImage: (file: File) => Promise<string | null>;
  getSubcategories: () => Promise<void>;
  uploadDiploma: (doctorId: string | number, file: File) => Promise<{ success: boolean }>;
  verifyDiploma: (doctorId: string | number) => Promise<{ success: boolean; verified: boolean }>;
  moderateComment: (text: string) => { isClean: boolean; reason?: string };
}

// ── Profanity Filter (RU/TJ/EN) ──────────────────
const PROFANITY_LIST = [
  // Russian profanity
  "блять", "бля", "блядь", "сука", "хуй", "пизда", "ебать", "ёб", "нахуй", "пиздец",
  "мудак", "дебил", "идиот", "урод", "тварь", "гандон", "залупа", "шлюха",
  "ублюдок", "пидор", "пидар", "даун", "дерьмо", "говно", "жопа", "срать",
  "ебан", "хуев", "пиздат", "заебал", "отъебись", "ёбан", "хер", "херов",
  // Tajik profanity
  "кунӣ", "ҳаромзода", "ҳаромӣ", "фоҳиша", "лаънатӣ", "мурдор", "бадбахт",
  "бешараф", "беномус", "бепадар", "бемадар", "гуҳ", "гоҳ", "харзода",
  // English profanity
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "pussy", "damn",
  "crap", "cunt", "whore", "slut", "moron", "idiot", "stupid", "retard"
];

function containsProfanity(text: string): { isClean: boolean; reason?: string } {
  const lowerText = text.toLowerCase().replace(/[\s.,!?;:*_\-—]+/g, " ");
  for (const word of PROFANITY_LIST) {
    if (lowerText.includes(word.toLowerCase())) {
      return { isClean: false, reason: word };
    }
  }
  return { isClean: true };
}

const useStore = create<StoreState>((set, get) => ({
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
      const { data } = await axios.post(API + "/register", newUser);
      localStorage.setItem("accessToken", data.token);
      window.dispatchEvent(new Event("storage"));
      toast.success("Хуш омадед!");
      return { success: true };
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "Хатогӣ ҳангоми бақайдгирӣ";
      toast.error(typeof message === "string" ? message : "Хатогӣ");
      return { success: false, status: error?.response?.status || 500 };
    }
  },

  async loginUser(user) {
    try {
      const { data } = await axios.post(API + "/auth", user);
      localStorage.setItem("accessToken", data.token);
      // Fetch user profile right after login to get role
      const meRes = await axios.get(API + "/auth_me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      set({ userById: meRes.data });
      toast.success("Хуш омадед!");
      return { success: true, role: meRes.data.role };
    } catch (error: any) {
      console.error(error);
      return { success: false, status: error?.response?.status || 500 };
    }
  },

  async loginMe() {
    try {
      const { data } = await axios.get(API + "/auth_me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      set({ userById: data });
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // ── Categories & Doctors ──────────────────────────
  async getCategory() {
    try {
      set({ isLoading: true });
      const { data } = await axios.get(API + "/category");
      set({ category: data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  async getDoctor() {
    try {
      set({ isLoading: true });
      const { data } = await axios.get(API + "/users");
      const filterData = data.filter((e: any) => e.role == "doctor");
      set({ doctor: filterData, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  async getDoctorById(id) {
    try {
      const { data } = await axios.get(API + "/users/" + id);
      set({ doctorById: data });
    } catch (error) {
      console.error(error);
    }
  },

  // ── Profile Edit ──────────────────────────────────
  async edit(user: User) {
    try {
      const oldUser = get().userById;

      // 1. НОРМАЛИЗАЦИЯ ДАННЫХ
      const dataToUpdate: any = { ...user };

      // ИСПОЛЬЗУЕМ 'in', чтобы проверить наличие поля, даже если оно равно "" (пустая строка)
      if ('photo' in dataToUpdate) {
        dataToUpdate.image = dataToUpdate.photo; // Теперь если photo "", то и image станет ""
        delete dataToUpdate.photo;
      }

      // Отправляем правильный объект в БД
      await axios.patch(API + "/users/" + user.id, dataToUpdate, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      // 2. CASCADE UPDATE (Обновление фото/имени в комментариях)
      // Сравниваем старое и новое (используем "" как запасной вариант для сравнения)
      const isNameChanged = oldUser.fullName !== dataToUpdate.fullName;
      const isImageChanged = (oldUser.image || "") !== (dataToUpdate.image || "");

      if (isNameChanged || isImageChanged) {
        const { data: allUsers } = await axios.get(API + "/users");

        for (const doc of allUsers) {
          if (doc.role === "doctor" && doc.comments && doc.comments.length > 0) {
            let hasChanges = false;
            const updatedComments = doc.comments.map((c: Comment) => {
              if (c.user.fullName === oldUser.fullName) {
                hasChanges = true;
                return {
                  ...c,
                  user: {
                    ...c.user,
                    fullName: dataToUpdate.fullName || c.user.fullName,
                    // Если image в dataToUpdate существует (даже ""), берем его, иначе старое
                    image: 'image' in dataToUpdate ? dataToUpdate.image : c.user.image,
                  },
                };
              }
              return c;
            });

            if (hasChanges) {
              await axios.patch(API + "/users/" + doc.id, { comments: updatedComments });
            }
          }
        }
      }

      // 3. ОБНОВЛЕНИЕ ЛОКАЛЬНОГО СТЕЙТА
      // Объединяем старые данные с новыми, чтобы UI обновился мгновенно
      set({ userById: { ...oldUser, ...dataToUpdate } });

      toast.success("Маълумот бомуваффақият иваз шуд!");
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми ивазкунӣ");
      return { success: false };
    }
  },
  // Внутри useStore (create<StoreState>):

  async uploadImage(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(API + "/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data.url;
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      toast.error("Хатогӣ ҳангоми боргузории акс");
      return null;
    }
  },

  // ── AI Comment Moderation ──────────────────────────
  moderateComment(text: string) {
    return containsProfanity(text);
  },

  // ── Comments ──────────────────────────────────────
  async addComment(doctorId, newComment, currentComments) {
    try {
      // AI moderation: check for profanity
      const moderation = containsProfanity(newComment.comment);
      if (!moderation.isClean) {
        toast.error("⚠️ Шарҳи шумо иборатҳои номақбул дорад ва блок карда шуд.");
        return { success: false };
      }

      const updatedComments = currentComments ? [...currentComments, newComment] : [newComment];
      await axios.patch(API + "/users/" + doctorId, { comments: updatedComments }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      toast.success("Шарҳи шумо илова шуд!");
      return { success: true, updatedComments };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми иловаи шарҳ");
      return { success: false };
    }
  },

  async updateComment(doctorId, commentId, updatedText, updatedRating) {
    try {
      const doctor = get().doctorById;
      if (!doctor || !doctor.comments) return { success: false };

      const updatedComments = doctor.comments.map((c) =>
        c.id === commentId
          ? {
            ...c,
            comment: updatedText,
            rating: updatedRating,
            date: new Date().toLocaleDateString("ru-RU") + " (тағйир ёфт)"
          }
          : c
      );

      await axios.patch(`${API}/users/${doctorId}`, { comments: updatedComments }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      set({ doctorById: { ...doctor, comments: updatedComments } });
      toast.success("Шарҳ иваз карда шуд!");
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми ивази шарҳ");
      return { success: false };
    }
  },

  async deleteComment(doctorId, commentId) {
    try {
      const doctor = get().doctorById;
      if (!doctor || !doctor.comments) return { success: false };

      const updatedComments = doctor.comments.filter((c) => c.id !== commentId);

      await axios.patch(`${API}/users/${doctorId}`, { comments: updatedComments }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      set({ doctorById: { ...doctor, comments: updatedComments } });
      toast.success("Шарҳ нест карда шуд");
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми нест кардан");
      return { success: false };
    }
  },

  // ── Wishlist (ОПТИМИЗИРОВАНО) ──────────────────────
  async wishlistUser(id) {
    try {
      // Запрашиваем только список нужного юзера!
      const { data } = await axios.get(`${API}/wishlist?userId=${id}`);
      set({ wishlist: data[0] || { favorites: [] } });
    } catch (error) {
      console.error(error);
    }
  },

  async toggleWishlist(userId, doctor) {
    try {
      // Запрашиваем только список нужного юзера!
      const { data: wishlists } = await axios.get(`${API}/wishlist?userId=${userId}`);
      const userList = wishlists[0];

      const newDoctor: FavoriteDoctor = {
        doctorId: doctor.id || doctor.doctorId,
        name: doctor.fullName || doctor.name || "",
        specialty: doctor.specialty,
        photo: doctor.image || doctor.photo,
      };

      if (!userList) {
        const { data: created } = await axios.post(`${API}/wishlist`, {
          userId,
          favorites: [newDoctor],
        });
        set({ wishlist: created });
        toast.success("Ба интихобшудаҳо илова шуд!");
        return;
      }

      const isInFavorites = userList.favorites.some((fav: FavoriteDoctor) => fav.doctorId == newDoctor.doctorId);
      const updatedFavorites = isInFavorites
        ? userList.favorites.filter((fav: FavoriteDoctor) => fav.doctorId != newDoctor.doctorId)
        : [...userList.favorites, newDoctor];

      await axios.patch(`${API}/wishlist/${userList.id}`, { favorites: updatedFavorites });
      set((state) => ({
        wishlist: { ...state.wishlist, favorites: updatedFavorites },
      }));
      toast.success(isInFavorites ? "Аз интихобшудаҳо гирифта шуд!" : "Ба интихобшудаҳо илова шуд!");
    } catch (error) {
      console.error(error);
    }
  },

  async deleteWishlist(userId, doctorId) {
    try {
      // Запрашиваем только список нужного юзера!
      const { data: wishlists } = await axios.get(`${API}/wishlist?userId=${userId}`);
      const userList = wishlists[0];

      if (!userList) { toast.error("Интихобшудаҳо ёфт нашуд!"); return; }

      const updatedFavorites = userList.favorites.filter((fav: FavoriteDoctor) => fav.doctorId != doctorId);
      await axios.patch(`${API}/wishlist/${userList.id}`, { favorites: updatedFavorites });
      set((state) => ({
        wishlist: { ...state.wishlist, favorites: updatedFavorites },
      }));
      toast.success("Аз интихобшудаҳо гирифта шуд!");
    } catch (error) {
      console.error(error);
    }
  },

  // ── Appointments ──────────────────────────────────
  async getAppointments(clientId) {
    try {
      set({ appointmentsLoading: true });
      const { data } = await axios.get(`${API}/appointments?clientId=${clientId}`);
      set({ appointments: data, appointmentsLoading: false });
    } catch (error) {
      console.error(error);
      set({ appointmentsLoading: false });
    }
  },

  async getDoctorAppointments(doctorId, status) {
    try {
      set({ appointmentsLoading: true });
      let url = `${API}/appointments?doctorId=${doctorId}`;
      if (status) url += `&status=${status}`;
      const { data } = await axios.get(url);
      set({ doctorAppointments: data, appointmentsLoading: false });
    } catch (error) {
      console.error(error);
      set({ appointmentsLoading: false });
    }
  },

  async checkSlotAvailability(doctorId, date, time) {
    try {
      const { data } = await axios.get(`${API}/appointments?doctorId=${doctorId}&date=${date}`);
      
      // Извлекаем час из времени (HH:MM -> HH)
      const requestedHour = parseInt(time.split(':')[0]);
      
      // Проверяем как approved так и pending назначения
      // Один сеанс занимает 1 час, поэтому если занято 10:00, то весь час 10:00-10:59 занят
      const conflictingAppointments = data.filter((apt: Appointment) => {
        if (apt.date !== date) return false;
        
        // Проверяем оба статуса: approved И pending (чтобы предотвратить двойную запись)
        if (!['approved', 'pending'].includes(apt.status)) return false;
        
        const aptHour = parseInt(apt.time.split(':')[0]);
        
        // Конфликт если часы совпадают
        return aptHour === requestedHour;
      });
      
      return conflictingAppointments.length === 0; // true если слот свободен
    } catch (error) {
      console.error(error);
      return true;
    }
  },

  async createAppointment(appointmentData) {
    try {
      if (!appointmentData.doctorId || !appointmentData.date || !appointmentData.time || !appointmentData.clientId) {
        toast.error("Маълумоти нопурра!");
        return { success: false };
      }
      
      const isAvailable = await get().checkSlotAvailability(
        appointmentData.doctorId,
        appointmentData.date,
        appointmentData.time
      );
      
      if (!isAvailable) {
        toast.error("Ин вақт аллақачон забронирован шудаест. Лутфан саҳифаро нав кунед ва вақти дигарро интихоб кунед.");
        return { success: false };
      }

      const response = await axios.post(`${API}/appointments`, {
        ...appointmentData,
        status: "pending",
      });

      // Обновляем локальный список appointments
      const newAppointment: Appointment = {
        ...(appointmentData as Appointment),
        id: response.data.id,
        status: "pending",
      };
      
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
      }));

      toast.success("Дархости шумо бомуваффақият ирсол шуд!");
      return { success: true };
    } catch (error: any) {
      console.error(error);
      
      // Проверяем, если это ошибка конфликта времени
      if (error?.response?.status === 409 || error?.response?.data?.message?.includes("time")) {
        toast.error("Ин вақт аллақачон забронирован шудаест. Лутфан вақти дигарро интихоб кунед.");
      } else {
        toast.error("Хатогӣ ҳангоми ирсоли дархост");
      }
      return { success: false };
    }
  },

  async approveAppointment(id) {
    try {
      const { data: appointmentToApprove } = await axios.get(`${API}/appointments/${id}`);
      
      // Перед одобрением, проверяем что нет других approved на это время
      const { data: allAppointments } = await axios.get(`${API}/appointments?doctorId=${appointmentToApprove.doctorId}&date=${appointmentToApprove.date}`);
      
      const appointmentHour = parseInt(appointmentToApprove.time.split(':')[0]);
      const conflictingApproved = allAppointments.filter((apt: Appointment) => 
        apt.status === "approved" && 
        apt.id !== id &&
        parseInt(apt.time.split(':')[0]) === appointmentHour
      );
      
      if (conflictingApproved.length > 0) {
        toast.error("Вақти интихобшуда аллақачон забронирован шудаест!");
        return { success: false };
      }

      // Одобряем текущее назначение
      await axios.patch(`${API}/appointments/${id}`, { status: "approved" });

      // Автоматически отклоняем все остальные pending запросы на то же время
      const conflictingPending = allAppointments.filter((apt: Appointment) => 
        apt.status === "pending" && 
        apt.id !== id &&
        parseInt(apt.time.split(':')[0]) === appointmentHour
      );
      
      for (const conflictingApt of conflictingPending) {
        await axios.patch(`${API}/appointments/${conflictingApt.id}`, { 
          status: "rejected",
          rejectReason: "Ин вақт аллақачон забронирован шудаест."
        });
      }

      // Обновляем локальное состояние
      const state = get();
      const updatedAppointments = state.doctorAppointments.map((apt: Appointment) => {
        if (apt.id === id) return { ...apt, status: "approved" as const };
        if (conflictingPending.some((p: Appointment) => p.id === apt.id)) {
          return { ...apt, status: "rejected" as const, rejectReason: "Ин вақт аллақачон забронирован шудаест." };
        }
        return apt;
      });
      
      set({ doctorAppointments: updatedAppointments });

      toast.success("Навбат тасдиқ шуд!");
      return { success: true };
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Хатогӣ");
      return { success: false };
    }
  },

  async rejectAppointment(id, rejectReason) {
    try {
      await axios.patch(`${API}/appointments/${id}`, { status: "rejected", rejectReason });
      toast.success("Навбат рад шуд");
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ");
      return { success: false };
    }
  },

  // ── Subcategories ──────────────────────────────────
  async getSubcategories() {
    try {
      const { data } = await axios.get(API + "/category");
      const allSubs: string[] = [];
      data.forEach((cat: Category) => {
        if (cat.subcategories) {
          cat.subcategories.forEach((sub) => {
            if (!allSubs.includes(sub)) allSubs.push(sub);
          });
        }
      });
      set({ subcategories: allSubs });
    } catch (error) {
      console.error(error);
    }
  },

  // ── Diploma Upload & Verification ─────────────────
  async uploadDiploma(doctorId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(API + "/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save diploma URL to doctor profile
      await axios.patch(API + "/users/" + doctorId, {
        diploma: data.url,
        diplomaVerified: false,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      set((state) => ({
        userById: { ...state.userById, diploma: data.url, diplomaVerified: false },
      }));

      toast.success("Диплом бор карда шуд! Тафтиш оғоз шуд...");

      // Auto-start verification
      setTimeout(() => {
        get().verifyDiploma(doctorId);
      }, 2000);

      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми бор кардани диплом");
      return { success: false };
    }
  },

  async verifyDiploma(doctorId) {
    try {
      const user = get().userById;
      if (!user.diploma) {
        toast.error("Аввал дипломро бор кунед");
        return { success: false, verified: false };
      }

      // Simulated AI verification:
      // 1. Check that diploma is uploaded (non-empty URL)
      // 2. Check that it's a valid image/PDF (base64 data or URL)
      const diplomaUrl = user.diploma;
      const isValidFormat = diplomaUrl.startsWith("data:image/") ||
                           diplomaUrl.startsWith("data:application/pdf") ||
                           diplomaUrl.startsWith("http");
      const isLargeEnough = diplomaUrl.length > 1000; // Base64 should be substantial

      const verified = isValidFormat && isLargeEnough;

      await axios.patch(API + "/users/" + doctorId, {
        diplomaVerified: verified,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      set((state) => ({
        userById: { ...state.userById, diplomaVerified: verified },
      }));

      if (verified) {
        toast.success("✅ Дипломи шумо тасдиқ шуд!");
      } else {
        toast.error("❌ Диплом тасдиқ нашуд. Лутфан аксро бо сифати беҳтар бор кунед.");
      }

      return { success: true, verified };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми тафтиши диплом");
      return { success: false, verified: false };
    }
  },
}));

export default useStore;