import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  type: string;
  size: number;
  color: string;
  outline?: boolean;
};

export function ExerciseIcon({ type, size, color, outline = false }: Props) {
  switch (type) {
    case "BICEP":
      return (
        <MaterialCommunityIcons
          name={outline ? "arm-flex-outline" : "arm-flex"}
          size={size}
          color={color}
        />
      );
    case "PLANK":
      return (
        <MaterialCommunityIcons name="yoga" size={size} color={color} />
      );
    case "SQUAT":
      return (
        <Ionicons
          name={outline ? "barbell-outline" : "barbell"}
          size={size}
          color={color}
        />
      );
    case "PUSHUP":
      return (
        <Ionicons
          name={outline ? "body-outline" : "body"}
          size={size}
          color={color}
        />
      );
    default:
      return (
        <Ionicons
          name={outline ? "walk-outline" : "walk"}
          size={size}
          color={color}
        />
      );
  }
}
