"use client";

import React, { use, useEffect, useState } from "react";
import { Info, Phone, Zap } from "lucide-react";
import useStore from "@/store/store";
import FixedRating from "@/components/StarRating/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Price {
  current: number;
  old: number;
  currency: string;
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
  name: string;
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

const DoctorById = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const getDoctorById = useStore.getState().getDoctorById;
  const doctorById: Doctor = useStore((state) => state.doctorById);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showFullNumber, setShowFullNumber] = useState(false);

  const handleShowNumber = () => {
    setShowFullNumber(true);
    setPhoneNumber("8 (495) 123-45-67");
  };
  useEffect(() => {
    getDoctorById(id);
  }, []);

  return (
    <div className="max-w-[1200px] m-auto p-4">
      {doctorById && (
        <div className="bg-white flex items-center justify-between">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{doctorById.name}</h2>
            <div className="flex items-center gap-5 mb-4">
              <div className="flex items-center gap-2">
                <FixedRating rating={doctorById.rating} />
                <p>{doctorById.rating}</p>
              </div>
              <p className="text-blue-600 hover:text-blue-700 text-md font-medium">
                {doctorById.comments?.length} шарҳ
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-56 relative">
                  <img
                    src={doctorById.image}
                    alt="image"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-gray-600">Таҷрибаи корӣ:</span>
                    <span className="ml-2 font-medium">
                      {doctorById.experience} сол
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Квалификатсия:</span>
                    <span className="font-medium">Табиби дараҷаи олӣ</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <span className="text-gray-600">Навъи қабул:</span>
                    <span className="ml-2 font-medium">Дар клиника</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Клиника:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {doctorById.clinic}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span>
                    {doctorById.recommendation}% беморон табибро тавсия медиҳанд
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Ихтисос:</span>
                  <span className="ml-2 font-medium">
                    {doctorById.specialty}
                  </span>
                </div>

                <div className="text-md text-gray-700">
                  <p>{doctorById.bio}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-[360px] p-4 bg-gray-100 rounded-lg overflow-hidden">
              <div className="pb-4">
                <div className="flex justify-start mb-3">
                  <p className="bg-[#2c94a1] hover:bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -30% аз Darmon
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {doctorById.price?.current} {doctorById.price?.currency}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {doctorById.price?.old} {doctorById.price?.currency}
                    </span>
                  </div>

                  <p className="text-[#2c94a1] font-medium text-sm">
                    Тахфифи махсус барои қабули аввалин
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Пардохти қабул дар клиника анҷом дода мешавад</p>
                  <p>
                    Қайд шудан ба қабул —
                    <span className="text-[#2c94a1] font-medium">ройгон</span>
                  </p>
                </div>

                <Button
                  className="w-full bg-[#2c94a1] hover:bg-teal-600 text-white py-3 rounded-xl font-medium"
                  size="lg"
                >
                  Қайд шудан ба қабул
                </Button>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="h-3 w-3 text-orange-500" />
                  <span>Тасдиқи фаврии қайд</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Рақами телефон барои қайд кардан —</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="tel"
                      placeholder="8 (49..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 text-sm"
                      disabled={showFullNumber}
                    />
                    {!showFullNumber && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleShowNumber}
                        className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal text-sm"
                      >
                        Показать номер
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorById;
