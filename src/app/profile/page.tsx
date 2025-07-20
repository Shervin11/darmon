"use client";
import useStore from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Mail, MapPin, Phone, Eye } from "lucide-react";
import { DefaultPhoto } from "@/config/config";
import { usePathname, useRouter } from "next/navigation";

const Profile = () => {
  const { loginMe, userById, edit } = useStore((state) => state);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setIsPhotoRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function editUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let user = {
      ...userById,
      fullName: name,
      email: email,
      phone: phone,
      city: city,
      photo: isPhotoRemoved
        ? null
        : previewUrl || userById.photo || DefaultPhoto,
    };
    edit(user);
  }

  useEffect(() => {
    setCity(userById.city);
    setName(userById.fullName);
    setEmail(userById.email);
    setPhone(userById.phone);
  }, [userById]);

  useEffect(() => {
    loginMe();
  }, []);

  return (
    <div className="max-w-[1200px] m-auto">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={userById.photo || DefaultPhoto}
                      alt="avatar"
                      className="w-[130px] h-[130px] rounded-full object-cover border"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {userById.fullName}
                      </h2>
                      <p className="text-gray-600">Пациент ID: {userById.id}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {userById.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {userById.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments">Приемы</TabsTrigger>
              <TabsTrigger value="profile">Профиль</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Мои приемы</h3>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Записаться на прием
                </Button>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Консультация кардиолога
                          </h4>
                          <p className="text-sm text-gray-600">
                            Др. Смирнов Александр Владимирович
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                25 декабря 2024
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                14:30
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Кабинет 205
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          Подтвержден
                        </Badge>
                        <Button variant="outline" size="sm">
                          Отменить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Плановый осмотр</h4>
                          <p className="text-sm text-gray-600">
                            Др. Петрова Наталья Ивановна
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                15 декабря 2024
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                10:00
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Кабинет 101
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Завершен</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Отчет
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                  <CardDescription>
                    Управление вашими личными данными
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={editUser}>
                    <div className="flex items-center mb-[20px] gap-4">
                      <img
                        src={
                          isPhotoRemoved
                            ? DefaultPhoto
                            : previewUrl || userById.photo || DefaultPhoto
                        }
                        alt="avatar"
                        className="w-[130px] h-[130px] rounded-full object-cover border"
                      />

                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={handleRemovePhoto}
                          variant="outline"
                          className="cursor-pointer"
                        >
                          Удалит кардани сурат
                        </Button>

                        <label
                          htmlFor="avatar-upload"
                          className="inline-block cursor-pointer px-4 py-1.5 text-[15px] text-white bg-[#2c94a1] hover:bg-teal-800 rounded-md text-center"
                        >
                          Иваз кардани сурат
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ному насаб</Label>
                        <Input
                          id="firstName"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city-select">Шахрҳо</Label>
                        <select
                          id="city-select"
                          value={city}
                          className="
                        w-full
                        px-4 py-[5px]
                                  text-base
                                  border border-gray-200
                                  rounded-lg
                                  bg-white
                                  transition-all duration-200
                                  cursor-pointer
                                  focus:outline-none
                                  focus:ring-3
                                  focus:ring-gray-300
                                  focus:border-gray-400
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
                          <option value="Кӯлоб">Кӯлоб</option>
                          <option value="Истарафшан">Истарафшан</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end my-[20px]">
                      <Button
                        type="submit"
                        className="hover:bg-teal-800 bg-[#2c94a1]"
                      >
                        Иваз кардан
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
