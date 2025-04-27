export const formatStyle = (style: String | Number) => {
  if (!isNaN(Number(style))) {
    return style + "px";
  }
  return style;
};
