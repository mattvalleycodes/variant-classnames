export default function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}
