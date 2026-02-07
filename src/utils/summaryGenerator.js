module.exports = (content) => {
  return content.length > 150 ? content.substring(0, 150) + "..." : content;
};
