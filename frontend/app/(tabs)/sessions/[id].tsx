import { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseIcon } from "@/components/ExerciseIcon";
import { useTheme } from "@/app/context/ThemeContext";
import { fetchSessionById, updateSessionStatus } from "@/app/shared/service/sessionApi";
import { analyzeRepVideo } from "@/app/shared/service/exerciseRepApi";
import { Session } from "@/app/shared/model/Session";
import { Exercise } from "@/app/shared/model/Exercise";
import { ExerciseRep } from "@/app/shared/model/ExerciseRep";
import { AnalysisResult, AnalysisError } from "@/app/shared/model/AnalysisResult";

// ─── Helpers ──────────────────────────────────────────────────────────────────


function avgScore(reps: ExerciseRep[]): number | null {
  const scored = reps
    .map((r) => r.analysisResult?.globalScore)
    .filter((s): s is number => typeof s === "number");
  if (!scored.length) return null;
  return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreCircle({ score, size = 38, colors }: { score: number; size?: number; colors: any }) {
  function scoreColor(n: number): string {
    if (n >= 75) return colors.success;
    if (n >= 50) return colors.warning;
    return colors.error;
  }

  return (
    <View
      style={[
        ss.scoreCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: scoreColor(score),
        },
      ]}
    >
      <Text style={[ss.scoreText, { fontSize: size < 44 ? 11 : 18 }]}>{Math.round(score)}</Text>
    </View>
  );
}

