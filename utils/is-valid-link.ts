export const isValidLink = (url: string) => {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.includes("base64,")
  );
};
