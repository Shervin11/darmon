"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, RotateCcw, Save, Volume2, Loader2, Trash2, Edit3 } from "lucide-react";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import axios from "axios";
import { useTranslation } from "@/lib/i18n";

const API = process.env.NEXT_PUBLIC_BASE_URL;

interface ProtocolData {
  complaints: string;
  diagnosis: string;
  treatment: string;
  follow_up: string;
}

interface MedicalRecord {
  id: number;
  clientId: number;
  doctorId: number;
  doctorName: string;
  data: ProtocolData;
  transcript: string;
  createdAt: string;
  updatedAt: string;
}

const ProtocolPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { userById, loginMe } = useStore((s) => s);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [error, setError] = useState("");

  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Saved records
  const [savedRecords, setSavedRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  // Fetch patients
  useEffect(() => {
    loginMe();
  }, []);

  useEffect(() => {
    if (userById?.id) {
      axios.get(`${API}/appointments?doctorId=${userById.id}&status=approved`)
        .then(async ({ data }) => {
          const clientIds = Array.from(new Set(data.map((a: any) => a.clientId)));
          const patientDetails = await Promise.all(
            clientIds.map(id => axios.get(`${API}/users/${id}`).then(res => res.data).catch(() => null))
          );
          setPatients(patientDetails.filter(Boolean));
        })
        .catch(console.error);
    }
  }, [userById]);

  // Fetch saved medical records
  const fetchRecords = async () => {
    if (!userById?.id) return;
    setLoadingRecords(true);
    try {
      const { data } = await axios.get(`${API}/medical-records?doctorId=${userById.id}`);
      setSavedRecords(data);
    } catch (e) { console.error(e); }
    finally { setLoadingRecords(false); }
  };

  useEffect(() => { fetchRecords(); }, [userById]);

  const handleRecordingComplete = async (blob: Blob) => {
    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const response = await fetch("/api/audio/protocol", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("common.error"));
        setIsProcessing(false);
        return;
      }

      setTranscript(data.transcript || "");
      setProtocol({
        complaints: data.protocol?.complaints || "",
        diagnosis: data.protocol?.diagnosis || "",
        treatment: data.protocol?.treatment || "",
        follow_up: data.protocol?.follow_up || "",
      });
    } catch (err) {
      console.error("Protocol error:", err);
      setError(t("common.error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTranscript("");
    setProtocol(null);
    setError("");
    setEditingRecordId(null);
  };

  const handleManualEntry = () => {
    setProtocol({
      complaints: "",
      diagnosis: "",
      treatment: "",
      follow_up: ""
    });
  };

  const handleFieldChange = (key: keyof ProtocolData, value: string) => {
    if (protocol) {
      setProtocol({ ...protocol, [key]: value });
    }
  };

  const isFormValid = (): boolean => {
    if (!selectedPatientId) return false;
    if (!protocol) return false;
    const hasContent = protocol.complaints.trim() || protocol.diagnosis.trim() || protocol.treatment.trim();
    return !!hasContent;
  };

  const handleSave = async () => {
    if (!selectedPatientId) {
      setError(t("protocol.patientSelect"));
      return;
    }
    if (!protocol) return;
    if (!isFormValid()) {
      setError(t("protocol.errorSave"));
      return;
    }

    setIsSaving(true);
    try {
      if (editingRecordId) {
        await axios.patch(`${API}/medical-records/${editingRecordId}`, {
          data: protocol,
          transcript: transcript
        });
      } else {
        await axios.post(`${API}/medical-records`, {
          clientId: selectedPatientId,
          doctorId: userById?.id,
          doctorName: userById?.fullName,
          data: protocol,
          transcript: transcript
        });
      }
      handleReset();
      await fetchRecords();
    } catch (err) {
      console.error(err);
      setError(t("protocol.errorSave"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecordId(record.id);
    setSelectedPatientId(String(record.clientId));
    setProtocol(record.data);
    setTranscript(record.transcript || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm(t("common.deleteConfirm"))) return;
    try {
      await axios.delete(`${API}/medical-records/${id}`);
      await fetchRecords();
    } catch (e) {
      console.error(e);
      setError(t("protocol.errorDelete"));
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);

    try {
      const response = await fetch("/api/audio/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) return;

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setIsSpeaking(false);
    }
  };

  const fields: { key: keyof ProtocolData; label: string; icon: string }[] = [
    { key: "complaints", label: t("protocol.complaints"), icon: "🩺" },
    { key: "diagnosis", label: t("protocol.diagnosis"), icon: "📋" },
    { key: "treatment", label: t("protocol.treatment"), icon: "💊" },
    { key: "follow_up", label: t("protocol.followUp"), icon: "📅" },
  ];

  return (
    <div className="min-h-screen bg-md-surface pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
       
          <div>
            <h1 className="text-2xl font-bold font-headline text-md-on-surface flex items-center gap-2">
              <FileText className="w-6 h-6 text-violet-500" />
              {t("protocol.title")}
            </h1>
            <p className="text-sm text-md-on-surface-variant">
              {t("protocol.subtitle")}
            </p>
          </div>

        {/* ── FORM ── */}
        <div className="bg-white dark:bg-md-surface-container-lowest rounded-3xl shadow-sm border border-md-outline/10 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">

            {editingRecordId && (
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                {t("chat.edit")} #{editingRecordId}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-md-on-surface-variant uppercase tracking-wider block">
                {t("protocol.patientSelect")}
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                disabled={!!editingRecordId}
                className="w-full h-12 bg-md-surface-container-low border border-md-outline/10 rounded-xl px-4 text-md-on-surface outline-none focus:border-md-primary transition-all disabled:opacity-60"
              >
                <option value="">— {t("profile.selectCity")} —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} {p.phone ? `(${p.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {!protocol && (
              <div className="bg-md-surface-container-low rounded-2xl p-8 border border-md-outline/10 flex flex-col items-center justify-center min-h-[300px] gap-6">
                <VoiceRecorder
                  onRecordingComplete={handleRecordingComplete}
                  isProcessing={isProcessing}
                />
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px bg-md-outline/10 flex-1" />
                  <span className="text-xs text-md-on-surface-variant font-bold uppercase">ё / or</span>
                  <div className="h-px bg-md-outline/10 flex-1" />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleManualEntry}
                  className="rounded-xl px-8 h-12 font-bold cursor-pointer"
                >
                  {t("protocol.manualEntry")}
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 font-medium">
                ⚠️ {error}
              </div>
            )}

            {protocol && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-md-outline/10 pb-2">
                  <h3 className="text-sm font-bold text-md-primary uppercase tracking-wider">
                    {t("protocol.transcript")}
                  </h3>
                  {transcript && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(transcript)}
                      disabled={isSpeaking}
                      className="text-md-primary hover:bg-md-primary/10 p-2 rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                    >
                      {isSpeaking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t("common.loading")}</>
                      ) : (
                        <><Volume2 className="w-4 h-4" /> {t("protocol.speak")}</>
                      )}
                    </button>
                  )}
                </div>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="..."
                  className="w-full min-h-[80px] bg-md-surface-container-low p-4 rounded-2xl text-[15px] text-md-on-surface leading-relaxed border border-md-outline/5 outline-none focus:border-md-primary resize-none transition-all"
                />
              </div>
            )}

            {protocol && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider border-b border-md-outline/10 pb-2">
                  {t("protocol.medicalCard")}
                </h3>

                <div className="grid gap-6">
                  {fields.map(({ key, label, icon }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider">
                          {label}
                        </span>
                      </div>
                      <textarea
                        value={protocol[key] || ""}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder="..."
                        className="w-full min-h-[100px] bg-white dark:bg-md-surface-container-low border border-md-outline/10 rounded-2xl p-4 text-md-on-surface outline-none focus:border-violet-500 transition-all resize-none shadow-inner"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {protocol && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-md-outline/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex-1 h-14 rounded-xl gap-2 cursor-pointer font-bold text-md-on-surface border-md-outline/20 hover:bg-md-surface-container-low"
                >
                  <RotateCcw className="w-5 h-5" />
                  {editingRecordId ? t("protocol.cancel") : t("protocol.clear")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !isFormValid()}
                  className="flex-1 h-14 rounded-xl gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white cursor-pointer font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}</>
                  ) : (
                    <><Save className="w-5 h-5" /> {editingRecordId ? t("protocol.update") : t("protocol.save")}</>
                  )}
                </Button>
              </div>
            )}
            
          </div>
        </div>

        {/* ── SAVED RECORDS ── */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-headline text-md-on-surface flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            {t("protocol.savedCards")}
          </h2>

          {loadingRecords ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-md-primary" />
            </div>
          ) : savedRecords.length === 0 ? (
            <div className="bg-white dark:bg-md-surface-container-lowest rounded-3xl p-12 text-center border border-dashed border-md-outline/20">
              <p className="text-md-on-surface-variant italic">{t("protocol.noCards")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedRecords.map((record) => {
                const patient = patients.find(p => p.id == record.clientId);
                return (
                  <div key={record.id} className="bg-white dark:bg-md-surface-container-lowest border border-md-outline/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-md-primary uppercase tracking-widest mb-1">
                          {new Date(record.createdAt).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-sm font-bold text-md-on-surface">
                          {patient?.fullName || `Бемор ID: ${record.clientId}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-2 rounded-xl text-md-primary hover:bg-md-primary/10 transition-all cursor-pointer"
                          title={t("chat.edit")}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                          title={t("chat.delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {record.data.diagnosis && (
                        <div className="p-3 bg-md-surface-container-low rounded-xl">
                          <p className="text-[10px] font-bold text-md-on-surface-variant uppercase mb-1">{t("protocol.diagnosis")}</p>
                          <p className="font-semibold text-md-on-surface">{record.data.diagnosis}</p>
                        </div>
                      )}
                      {record.data.treatment && (
                        <div className="p-3 bg-md-surface-container-low rounded-xl">
                          <p className="text-[10px] font-bold text-md-on-surface-variant uppercase mb-1">{t("protocol.treatment")}</p>
                          <p className="text-md-on-surface">{record.data.treatment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProtocolPage;
