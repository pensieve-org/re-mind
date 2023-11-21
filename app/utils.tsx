export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  // Convert the hex color to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Calculate the brightness of the color
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);

  // If the color is too light (close to white), generate a new color
  if (brightness > 200) {
    return getRandomColor();
  }

  return color;
};
