import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_BASE_URL;

export interface Appointment {
  id?: number;
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

: (newUser: User) => Promise<{ success: boolean; status?: number }>;
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

  (newUser) {
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

  () {
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

  (user: User) {
    try {
      const oldUser = get().userById;

      const dataToUpdate: any = { ...user };
      await axios.patch(API + "/users/" + user.id, dataToUpdate, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

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

      set({ userById: { ...oldUser, ...dataToUpdate } });

      toast.success("Маълумот бомуваффақият иваз шуд!");
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Хатогӣ ҳангоми ивазкунӣ");
      return { success: false };
    }
  },

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

  (doctorId, newComment, currentComments) {
    try {
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

  (id) {
    try {
      const { data } = await axios.get(`${API}/wishlist?userId=${id}`);
      set({ wishlist: data[0] || { favorites: [] } });
    } catch (error) {
      console.error(error);
    }
  },

  async toggleWishlist(userId, doctor) {
    try {
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

  (clientId) {
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
      
      
      const requestedHour = parseInt(time.split(':')[0]);
      
      const conflictingAppointments = data.filter((apt: Appointment) => {
        if (apt.date !== date) return false;
        
        if (!['approved', 'pending'].includes(apt.status)) return false;
        
        const aptHour = parseInt(apt.time.split(':')[0]);
        
        return aptHour === requestedHour;
      });
      
      return conflictingAppointments.length === 0;
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

      
      await axios.patch(`${API}/appointments/${id}`, { status: "approved" });

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

  () {
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
}));

export default useStore;