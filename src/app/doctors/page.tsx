"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/store/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import FixedRating from "@/components/StarRating/page";
import toast from "react-hot-toast";

interface Price {
  current: number;
  old: number;
  currency: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  subcategories: string[];
}

interface User {
  fullName: string;
  photo: string;
}

interface Comment {
  id: number;
  user: User;
  rating: number;
  comment: string;
  date: string;
}

interface AvailableSlot {
  id: number;
  day: string;
  date: string;
  time: string;
  active?: boolean;
  disabled?: boolean;
}

interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  experience: number;
  recommendation?: number;
  rating: number;
  price?: Price;
  city: string;
  clinic: string;
  image: string;
  bio: string;
  availableSlots: AvailableSlot[];
  comments?: Comment[];
}

const Doctors = () => {
  const category: Category[] = useStore((state) => state.category);
  const doctor: Doctor[] = useStore((state) => state.doctor);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const { toggleWishlist, userById, loginMe } = useStore((state) => state);
  const [doc, setDoc] = useState("");
  const [city, setCity] = useState("all");
  const [filterData, setFilterData] = useState(doctor);
  const getCategory = useStore.getState().getCategory;
  const getDoctor = useStore.getState().getDoctor;

  function searchDoctor() {
    if (doc && city != "all") {
      setFilterData(
        doctor.filter(
          (e) =>
            (e.fullName.toLowerCase().includes(doc.toLowerCase()) &&
              e.city == city) ||
            (e.clinic.toLowerCase().includes(doc.toLowerCase()) &&
              e.city == city),
        ),
      );
    } else if (doc) {
      setFilterData(
        doctor.filter(
          (e) =>
            e.fullName.toLowerCase().includes(doc.toLowerCase()) ||
            e.clinic.toLowerCase().includes(doc.toLowerCase()),
        ),
      );
    } else if (city != "all") {
      setFilterData(doctor.filter((e) => e.city == city));
    } else setFilterData(doctor);
  }

  function searchDoctorByCategory(categoryName: string) {
    setFilterData(doctor.filter((e) => e.specialty == categoryName));
  }

  useEffect(() => {
    getCategory();
    getDoctor();
    loginMe();
  }, []);

  useEffect(() => {
    setFilterData(doctor);
  }, [doctor]);

  return (
    <div>
      <section className="py-16 max-w-[1440px] m-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
              Онлайн ба қабули духтур номнавис шавед.
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={doc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDoc(e.target.value)
                  }
                  placeholder="Табиб, Клиника"
                  className="h-12 text-base border-gray-200 focus:border-teal-500"
                />
                <select
                  id="city-select"
                  value={city}
                  className="
            w-full
            px-4 py-3
            text-base
            border border-gray-200
            rounded-lg
            bg-white
            text-[gray]
            transition-all duration-200
            cursor-pointer
            focus:outline-none
            focus:ring-3
            focus:ring-gray-300
            focus:border-gray-400
            hover:border-gray-400
            appearance-none
            pr-10
          "
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCity(e.target.value)
                  }
                >
                  <option value="all">Шаҳрҳо</option>
                  <option value="Душанбе">Душанбе</option>
                  <option value="Бохтар">Бохтар</option>
                  <option value="Хуҷанд">Хуҷанд</option>
                  <option value="Кулоб">Кӯлоб</option>
                  <option value="Истарафшан">Истарафшан</option>
                </select>
                <Button
                  onClick={searchDoctor}
                  className="w-full h-12 cursor-pointer hover:bg-teal-800 bg-[#2c94a1] text-white font-semibold text-base rounded-lg"
                >
                  Ёфтан
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              Мутахассисҳои машҳур
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {category.map((e) => (
                <div
                  onClick={() => setSelectedCategory(e)}
                  key={e.id}
                  className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <img src={e.image} alt={"image"} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center leading-tight whitespace-pre-line">
                    {e.name}
                  </span>
                </div>
              ))}
            </div>
            <div>
              {selectedCategory && (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {selectedCategory.subcategories.map((sub, index) => (
                    <div
                      key={index}
                      onClick={() => searchDoctorByCategory(sub)}
                      className="px-4 py-2 bg-white border rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 max-w-[1440px] m-auto min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Ба қабули беҳтарин духтурон навиштан{" "}
          </h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-blue-600">Духтури хуб</span> —
              мутахассиси васеъпрофил мебошад, ки бар асоси нишонаҳои шуморо
              ташхис мекунад, ташхиси дурустро мегузорад ва табобати самаранок
              таъин менамояд.
            </p>
          </div>

          <div className="flex flex-col gap-7">
            {filterData.map(
              (e) =>
                e.availableSlots &&
                e.bio &&
                e.city &&
                e.fullName &&
                e.specialty &&
                e.clinic &&
                e.price && (
                  <div
                    key={e.id}
                    className="bg-white group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-2xl p-6"
                  >
                    <div className="flex justify-between gap-6">
                      <div>
                        <div className="flex gap-4 mb-6">
                          <div className="relative flex w-[200px] flex-col items-center">
                            <Link href={`/doctors/${e.id}`}>
                              <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-100">
                                <img
                                  src={e.image}
                                  alt={e.fullName}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            <button
                              onClick={() => {
                                if (userById?.id) {
                                  toggleWishlist(userById.id, e);
                                } else {
                                  toast.error("Лутфан ворид шавед!");
                                }
                              }}
                              className="absolute text-white bg-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 -top-2 cursor-pointer right-0 w-8 h-8 rounded-full shadow-md flex items-center justify-center"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                            <div className="flex flex-col items-center gap-2 mb-4">
                              <FixedRating rating={e.rating} />
                              <span
                                style={{
                                  display:
                                    e.recommendation == 0 ? "none" : "block",
                                }}
                                className="text-sm text-center text-gray-600"
                              >
                                {e.recommendation}% беморон <br /> духтурро
                                тавсия медиҳанд
                              </span>
                              <p className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                {e.comments?.length} шарҳ
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-semibold mb-2">
                              {e.specialty}
                            </span>
                            <Link href={`/doctors/${e.id}`}>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {e.fullName}
                              </h3>
                            </Link>
                            <p className="text-gray-600 mb-3">{e.bio}</p>
                            <div className="mb-4 w-[195px]">
                              <h4 className="font-medium text-gray-900 mb-3">
                                Навъи қабули духтур
                              </h4>
                              <div className="border-2 h-[150px] border-gray-200 rounded-lg p-3">
                                <div className="w-8 h-8 flex items-center justify-center mb-2 rounded-full bg-gray-300">
                                  🏥
                                </div>
                                <div className="text-sm">
                                  <div className="font-medium">
                                    Дар {e.clinic}
                                  </div>
                                  <div className="text-gray-600">
                                    от {e.price?.current} {e.price?.currency}
                                  </div>
                                  <div className="text-xs line-through text-gray-400">
                                    {e.price?.old} {e.price?.currency}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            {e.availableSlots.map((el) => (
                              <button
                                key={el.id}
                                disabled={el.disabled}
                                className={`p-2 rounded-lg text-start h-[55px] border transition-colors ${
                                  el.active
                                    ? "bg-blue-500 text-white"
                                    : el.disabled
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <div className="font-medium">{el.day}</div>
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-3 mb-4">
                            {e.availableSlots.map((el) => (
                              <Button
                                key={el.id}
                                variant="outline"
                                size="sm"
                                className="bg-blue-500 text-white text-xs border-blue-500 hover:text-[white] hover:bg-blue-600"
                              >
                                {el.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
            )}

            {filterData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-21 h-20 text-2xl flex items-center justify-center rounded-full bg-blue-50 mb-6">
                  🩺
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Табибе ёфт нашуд
                </h2>

                <p className="text-gray-500 max-w-md mb-6">
                  Мутаассифона, бо параметрҳои интихобшуда ягон духтур ёфт
                  нашуд. Лутфан филтрҳоро тағйир диҳед ё ҷустуҷӯро аз нав
                  санҷед.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
