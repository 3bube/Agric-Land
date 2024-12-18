export const cn = (
  ...classes: (string | string[] | { [key: string]: boolean } | undefined)[]
) => {
  return classes.filter(Boolean).join(" ");
};