function FeedbackModal({
  result,
  onClose,
  colors,
}: {
  result: AnalysisResult;
  onClose: () => void;
  colors: any;
}) {
  const c = colors;

  function scoreColor(n: number): string {
    if (n >= 75) return c.success;
    if (n >= 50) return c.warning;
    return c.error;
  }

  return (
    <Modal visible transparent animationType="slide">
      <View style={[ss.modalOverlay, { backgroundColor: c.overlay }]}>
        <View style={[ss.modalSheet, { backgroundColor: c.surface }]}>
          {/* Modal header */}
          <View style={ss.modalHeaderRow}>
            <Text style={[ss.modalTitle, { color: c.text }]}>Analysis Result</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-outline" size={22} color={c.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Score banner */}
          <View style={[ss.scoreBanner, { backgroundColor: c.background }]}>
            <View
              style={[
                ss.scoreBig,
                { backgroundColor: scoreColor(result.globalScore) },
              ]}
            >
              <Text style={ss.scoreBigText}>{Math.round(result.globalScore)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[ss.scoreTagline, { color: c.textMuted }]}>GLOBAL SCORE</Text>
              <Text style={[ss.scoreExercise, { color: c.text }]}>
                {result.exerciseName?.toUpperCase() ?? ""}
              </Text>
              <Text style={[ss.scoreFrames, { color: c.textSecondary }]}>
                {result.framesAnalyzed} frames analyzed
              </Text>
            </View>
          </View>

          {/* Issues / perfect */}
          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            {result.errors && result.errors.length > 0 ? (
              <>
                <Text style={[ss.sectionLabel, { color: c.textMuted }]}>ISSUES DETECTED</Text>
                {result.errors.map((err: AnalysisError, i: number) => (
                  <View
                    key={i}
                    style={[ss.errorCard, { backgroundColor: c.background, borderLeftColor: c.error }]}
                  >
                    <View style={ss.errorTop}>
                      <Text style={[ss.errorJoint, { color: c.text }]}>
                        {err.joint.replace(/_/g, " ")}
                      </Text>
                      <View style={[ss.occurrenceBadge, { backgroundColor: c.errorBg }]}>
                        <Text style={[ss.occurrenceText, { color: c.error }]}>
                          {err.occurrences}x detected
                        </Text>
                      </View>
                    </View>
                    <Text style={[ss.errorMessage, { color: c.warning }]}>{err.message}</Text>
                    <View style={ss.angleRow}>
                      <Text style={[ss.angleLabel, { color: c.textMuted }]}>
                        Avg:{" "}
                        <Text style={[ss.angleVal, { color: c.text }]}>
                          {err.avgAngle?.toFixed(1)}
                        </Text>
                      </Text>
                      <Text style={[ss.angleLabel, { color: c.textMuted }]}>
                        Worst:{" "}
                        <Text style={[ss.angleVal, { color: c.text }]}>
                          {err.worstAngle?.toFixed(1)}
                        </Text>
                      </Text>
                      <Text style={[ss.angleLabel, { color: c.textMuted }]}>
                        Range:{" "}
                        <Text style={[ss.angleVal, { color: c.text }]}>
                          [{err.range?.[0]}–{err.range?.[1]}]
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={[ss.perfectCard, { backgroundColor: c.successBg }]}>
                <Ionicons name="checkmark-circle-outline" size={22} color={c.success} style={{ marginBottom: 4 }} />
                <Text style={[ss.perfectText, { color: c.success }]}>
                  Perfect form. No issues detected.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Close button */}
          <TouchableOpacity
            style={[ss.closeBtn, { backgroundColor: c.surfaceElevated, borderColor: c.border }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[ss.closeBtnText, { color: c.text }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SessionDetail() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  const [session,      setSession]      = useState<Session | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [expandedEx,   setExpandedEx]   = useState<number | null>(null);
  const [uploadingRep, setUploadingRep] = useState<Record<number, boolean>>({});
  const [viewingResult, setViewingResult] = useState<AnalysisResult | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSessionById(Number(id));
      setSession(data);
      if (data.exercises?.length) setExpandedEx(data.exercises[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(rep: ExerciseRep, expectedType: string) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];

      // Web: expo-document-picker gives a real File object in asset.file
      // Native: use the RN file reference { uri, name, type }
      const file: File | { uri: string; name: string; type: string } =
        (asset as any).file ??
        { uri: asset.uri, name: asset.name ?? "video.mp4", type: asset.mimeType ?? "video/mp4" };

      setUploadingRep((prev) => ({ ...prev, [rep.id]: true }));

      if (session?.status === "PLANNED") {
        const updated = await updateSessionStatus(session.id, "IN_PROGRESS");
        setSession((prev) => prev ? { ...prev, status: updated.status } : prev);
      }

      const updated = await analyzeRepVideo(rep.id, file);

      const detected = updated.analysisResult?.exerciseName?.toUpperCase().trim();
      if (detected && detected !== expectedType) {
        Alert.alert(
          "Wrong exercise detected",
          `The AI identified "${detected}" in your video, but this set requires "${expectedType}". Please record the correct exercise and try again.`
        );
        return;
      }

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          exercises: prev.exercises.map((ex) => ({
            ...ex,
            reps: ex.reps.map((r) => (r.id === rep.id ? updated : r)),
          })),
        };
      });
    } catch (err) {
      Alert.alert("Upload failed", err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setUploadingRep((prev) => ({ ...prev, [rep.id]: false }));
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[ss.root, ss.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.accent} />
        <Text style={[ss.loadingText, { color: c.textMuted }]}>Loading session</Text>
      </View>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !session) {
    return (
      <View style={[ss.root, ss.centered, { backgroundColor: c.background }]}>
        <Ionicons name="alert-circle-outline" size={36} color={c.error} style={{ marginBottom: 12 }} />
        <Text style={[ss.errText, { color: c.error }]}>{error ?? "Session not found."}</Text>
        <TouchableOpacity
          style={[ss.retryBtn, { borderColor: c.accent }]}
          onPress={load}
          activeOpacity={0.8}
        >
          <Text style={[ss.retryBtnText, { color: c.accent }]}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={[ss.backLink, { color: c.textSecondary }]}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const allDone = session.exercises?.every((ex) =>
    ex.reps?.every((r) => r.analysisResult !== null)
  ) ?? false;

  const dateLabel = session.scheduledDate
    ? new Date(session.scheduledDate).toLocaleDateString("en-US", {
        weekday: "long", month: "short", day: "numeric",
      })
    : session.dayOfWeek;

  const isCompleted = session.status === "COMPLETED";

  function statusColor(): string {
    if (isCompleted) return c.success;
    if (session?.status === "IN_PROGRESS") return c.blue;
    return c.textMuted;
  }
  function statusBg(): string {
    if (isCompleted) return c.successBg;
    if (session?.status === "IN_PROGRESS") return c.blueBg;
    return c.surface;
  }
  function statusLabel(): string {
    if (isCompleted) return "Completed";
    if (session?.status === "IN_PROGRESS") return "In Progress";
    return session?.status?.replace(/_/g, " ") ?? "Planned";
  }

  return (
    <View style={[ss.root, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[ss.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={c.accent} />
        </TouchableOpacity>
        <Text style={[ss.headerTitle, { color: c.text }]} numberOfLines={1}>
          {dateLabel}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Session meta row */}
        <View style={ss.sessionMeta}>
          <Text style={[ss.sessionDay, { color: c.text }]}>
            {session.dayOfWeek?.replace(/_/g, " ")}
          </Text>
          <View style={[ss.badge, { backgroundColor: statusBg() }]}>
            <Text style={[ss.badgeText, { color: statusColor() }]}>{statusLabel()}</Text>
          </View>
        </View>

        {/* Exercise cards */}
        <View style={{ gap: 12 }}>
          {(session.exercises ?? []).map((ex: Exercise) => {
            const open   = expandedEx === ex.id;
            const exAvg  = avgScore(ex.reps ?? []);
            return (
              <View key={ex.id} style={[ss.exCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                {/* Exercise accordion header */}
                <TouchableOpacity
                  style={ss.exHeader}
                  onPress={() => setExpandedEx(open ? null : ex.id)}
                  activeOpacity={0.75}
                >
                  <View style={[ss.exIconBox, { backgroundColor: c.surfaceElevated }]}>
                    <ExerciseIcon type={ex.exerciseType} size={20} color={c.accent} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[ss.exName, { color: c.text }]}>{ex.exerciseType}</Text>
                    <Text style={[ss.exPlan, { color: c.textMuted }]}>
                      {ex.plannedSets} sets x {ex.plannedRepsPerSet} reps
                    </Text>
                  </View>
                  {exAvg !== null ? (
                    <ScoreCircle score={exAvg} size={38} colors={c} />
                  ) : (
                    <Ionicons
                      name={open ? "chevron-up-outline" : "chevron-down-outline"}
                      size={18}
                      color={c.textMuted}
                    />
                  )}
                </TouchableOpacity>

                {/* Expanded rep list */}
                {open && (
                  <View style={[ss.repsList, { borderTopColor: c.border }]}>
                    {(ex.reps ?? []).map((rep: ExerciseRep) => {
                      const analyzed  = !!rep.analysisResult;
                      const uploading = uploadingRep[rep.id];
                      const score     = rep.analysisResult?.globalScore;

                      return (
                        <View
                          key={rep.id}
                          style={[ss.repRow, { borderTopColor: c.background }]}
                        >
                          {/* Set label */}
                          <View style={ss.repLabelCol}>
                            <Text style={[ss.repNumber, { color: c.text }]}>
                              Set {rep.repNumber}
                            </Text>
                            <Text style={[ss.repReps, { color: c.textMuted }]}>
                              {ex.plannedRepsPerSet} reps
                            </Text>
                          </View>

                          {/* Actions */}
                          <View style={ss.repActions}>
                            {analyzed ? (
                              <>
                                <ScoreCircle score={score!} size={36} colors={c} />
                                <TouchableOpacity
                                  style={[ss.detailsBtn, { borderColor: c.accent }]}
                                  onPress={() => setViewingResult(rep.analysisResult!)}
                                  activeOpacity={0.8}
                                >
                                  <Text style={[ss.detailsBtnText, { color: c.accent }]}>
                                    Details
                                  </Text>
                                </TouchableOpacity>
                              </>
                            ) : uploading ? (
                              <View style={ss.uploadingBox}>
                                <ActivityIndicator size="small" color={c.accent} />
                                <Text style={[ss.uploadingText, { color: c.textMuted }]}>
                                  Analyzing
                                </Text>
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={[ss.uploadBtn, { backgroundColor: c.blueBg, borderColor: c.blue }]}
                                onPress={() => handleUpload(rep, ex.exerciseType)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="cloud-upload-outline" size={14} color={c.blue} style={{ marginRight: 5 }} />
                                <Text style={[ss.uploadBtnText, { color: c.blue }]}>
                                  Upload video
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Complete session button */}
        <TouchableOpacity
          style={[
            ss.mainBtn,
            {
              backgroundColor: isCompleted
                ? c.successBg
                : allDone
                ? c.success
                : c.surfaceElevated,
              marginTop: 28,
            },
          ]}
          activeOpacity={isCompleted ? 1 : 0.8}
          onPress={async () => {
            if (isCompleted) return;
            if (!allDone) {
              Alert.alert(
                "Not complete",
                "Upload and analyze all sets before completing the session."
              );
              return;
            }
            try {
              await updateSessionStatus(session.id, "COMPLETED");
              setSession((prev) => prev ? { ...prev, status: "COMPLETED" } : prev);
              Alert.alert(
                "Session Complete",
                "Great work! Your session has been recorded.",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } catch {
              Alert.alert("Error", "Could not save session status. Please try again.");
            }
          }}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : allDone ? "checkmark-circle-outline" : "play-outline"}
            size={18}
            color={isCompleted ? c.success : allDone ? "#fff" : c.textMuted}
            style={{ marginRight: 8 }}
          />
          <Text style={[ss.mainBtnText, { color: isCompleted ? c.success : allDone ? "#fff" : c.textMuted }]}>
            {isCompleted ? "Session Complete" : allDone ? "Complete Session" : "Start Session"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Analysis feedback modal */}
      {viewingResult && (
        <FeedbackModal
          result={viewingResult}
          onClose={() => setViewingResult(null)}
          colors={c}
        />
      )}
    </View>
  );
}

const ss = StyleSheet.create({
  root:    { flex: 1 },
  centered: { alignItems: "center", justifyContent: "center", flex: 1 },

  loadingText: { marginTop: 14, fontSize: 14 },
  errText:     { fontSize: 14, textAlign: "center", marginHorizontal: 32, fontWeight: "600", marginBottom: 4 },
  retryBtn:    { marginTop: 16, borderWidth: 1, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  retryBtnText: { fontWeight: "600", fontSize: 14 },
  backLink:    { fontSize: 13 },

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
  headerTitle: { fontSize: 15, fontWeight: "700", flex: 1, textAlign: "center", marginHorizontal: 8 },

  // Session meta
  sessionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sessionDay: { fontSize: 16, fontWeight: "700" },
  badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },

  // Exercise card
  exCard: { borderRadius: 16, overflow: "hidden", borderWidth: 1 },
  exHeader: { flexDirection: "row", alignItems: "center", padding: 14 },
  exIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exName: { fontSize: 14, fontWeight: "700" },
  exPlan: { fontSize: 11, marginTop: 2 },

  // Reps list
  repsList: { borderTopWidth: StyleSheet.hairlineWidth },
  repRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  repLabelCol: { flex: 1 },
  repNumber: { fontSize: 13, fontWeight: "700" },
  repReps:   { fontSize: 11, marginTop: 2 },
  repActions: { flexDirection: "row", alignItems: "center", gap: 8 },

  // Score circle
  scoreCircle: { alignItems: "center", justifyContent: "center" },
  scoreText:   { color: "#fff", fontWeight: "800" },

  // Action buttons
  detailsBtn: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailsBtnText: { fontSize: 11, fontWeight: "600" },

  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
  },
  uploadBtnText: { fontSize: 12, fontWeight: "600" },

  uploadingBox: { flexDirection: "row", alignItems: "center", gap: 7 },
  uploadingText: { fontSize: 11 },

  // Main CTA button
  mainBtn: {
    height: 54,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mainBtnText: { fontSize: 15, fontWeight: "700" },

  // Feedback modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "88%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: { fontSize: 17, fontWeight: "700" },

  // Score banner
  scoreBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  scoreBig: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBigText: { color: "#fff", fontWeight: "800", fontSize: 20 },
  scoreTagline: { fontSize: 10, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },
  scoreExercise: { fontSize: 14, fontWeight: "700", marginTop: 2 },
  scoreFrames:   { fontSize: 11, marginTop: 2 },

  // Issues section
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  errorCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  errorTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  errorJoint:   { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  occurrenceBadge: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  occurrenceText:  { fontSize: 10, fontWeight: "600" },
  errorMessage: { fontSize: 12, marginBottom: 6 },
  angleRow:     { flexDirection: "row", gap: 14 },
  angleLabel:   { fontSize: 10 },
  angleVal:     { fontWeight: "600" },

  perfectCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  perfectText: { fontWeight: "700", fontSize: 14 },

  closeBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { fontWeight: "600", fontSize: 14 },
});
