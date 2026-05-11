import { useState, useRef } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { createProgram, ApiError } from "@/app/shared/service/trainingProgramApi";
import { createWeeklyTemplate } from "@/app/shared/service/weeklyTemplateApi";
import { createSessionTemplate } from "@/app/shared/service/sessionTemplateApi";
import { createExerciseTemplate } from "@/app/shared/service/exerciseTemplateApi";
import { tokenStorage } from "@/utils/tokenStorage";
import { RepeatMode } from "@/app/shared/model/WeeklyTemplate";
import { DayOfWeek } from "@/app/shared/model/SessionTemplate";
import { ExerciseType } from "@/app/shared/model/ExerciseTemplate";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Platform } from "react-native";


type Step = "info" | "templates";

interface ExerciseSlot { exerciseType: ExerciseType; sets: number; repsPerSet: number; }
interface DayPlan { [day: string]: ExerciseSlot[]; }
interface TemplatePlan { label: string; days: DayPlan; }

const REPEAT_MODES: { id: RepeatMode; title: string; desc: string }[] = [
  { id: "ALL_WEEKS",        title: "Same every week",   desc: "One template repeated throughout" },
  { id: "BY_WEEK_OF_MONTH", title: "Monthly cycle",     desc: "4 templates cycling each month (W1–W4)" },
  { id: "INDEPENDENT",      title: "Week by week",      desc: "Customize each week from the dashboard" },
];

