import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_BASE_URL;

const useStore = create((set) => ({
  category: [],
  doctor: [],
  doctorById: {},
  userById: {},
  async registerUser(newUser) {
    try {
      let { data } = await axios.post(API + "/register", newUser);
      localStorage.setItem("accessToken", data.token);
      window.location.reload();
      await toast.success("Хуш омадед!");
    } catch (error) {
      console.error(error);
    }
  },
  async loginUser(user) {
    try {
      let { data } = await axios.post(API + "/auth", user);
      localStorage.setItem("accessToken", data.token);
      window.location.reload();
      await toast.success("Хуш омадед!");
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
