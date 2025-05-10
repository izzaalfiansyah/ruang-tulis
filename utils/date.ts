export const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
