export const capitalizeWithExceptions = (text, exceptions = []) => {
  if (!text) return "";

  const defaultExceptions = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "by",
    "from",
    "in",
    "of",
    "with",
    "ve",
    "veya",
  ];

  const allExceptions = [...defaultExceptions, ...exceptions];

  const words = text.toLowerCase().split(" ");

  return words
    .map((word, index) => {
      if (index === 0 || !allExceptions.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeEachWord = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