const DAYS: DayOfWeek[] = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
];
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const EXERCISE_TYPES: ExerciseType[] = ["SQUAT", "PUSHUP", "BICEP", "PLANK"];
const EXERCISE_ICONS: Record<ExerciseType, string> = {
  SQUAT:  "barbell",
  PUSHUP: "body",
  BICEP:  "fitness",
  PLANK:  "remove",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function emptyPlan(): DayPlan {
  return Object.fromEntries(DAYS.map((d) => [d, []]));
}

function templateCount(mode: RepeatMode): number {
  if (mode === "ALL_WEEKS") return 1;
  if (mode === "BY_WEEK_OF_MONTH") return 4;
  return 0;
}

function templateLabel(mode: RepeatMode, idx: number): string {
  if (mode === "ALL_WEEKS") return "Every week";
  return `Week ${idx + 1} of month`;
}



export default function CreateProgram() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  // Step 1
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd]     = useState("");
  const [mode, setMode]   = useState<RepeatMode>("ALL_WEEKS");

  // Step 2
  const [step, setStep]               = useState<Step>("info");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [templates, setTemplates]     = useState<TemplatePlan[]>([]);

  // Modal state (add exercise to a day)
  const [modalDay, setModalDay]     = useState<DayOfWeek | null>(null);
  const [pickedType, setPickedType] = useState<ExerciseType>("SQUAT");
  const [sets, setSets]             = useState(3);
  const [repsPerSet, setRepsPerSet] = useState(10);

  const [loading, setLoading]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError]       = useState<string | null>(null);
  const submitting                    = useRef(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker]   = useState(false);

  // ── Step 1: validate & advance ───────────────────────────────────────────
  function goToTemplates() {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (!DATE_RE.test(start) || isNaN(new Date(start).getTime())) errs.start = "Enter YYYY-MM-DD.";
    if (!DATE_RE.test(end)   || isNaN(new Date(end).getTime()))   errs.end   = "Enter YYYY-MM-DD.";
    if (!errs.start && !errs.end && end <= start) errs.end = "End must be after start.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    const count = templateCount(mode);
    setTemplates(
      Array.from({ length: count }, (_, i) => ({
        label: templateLabel(mode, i),
        days:  emptyPlan(),
      }))
    );
    setTemplateIdx(0);
    setStep("templates");
  }

  // ── Template builder helpers ─────────────────────────────────────────────
  function currentDays(): DayPlan {
    return templates[templateIdx]?.days ?? emptyPlan();
  }

  function addExercise() {
    if (!modalDay) return;
    setTemplates((prev) => {
      const copy = prev.map((t, i) => {
        if (i !== templateIdx) return t;
        const daySlots = [...(t.days[modalDay] ?? []), { exerciseType: pickedType, sets, repsPerSet }];
        return { ...t, days: { ...t.days, [modalDay]: daySlots } };
      });
      return copy;
    });
    setModalDay(null);
    setSets(3);
    setRepsPerSet(10);
  }

  function removeExercise(day: DayOfWeek, idx: number) {
    setTemplates((prev) =>
      prev.map((t, i) => {
        if (i !== templateIdx) return t;
        const slots = t.days[day].filter((_, si) => si !== idx);
        return { ...t, days: { ...t.days, [day]: slots } };
      })
    );
  }

  // ── Final submit ─────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (submitting.current) return;
    submitting.current = true;
    setApiError(null);
    setLoading(true);
    try {
      const email = (await tokenStorage.getEmail?.()) ?? "";

      const program = await createProgram({
        title: title.trim(),
        startDate: start,
        endDate: end,
        userEmail: email,
        weeklyTemplates: [],
        programWeeks: [],
      });

      for (let ti = 0; ti < templates.length; ti++) {
        const tpl = templates[ti];
        const wt = await createWeeklyTemplate({
          label: tpl.label,
          repeatMode: mode,
          weekOfMonth: mode === "BY_WEEK_OF_MONTH" ? ti + 1 : null,
          trainingProgramId: program.id,
        });

        let orderInWeek = 0;
        for (const day of DAYS) {
          const slots = tpl.days[day];
          if (!slots.length) continue;
          orderInWeek += 1;

          const st = await createSessionTemplate({
            dayOfWeek: day,
            orderInWeek,
            weeklyTemplateId: wt.id,
          });

          for (let ei = 0; ei < slots.length; ei++) {
            const slot = slots[ei];
            await createExerciseTemplate({
              exerciseType: slot.exerciseType,
              sets: slot.sets,
              repsPerSet: slot.repsPerSet,
              orderInSession: ei + 1,
              sessionTemplateId: st.id,
            });
          }
        }
      }

      router.replace({ pathname: "/programs/[id]", params: { id: String(program.id) } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setApiError(err.message);
        setStep("info");
      } else {
        setApiError(err instanceof Error ? err.message : "Unexpected error.");
      }
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  }

  function onStartChange(event: DateTimePickerEvent, date?: Date) {
    setShowStartPicker(Platform.OS === "ios"); // reste ouvert sur iOS
    if (event.type === "set" && date) {
      setStart(date.toISOString().split("T")[0]);
      setFieldErrors((p) => ({ ...p, start: "" }));
    }
  }

  function onEndChange(event: DateTimePickerEvent, date?: Date) {
    setShowEndPicker(Platform.OS === "ios");
    if (event.type === "set" && date) {
      setEnd(date.toISOString().split("T")[0]);
      setFieldErrors((p) => ({ ...p, end: "" }));
    }
  }

  // ─── Render: Step 1 ───────────────────────────────────────────────────────
  if (step === "info") {
    return (
      <View style={[s.root, { backgroundColor: c.background }]}>
        {/* Header */}
        <View style={[s.header, { borderBottomColor: c.border }]}>
          <TouchableOpacity style={s.headerBtn} onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={22} color={c.accent} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: c.text }]}>New Program</Text>
          <View style={s.headerBtn} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* API error */}
          {apiError ? (
            <View style={[s.errorBanner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
              <Ionicons name="alert-circle-outline" size={16} color={c.error} style={{ marginRight: 8 }} />
              <Text style={[s.errorText, { color: c.error, flex: 1 }]}>{apiError}</Text>
            </View>
          ) : null}

          {/* Program title */}
          <Text style={[s.sectionLabel, { color: c.textMuted }]}>PROGRAM TITLE</Text>
          <TextInput
            value={title}
            onChangeText={(v) => { setTitle(v); setFieldErrors((p) => ({ ...p, title: "" })); }}
            placeholder="e.g. Summer Strength"
            placeholderTextColor={c.placeholder}
            style={[
              s.titleInput,
              { backgroundColor: c.inputBg, color: c.text, borderColor: fieldErrors.title ? c.error : c.border },
            ]}
          />
          {fieldErrors.title ? (
            <Text style={[s.fieldError, { color: c.error }]}>{fieldErrors.title}</Text>
          ) : null}

          {/* Date row */}
          {/*<Text style={[s.sectionLabel, { color: c.textMuted, marginTop: 20 }]}>SCHEDULE DATES</Text>*/}
          {/*<View style={s.dateRow}>*/}
          {/*  /!* Start date *!/*/}
          {/*  <View style={{ flex: 1 }}>*/}
          {/*    <TouchableOpacity*/}
          {/*        style={[*/}
          {/*          s.dateInput,*/}
          {/*          { backgroundColor: c.inputBg, borderColor: fieldErrors.start ? c.error : c.border },*/}
          {/*        ]}*/}
          {/*        onPress={() => setShowStartPicker(true)}*/}
          {/*        activeOpacity={0.7}*/}
          {/*    >*/}
          {/*      <Ionicons name="calendar-outline" size={16} color={c.textMuted} style={{ marginRight: 8 }} />*/}
          {/*      <Text style={[s.dateInputText, { color: start ? c.text : c.placeholder, flex: 1 }]}>*/}
          {/*        {start || "Start date"}*/}
          {/*      </Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*    {fieldErrors.start ? (*/}
          {/*        <Text style={[s.fieldError, { color: c.error }]}>{fieldErrors.start}</Text>*/}
          {/*    ) : null}*/}
          {/*    {showStartPicker && (*/}
          {/*        <DateTimePicker*/}
          {/*            value={start ? new Date(start) : new Date()}*/}
          {/*            mode="date"*/}
          {/*            display={Platform.OS === "ios" ? "spinner" : "default"}*/}
          {/*            onChange={onStartChange}*/}
          {/*            minimumDate={new Date()}*/}
          {/*        />*/}
          {/*    )}*/}
          {/*  </View>*/}

          {/*  /!* End date *!/*/}
          {/*  <View style={{ flex: 1 }}>*/}
          {/*    <TouchableOpacity*/}
          {/*        style={[*/}
          {/*          s.dateInput,*/}
          {/*          { backgroundColor: c.inputBg, borderColor: fieldErrors.end ? c.error : c.border },*/}
          {/*        ]}*/}
          {/*        onPress={() => setShowEndPicker(true)}*/}
          {/*        activeOpacity={0.7}*/}
          {/*    >*/}
          {/*      <Ionicons name="calendar-outline" size={16} color={c.textMuted} style={{ marginRight: 8 }} />*/}
          {/*      <Text style={[s.dateInputText, { color: end ? c.text : c.placeholder, flex: 1 }]}>*/}
          {/*        {end || "End date"}*/}
          {/*      </Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*    {fieldErrors.end ? (*/}
          {/*        <Text style={[s.fieldError, { color: c.error }]}>{fieldErrors.end}</Text>*/}
          {/*    ) : null}*/}
          {/*    {showEndPicker && (*/}
          {/*        <DateTimePicker*/}
          {/*            value={end ? new Date(end) : new Date()}*/}
          {/*            mode="date"*/}
          {/*            display={Platform.OS === "ios" ? "spinner" : "default"}*/}
          {/*            onChange={onEndChange}*/}
          {/*            minimumDate={start ? new Date(start) : new Date()}*/}
          {/*        />*/}
          {/*    )}*/}
          {/*  </View>*/}
          {/*</View>*/}
          <Text style={[s.sectionLabel, { color: c.textMuted, marginTop: 20 }]}>SCHEDULE DATES</Text>
          <View style={s.dateRow}>
            <View style={{ flex: 1 }}>
              <View style={[
                s.dateInput,
                { backgroundColor: c.inputBg, borderColor: fieldErrors.start ? c.error : c.border },
              ]}>
                <Ionicons name="calendar-outline" size={16} color={c.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  value={start}
                  onChangeText={(v) => { setStart(v); setFieldErrors((p) => ({ ...p, start: "" })); }}
                  placeholder="Start YYYY-MM-DD"
                  placeholderTextColor={c.placeholder}
                  style={[s.dateInputText, { color: c.text, flex: 1 }]}
                />
              </View>
              {fieldErrors.start ? (
                <Text style={[s.fieldError, { color: c.error }]}>{fieldErrors.start}</Text>
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <View style={[
                s.dateInput,
                { backgroundColor: c.inputBg, borderColor: fieldErrors.end ? c.error : c.border },
              ]}>
                <Ionicons name="calendar-outline" size={16} color={c.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  value={end}
                  onChangeText={(v) => { setEnd(v); setFieldErrors((p) => ({ ...p, end: "" })); }}
                  placeholder="End YYYY-MM-DD"
                  placeholderTextColor={c.placeholder}
                  style={[s.dateInputText, { color: c.text, flex: 1 }]}
                />
              </View>
              {fieldErrors.end ? (
                <Text style={[s.fieldError, { color: c.error }]}>{fieldErrors.end}</Text>
              ) : null}
            </View>
          </View>

          {/* Schedule mode */}
          <Text style={[s.sectionLabel, { color: c.textMuted, marginTop: 20 }]}>SCHEDULE MODE</Text>
          <View style={{ gap: 10 }}>
            {REPEAT_MODES.map(({ id, title: t, desc }) => {
              const sel = mode === id;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => setMode(id)}
                  style={[
                    s.modeCard,
                    {
                      backgroundColor: sel ? c.blueBg : c.surface,
                      borderColor: sel ? c.accent : c.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={sel ? "radio-button-on-outline" : "radio-button-off-outline"}
                    size={20}
                    color={sel ? c.accent : c.textMuted}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[s.modeTitle, { color: sel ? c.accent : c.text }]}>{t}</Text>
                    <Text style={[s.modeDesc, { color: c.textSecondary }]}>{desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[s.mainButton, { backgroundColor: c.accent, marginTop: 28 }]}
            onPress={mode === "INDEPENDENT" ? handleSubmit : goToTemplates}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={c.accentFg} />
            ) : (
              <Text style={[s.mainButtonText, { color: c.accentFg }]}>
                {mode === "INDEPENDENT" ? "Create Program" : "Next: Build Templates"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ─── Render: Step 2 — Template Builder ────────────────────────────────────
  const tplCount = templateCount(mode);
  const currentTpl = templates[templateIdx];
  const days = currentDays();

  return (
    <View style={[s.root, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity style={s.headerBtn} onPress={() => setStep("info")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={c.accent} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: c.text }]} numberOfLines={1}>
          {tplCount > 1 ? `${currentTpl?.label ?? ""}` : "Build your week"}
        </Text>
        <View style={s.headerBtn} />
      </View>

      {/* Template tabs for BY_WEEK_OF_MONTH */}
      {tplCount > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 10 }}
        >
          {templates.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setTemplateIdx(i)}
              style={[
                s.tabChip,
                {
                  backgroundColor: templateIdx === i ? c.accent : c.surface,
                  borderColor: templateIdx === i ? c.accent : c.border,
                },
              ]}
              activeOpacity={0.75}
            >
              <Text style={[s.tabChipText, { color: templateIdx === i ? c.accentFg : c.textSecondary }]}>
                W{i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {apiError ? (
          <View style={[s.errorBanner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
            <Ionicons name="alert-circle-outline" size={16} color={c.error} style={{ marginRight: 8 }} />
            <Text style={[s.errorText, { color: c.error, flex: 1 }]}>{apiError}</Text>
          </View>
        ) : null}

        {/* 2-column day grid */}
        <View style={s.grid}>
          {DAYS.map((day) => {
            const slots = days[day] ?? [];
            return (
              <View
                key={day}
                style={[s.dayCard, { backgroundColor: c.surface, borderColor: c.border }]}
              >
                <Text style={[s.dayLabel, { color: c.textMuted }]}>{DAY_LABELS[day]}</Text>

                {slots.length === 0 ? (
                  <TouchableOpacity
                    style={[s.emptyCell, { borderColor: c.border }]}
                    onPress={() => setModalDay(day)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add-circle-outline" size={26} color={c.textMuted} />
                  </TouchableOpacity>
                ) : (
                  <View style={{ gap: 6 }}>
                    {slots.map((slot, si) => (
                      <View
                        key={si}
                        style={[s.slotCard, { backgroundColor: c.surfaceElevated, borderColor: c.border }]}
                      >
                        <Ionicons
                          name={EXERCISE_ICONS[slot.exerciseType] as any}
                          size={14}
                          color={c.accent}
                        />
                        <View style={{ flex: 1, marginLeft: 6 }}>
                          <Text style={[s.slotType, { color: c.text }]}>{slot.exerciseType}</Text>
                          <Text style={[s.slotReps, { color: c.textMuted }]}>
                            {slot.sets}x{slot.repsPerSet}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeExercise(day, si)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="close-outline" size={16} color={c.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={[s.addMoreBtn, { borderColor: c.border }]}
                      onPress={() => setModalDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.addMoreText, { color: c.textSecondary }]}>+ Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Navigate between templates or submit */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
          {templateIdx > 0 && (
            <TouchableOpacity
              style={[s.mainButton, { flex: 1, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }]}
              onPress={() => setTemplateIdx((i) => i - 1)}
              activeOpacity={0.8}
            >
              <Text style={[s.mainButtonText, { color: c.text }]}>Previous</Text>
            </TouchableOpacity>
          )}
          {templateIdx < tplCount - 1 ? (
            <TouchableOpacity
              style={[s.mainButton, { flex: 1, backgroundColor: c.accent }]}
              onPress={() => setTemplateIdx((i) => i + 1)}
              activeOpacity={0.8}
            >
              <Text style={[s.mainButtonText, { color: c.accentFg }]}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.mainButton, { flex: 1, backgroundColor: c.accent }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={c.accentFg} />
              ) : (
                <Text style={[s.mainButtonText, { color: c.accentFg }]}>Create Program</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Add exercise modal */}
      <Modal visible={modalDay !== null} transparent animationType="slide">
        <View style={[s.modalOverlay, { backgroundColor: c.overlay }]}>
          <View style={[s.modalSheet, { backgroundColor: c.surface }]}>
            <Text style={[s.modalTitle, { color: c.text }]}>
              Add exercise{modalDay ? ` — ${DAY_LABELS[modalDay as DayOfWeek]}` : ""}
            </Text>

            {/* Exercise type chips */}
            <View style={s.exerciseGrid}>
              {EXERCISE_TYPES.map((et) => {
                const sel = pickedType === et;
                return (
                  <TouchableOpacity
                    key={et}
                    onPress={() => setPickedType(et)}
                    style={[
                      s.exChip,
                      {
                        backgroundColor: sel ? c.accent : c.background,
                        borderColor: sel ? c.accent : c.border,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={EXERCISE_ICONS[et] as any}
                      size={20}
                      color={sel ? c.accentFg : c.textSecondary}
                    />
                    <Text style={[s.exChipText, { color: sel ? c.accentFg : c.textSecondary }]}>
                      {et}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Sets & reps steppers */}
            <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
              {/* Sets */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={[s.repsLabel, { color: c.textMuted }]}>SETS</Text>
                <View style={s.repsRow}>
                  <TouchableOpacity
                    style={[s.repsBtn, { backgroundColor: c.background, borderColor: c.border }]}
                    onPress={() => setSets((v) => Math.max(1, v - 1))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color={c.textSecondary} />
                  </TouchableOpacity>
                  <Text style={[s.repsValue, { color: c.text }]}>{sets}</Text>
                  <TouchableOpacity
                    style={[s.repsBtn, { backgroundColor: c.background, borderColor: c.border }]}
                    onPress={() => setSets((v) => v + 1)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="add-circle-outline" size={24} color={c.accent} />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Reps per set */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={[s.repsLabel, { color: c.textMuted }]}>REPS / SET</Text>
                <View style={s.repsRow}>
                  <TouchableOpacity
                    style={[s.repsBtn, { backgroundColor: c.background, borderColor: c.border }]}
                    onPress={() => setRepsPerSet((v) => Math.max(1, v - 1))}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color={c.textSecondary} />
                  </TouchableOpacity>
                  <Text style={[s.repsValue, { color: c.text }]}>{repsPerSet}</Text>
                  <TouchableOpacity
                    style={[s.repsBtn, { backgroundColor: c.background, borderColor: c.border }]}
                    onPress={() => setRepsPerSet((v) => v + 1)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="add-circle-outline" size={24} color={c.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={[s.summaryHint, { color: c.textSecondary }]}>
              {sets} set{sets > 1 ? "s" : ""} x {repsPerSet} rep{repsPerSet > 1 ? "s" : ""} each
            </Text>

            {/* Modal actions */}
            <TouchableOpacity
              style={[s.mainButton, { backgroundColor: c.accent, marginTop: 20 }]}
              onPress={addExercise}
              activeOpacity={0.8}
            >
              <Text style={[s.mainButtonText, { color: c.accentFg }]}>Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.cancelBtn, { borderColor: c.border }]}
              onPress={() => setModalDay(null)}
              activeOpacity={0.7}
            >
              <Text style={[s.cancelBtnText, { color: c.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: { fontSize: 13 },

  // Form labels & inputs
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  titleInput: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "500",
    borderWidth: 1,
    marginBottom: 4,
  },
  fieldError: { fontSize: 11, marginBottom: 6 },

  // Date row
  dateRow: { flexDirection: "row", gap: 10 },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  dateInputText: { fontSize: 13 },

  // Mode cards
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  modeTitle: { fontSize: 14, fontWeight: "700" },
  modeDesc: { fontSize: 12, marginTop: 2 },

  // Buttons
  mainButton: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: { fontSize: 15, fontWeight: "700" },

  // Template tabs
  tabChip: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabChipText: { fontSize: 13, fontWeight: "700" },

  // 2-column day grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dayCard: {
    width: "47.5%",
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  emptyCell: {
    height: 64,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Slot card — flexDirection row
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 7,
    borderWidth: 1,
  },
  slotType: { fontSize: 10, fontWeight: "700" },
  slotReps: { fontSize: 9, marginTop: 1 },

  addMoreBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 6,
    paddingVertical: 5,
    alignItems: "center",
    marginTop: 2,
  },
  addMoreText: { fontSize: 11, fontWeight: "600" },

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", marginBottom: 18 },

  // Exercise type chips (modal)
  exerciseGrid: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  exChip: {
    flex: 1,
    minWidth: "22%",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  exChipText: { fontSize: 9, fontWeight: "700", textTransform: "uppercase" },

  // Steppers
  repsLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, marginBottom: 10 },
  repsRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  repsBtn: { borderRadius: 20, borderWidth: 1 },
  repsValue: { fontSize: 26, fontWeight: "800", width: 44, textAlign: "center" },

  summaryHint: { fontSize: 12, textAlign: "center", marginTop: 10 },

  cancelBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600" },
});
