function merge(
  base: Record<string, object>,
  ...items: Record<string, object>[]
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]; //item is an object;
    const inValidInput =
      typeof item !== "object" || Array.isArray(item) || item === null;

    if (inValidInput) continue;
    Object.keys(item).forEach((key) => {
      base[key] = { ...base[key], ...item[key] };
    });
  }

  return base;
}

export default merge;
