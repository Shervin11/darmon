"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Save, Volume2, Loader2, Trash2, Edit3, AlertCircle, Stethoscope, ClipboardList, Pill, CalendarClock } from "lucide-react";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import useStore from "@/store/store";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { ECG_WIDE, ECG_SHORT, delay } from "@/lib/ui";

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

const textareaCls =
  "w-full rounded-2xl p-4 text-md-on-surface leading-relaxed bg-md-surface-container-low border border-transparent outline-none transition resize-none focus:border-md-primary/50 focus:ring-2 ring-md-primary/20";

const ProtocolPage = () => {
  const { t } = useTranslation();
  const userById = useStore((s) => s.userById);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [error, setError] = useState("");

  const [patients, setPatients] = useState<{ id: number; fullName: string; phone?: string }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Saved records
  const [savedRecords, setSavedRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

  // Patients = clients with an approved appointment
  useEffect(() => {
    if (!userById?.id) return;
    api.get("/appointments", { params: { status: "approved" } })
      .then(async ({ data }) => {
        const clientIds = [...new Set<number>(data.map((a: { clientId: number }) => a.clientId))];
        const users = await Promise.all(clientIds.map((id) => api.get(`/users/${id}`).then((r) => r.data).catch(() => null)));
        setPatients(users.filter(Boolean));
      })
      .catch(console.error);
  }, [userById?.id]);

  // Fetch saved medical records
  const fetchRecords = async () => {
    if (!userById?.id) return;
    setLoadingRecords(true);
    try {
      const { data } = await api.get("/medical-records");
      setSavedRecords(data);
    } catch (e) { console.error(e); }
    finally { setLoadingRecords(false); }
  };

  useEffect(() => { fetchRecords(); }, [userById?.id]);

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
        await api.patch(`/medical-records/${editingRecordId}`, { data: protocol, transcript });
      } else {
        await api.post("/medical-records", { clientId: selectedPatientId, data: protocol, transcript });
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
      await api.delete(`/medical-records/${id}`);
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

  const fields: { key: keyof ProtocolData; label: string; icon: React.ReactNode }[] = [
    { key: "complaints", label: t("protocol.complaints"), icon: <Stethoscope className="w-4 h-4" /> },
    { key: "diagnosis", label: t("protocol.diagnosis"), icon: <ClipboardList className="w-4 h-4" /> },
    { key: "treatment", label: t("protocol.treatment"), icon: <Pill className="w-4 h-4" /> },
    { key: "follow_up", label: t("protocol.followUp"), icon: <CalendarClock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-md-surface pt-20 pb-16 px-4 sm:px-6">

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-[2rem] bg-md-banner px-8 py-10 md:px-12 md:py-14 mt-4">
          <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-3 h-20 w-full text-white/20">
            <path d={ECG_WIDE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="fx-draw" />
          </svg>
          <div className="relative space-y-3 max-w-xl">
            <h1 className="fx-rise text-white font-headline font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.05]" style={delay("0.1s")}>
              {t("protocol.title")}
            </h1>
            <p className="fx-rise text-md-on-banner-muted text-lg leading-relaxed" style={delay("0.3s")}>
              {t("protocol.subtitle")}
            </p>
          </div>
        </header>

        {/* ── FORM ── */}
        <section className="bg-md-surface-container-lowest rounded-[2rem] clinical-shadow p-6 sm:p-10 space-y-8">
          {editingRecordId && (
            <div className="fx-open inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-5 py-2.5 text-sm font-semibold">
              <Edit3 className="w-4 h-4" />
              {t("chat.edit")} #{editingRecordId}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="patient" className="text-sm font-medium text-md-on-surface-variant block ml-1">
              {t("protocol.patientSelect")}
            </label>
            <select
              id="patient"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              disabled={!!editingRecordId}
              className="w-full h-14 bg-md-surface-container-low border border-transparent rounded-full px-6 text-md-on-surface outline-none transition focus:border-md-primary/50 focus:ring-2 ring-md-primary/20 disabled:opacity-60"
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
            <div className="rounded-[1.5rem] bg-md-surface-container-low p-8 flex flex-col items-center justify-center min-h-[300px] gap-6">
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                isProcessing={isProcessing}
              />

              {isProcessing && (
                <svg aria-hidden="true" viewBox="0 0 120 40" className="h-10 w-28 text-md-primary" role="status">
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={ECG_SHORT} pathLength="1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fx-run" />
                </svg>
              )}

              <div className="flex items-center gap-4 w-full max-w-sm">
                <div className="h-px bg-md-outline/20 flex-1" />
                <span className="text-sm text-md-on-surface-variant">ё / or</span>
                <div className="h-px bg-md-outline/20 flex-1" />
              </div>
              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="rounded-full px-8 h-12 font-bold cursor-pointer"
              >
                {t("protocol.manualEntry")}
              </Button>
            </div>
          )}

          {error && (
            <div role="alert" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-5 py-4 rounded-2xl flex items-start gap-3 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {protocol && (
            <div className="fx-open space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-headline font-bold text-xl text-md-on-surface">{t("protocol.transcript")}</h3>
                {transcript && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(transcript)}
                    disabled={isSpeaking}
                    className="text-md-primary hover:bg-md-primary/10 px-4 py-2 rounded-full transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
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
                className={`${textareaCls} min-h-[90px]`}
              />
            </div>
          )}

          {protocol && (
            <div className="fx-open space-y-5">
              <h3 className="font-headline font-bold text-xl text-md-on-surface">{t("protocol.medicalCard")}</h3>

              <div className="grid md:grid-cols-2 gap-5">
                {fields.map(({ key, label, icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-md-on-surface-variant ml-1">
                      <span className="h-7 w-7 rounded-full bg-md-primary/10 text-md-primary flex items-center justify-center">{icon}</span>
                      {label}
                    </label>
                    <textarea
                      value={protocol[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      placeholder="..."
                      className={`${textareaCls} min-h-[130px]`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {protocol && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
                className="flex-1 h-14 rounded-full gap-2 cursor-pointer font-bold"
              >
                <RotateCcw className="w-5 h-5" />
                {editingRecordId ? t("protocol.cancel") : t("protocol.clear")}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isFormValid()}
                className="flex-1 h-14 rounded-full gap-2 bg-md-primary hover:bg-md-primary/90 text-white cursor-pointer font-bold shadow-lg shadow-md-primary/25 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}</>
                ) : (
                  <><Save className="w-5 h-5" /> {editingRecordId ? t("protocol.update") : t("protocol.save")}</>
                )}
              </Button>
            </div>
          )}
        </section>

        {/* ── SAVED RECORDS ── */}
        <section className="space-y-5">
          <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight text-md-on-surface px-1">
            {t("protocol.savedCards")}
          </h2>

          {loadingRecords ? (
            <div className="grid gap-4" role="status">
              {[0, 1].map((i) => (
                <div key={i} className="h-40 rounded-[2rem] bg-md-surface-container-low animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : savedRecords.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-md-outline/20 px-8 py-14 text-center space-y-4">
              <svg aria-hidden="true" viewBox="0 0 120 40" className="mx-auto h-10 w-28 text-md-primary/40">
                <path d="M0 20 H44 L52 20 L58 6 L67 34 L74 20 H120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-md-on-surface-variant text-lg">{t("protocol.noCards")}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedRecords.map((record, i) => {
                const patient = patients.find(p => p.id == record.clientId);
                return (
                  <article
                    key={record.id}
                    className="fx-rise bg-md-surface-container-lowest clinical-shadow rounded-[2rem] p-6 sm:p-8 space-y-5"
                    style={delay(`${Math.min(i, 8) * 0.07}s`)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-semibold text-md-primary mb-1">
                          {new Date(record.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <p className="font-headline font-bold text-xl text-md-on-surface">
                          {patient?.fullName || `Бемор ID: ${record.clientId}`}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditRecord(record)}
                          aria-label={t("chat.edit")}
                          title={t("chat.edit")}
                          className="h-10 w-10 flex items-center justify-center rounded-full text-md-primary bg-md-primary/10 hover:bg-md-primary hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          aria-label={t("chat.delete")}
                          title={t("chat.delete")}
                          className="h-10 w-10 flex items-center justify-center rounded-full text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {(record.data.diagnosis || record.data.treatment) && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {record.data.diagnosis && (
                          <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                            <p className="text-xs text-md-on-surface-variant mb-1">{t("protocol.diagnosis")}</p>
                            <p className="font-semibold text-md-on-surface leading-relaxed">{record.data.diagnosis}</p>
                          </div>
                        )}
                        {record.data.treatment && (
                          <div className="rounded-2xl bg-md-surface-container-low px-5 py-4">
                            <p className="text-xs text-md-on-surface-variant mb-1">{t("protocol.treatment")}</p>
                            <p className="text-md-on-surface leading-relaxed">{record.data.treatment}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProtocolPage;