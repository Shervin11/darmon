"use client";
import useStore from "@/store/store";
import React, { useEffect } from "react";
import { Heart, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  photo: string;
}

const Wishlist = () => {
  const { loginMe, wishlistUser, userById, wishlist, toggleWishlist } =
    useStore((state) => state);

  function handleRemoveFromFavorites(doctor: Doctor) {
    toggleWishlist(userById.id, doctor);
  }
  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) {
      wishlistUser(userById.id);
    }
  }, [userById]);

  return (
    <div className="container max-w-[1250px] mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Избранные врачи
        </h1>
        <p className="text-gray-600">Ваши любимые специалисты в одном месте</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist?.favorites?.length > 0 ? (
          wishlist?.favorites.map((doctor: Doctor, i: number) => (
            <Card
              key={i}
              className="group relative overflow-hidden py-0 hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:from-teal-50/30 hover:to-white"
            >
              <CardContent className="p-0">
                <div className="h-20 bg-gradient-to-r from-teal-500 to-teal-600 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 w-8 cursor-pointer h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-red-500 hover:text-red-600 transition-all duration-300 border border-white/20 shadow-sm"
                    onClick={() => handleRemoveFromFavorites(doctor)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>

                <div className="px-6 -mt-12 relative z-10">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <img
                          className="w-full h-full object-cover"
                          alt="avatar"
                          src={doctor.photo || "/placeholder.svg"}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">
                        {doctor.name}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="bg-teal-100 text-teal-700 hover:bg-teal-200 font-medium px-3 py-1"
                      >
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {doctor.specialty}
                      </Badge>
                    </div>

                    <Link
                      href={`/doctors/${doctor.doctorId}`}
                      className="block my-4"
                    >
                      <Button className="w-full cursor-pointer bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                        Записаться на прием
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Нет избранных врачей
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Добавьте врачей в избранное, чтобы быстро находить их здесь и
                записываться на прием
              </p>
              <Link href={"/doctors"}>
                <Button
                  variant="outline"
                  className="border-teal-200 cursor-pointer text-teal-600 hover:bg-teal-50 bg-transparent"
                >
                  Найти врачей
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
