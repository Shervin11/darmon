"use client";
import useStore from "@/store/store";
import React, { useEffect, useRef, useState } from "react";
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
import {
  Plus,
  Trash2,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Briefcase,
  Building2,
  Wallet,
  Clock,
  ChevronRight
} from "lucide-react";
import { DefaultPhoto } from "@/config/config";
import { WorkingSchedule } from "@/store/store";
import { useTranslation } from "@/lib/i18n";

const Profile = () => {
  const { loginMe, userById, edit, uploadImage, getSubcategories, subcategories } = useStore((state) => state);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const { t } = useTranslation();

  
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [clinic, setClinic] = useState("");
  const [bio, setBio] = useState("");
  const [priceCurrent, setPriceCurrent] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("сом.");
  const [schedule, setSchedule] = useState<WorkingSchedule[]>([]);

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "Душанбе", startTime: "08:00", endTime: "17:00" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index: number, field: keyof WorkingSchedule, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsPhotoRemoved(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setIsPhotoRemoved(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function editUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let finalPhoto = userById.image || "";
    if (isPhotoRemoved) finalPhoto = "";
    else if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) finalPhoto = uploadedUrl;
      else return;
    }

    const updatedUser = {
      ...userById,
      fullName: name,
      email: email.toLowerCase(),
      phone: phone,
      city: city,
      photo: finalPhoto,
      ...(userById.role === "doctor" && {
        specialty,
        experience: Number(experience),
        clinic,
        bio,
        price: { current: priceCurrent, old: userById.price?.old || "", currency: priceCurrency },
        workingSchedule: schedule,
      }),
    };

    const res = await edit(updatedUser);
    if (res.success) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }

  useEffect(() => {
    setCity(userById.city || "");
    setName(userById.fullName || "");
    setEmail(userById.email || "");
    setPhone(userById.phone || "");
    if (userById.role === "doctor") {
      setSpecialty(userById.specialty || "");
      setExperience(userById.experience || "");
      setClinic(userById.clinic || "");
      setBio(userById.bio || "");
      setPriceCurrent(userById.price?.current || "");
      setPriceCurrency(userById.price?.currency || "сом.");
      setSchedule(userById.workingSchedule || []);
    }
  }, [userById]);

  useEffect(() => {
    loginMe();
    getSubcategories();
  }, []);

  return (
    <div className="bg-md-surface-container-low min-h-screen pb-20 pt-20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00C4B0] rounded-full blur-[120px]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#007D70] rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative z-10">
            <p className="text-[#A7F3EB] text-xs uppercase tracking-[4px] font-bold mb-3 font-headline">{t("profile.badge")}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-headline">{t("profile.title")}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-4">
        <form onSubmit={editUser} className="space-y-6">
          <Card className="border-none clinical-shadow overflow-hidden bg-md-surface-container-lowest rounded-xl">
            <CardHeader className="bg-md-surface-container-lowest border-b border-md-surface-variant/20 py-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-md-on-surface font-bold border-l-4 border-md-primary pl-4 font-headline">
                  <User className="w-5 h-5 text-md-primary" />
                  <h3>{t("profile.generalInfo")}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("profile.fullName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-md-outline" />
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 bg-md-surface-container-low border-md-outline-variant/30 focus:bg-white dark:focus:bg-[#252540]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("profile.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-md-outline" />
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-11 bg-md-surface-container-low border-md-outline-variant/30 focus:bg-white dark:focus:bg-[#252540]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("profile.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-md-outline" />
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 bg-md-surface-container-low border-md-outline-variant/30 focus:bg-white dark:focus:bg-[#252540]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">{t("profile.city")}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-md-outline" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 h-11 bg-md-surface-container-low border border-md-outline-variant/30 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 ring-md-primary/20 text-md-on-surface"
                      >
                        <option value="all">{t("profile.selectCity")}</option>
                        <option value="Душанбе">Душанбе</option>
                        <option value="Бохтар">Бохтар</option>
                        <option value="Хуҷанд">Хуҷанд</option>
                        <option value="Кӯлоб">Кӯлоб</option>
                        <option value="Истаравшан">Истаравшан</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

                  <div className="space-y-4 bg-md-primary/5 p-6 rounded-3xl border border-md-primary/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-md-primary flex items-center gap-2 font-headline">
                        <Clock className="w-4 h-4" /> {t("profile.schedule")}
                      </h4>
                      <Button type="button" size="sm" onClick={handleAddSchedule} className="bg-white dark:bg-[#252540] text-md-primary border border-md-primary/20 hover:bg-md-primary/10 shadow-sm cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" /> {t("profile.addSchedule")}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {schedule.map((slot, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#1F1F28] p-3 rounded-2xl shadow-sm group">
                          <Input
                            value={slot.day}
                            onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                            className="sm:w-1/3 border-none bg-transparent font-semibold focus:ring-0"
                          />
                          <div className="flex items-center gap-2 flex-1 bg-md-surface-container-low px-3 py-1 rounded-xl">
                            <Input type="time" value={slot.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} className="border-none bg-transparent h-8 p-0" />
                            <ChevronRight className="w-4 h-4 text-md-outline" />
                            <Input type="time" value={slot.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} className="border-none bg-transparent h-8 p-0" />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveSchedule(index)}
                            className="text-md-error hover:text-md-error opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

