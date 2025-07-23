import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_BASE_URL;

const useStore = create((set) => ({
  category: [],
  doctor: [],
  doctorById: {},
  userById: {},
  wishlist: {},
  async registerUser(newUser) {
    try {
      let { data } = await axios.post(API + "/register", newUser);
      localStorage.setItem("accessToken", data.token);
      window.dispatchEvent(new Event("storage"));
      toast.success("Хуш омадед!");
    } catch (error) {
      console.error(error);
    }
  },
  async loginUser(user) {
    try {
      let { data } = await axios.post(API + "/auth", user);
      localStorage.setItem("accessToken", data.token);
      toast.success("Хуш омадед!");
      return { success: true, status: 200 };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        status: error?.response?.status || 500,
      };
    }
  },
  async wishlistUser(id) {
    try {
      let { data } = await axios.get(API + "/wishlist");
      const list = data.filter((e) => e.userId == id);
      set({ wishlist: list[0] });
    } catch (error) {
      console.error(error);
    }
  },
  async toggleWishlist(userId, doctor) {
    try {
      const { data: wishlists } = await axios.get(`${API}/wishlist`);
      const userList = wishlists.find((e) => e.userId == userId);

      const newDoctor = {
        doctorId: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        photo: doctor.image,
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

      const isInFavorites = userList.favorites.some(
        (fav) => fav.doctorId == newDoctor.doctorId
      );

      const updatedFavorites = isInFavorites
        ? userList.favorites.filter(
            (fav) => fav.doctorId != newDoctor.doctorId
          )
        : [...userList.favorites, newDoctor];

      await axios.patch(`${API}/wishlist/${userList.id}`, {
        favorites: updatedFavorites,
      });

      set((state) => ({
        wishlist: {
          ...state.wishlist,
          favorites: updatedFavorites,
        },
      }));

      toast.success(
        isInFavorites ? "Аз интихобшудаҳо гирифта шуд!" : "Ба интихобшудаҳо илова шуд!"
      );
    } catch (error) {
      console.error(error);
    }
  },
  async edit(user) {
    try {
      await axios.patch(API + "/users/" + user.id, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Шумо бомуваффакият иваз кардед!");
    } catch (error) {
      console.error(error);
    }
  },
  async loginMe() {
    try {
      let { data } = await axios.get(API + "/auth_me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      set({ userById: data });
    } catch (error) {
      console.error(error);
    }
  },
  async getCategory() {
    try {
      let { data } = await axios.get(API + "/category");
      set({ category: data });
    } catch (error) {
      console.error(error);
    }
  },
  async getDoctor() {
    try {
      let { data } = await axios.get(API + "/users");
      const filterData = data.filter((e) => e.role == "doctor");
      set({ doctor: filterData });
    } catch (error) {
      console.error(error);
    }
  },
  async getDoctorById(id) {
    try {
      let { data } = await axios.get(API + "/users/" + id);
      set({ doctorById: data });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useStore;
