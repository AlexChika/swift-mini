export const getRandomVibrantHexColor = (): string => {
  const isGrayish = (r: number, g: number, b: number) => {
    const diff1 = Math.abs(r - g);
    const diff2 = Math.abs(r - b);
    const diff3 = Math.abs(g - b);
    return diff1 < 20 && diff2 < 20 && diff3 < 20;
  };

  let r = 0,
    g = 0,
    b = 0;

  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (
    r + g + b > 720 || // Too close to white
    r + g + b < 60 || // Too close to black
    isGrayish(r, g, b) // Too gray
  );

  // converts rgb to hex... copied online
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
