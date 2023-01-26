export const copyToClipboard = (elementId) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const tagName = el.tagName.toLowerCase();
  const isInput = tagName === "input";

  if (isInput) {
    el.select();
    document.execCommand("copy");
  } else {
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
};
