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
    let { data } = await axios.post(API + "/register", newUser);
    toast.success("Хуш омадед!");
    localStorage.setItem("accessToken", data.token);
  },
  async loginUser(user) {
    let { data } = await axios.post(API + "/auth", user);
    toast.success("Хуш омадед!");
    localStorage.setItem("accessToken", data.token);
  },
  async loginMe() {
    let { data } = await axios.get(API + "/auth_me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    set({ userById: data });
  },
  async getCategory() {
    let { data } = await axios.get(API + "/category");
    set({ category: data });
  },
  async getDoctor() {
    let { data } = await axios.get(API + "/users");
    const filterData = data.filter((e) => e.role == "doctor");
    set({ doctor: filterData });
  },
  async getDoctorById(id) {
    let { data } = await axios.get(API + "/users/" + id);
    set({ doctorById: data });
  },
}));

export default useStore;
