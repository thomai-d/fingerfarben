export const say = (text: string) => {
  const u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'de';
  window.speechSynthesis?.cancel();
  window.speechSynthesis?.speak(u);
};
