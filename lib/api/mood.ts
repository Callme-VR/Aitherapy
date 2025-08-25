
interface MOodEntry {
  score: number;
  note?: string;
}
export async function trackMood(
  data: MOodEntry
): Promise<{ success: boolean; data: any }> {
  const tokon = localStorage.getItem("token");
  if (!tokon) throw new Error("NOT authetication");

  const response = await fetch("/api/mood", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${tokon}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to track mood");
  }

  return response.json();
}
