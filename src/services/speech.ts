export const say = (text: string) => {
  window.speechSynthesis?.cancel();

  const u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'de';
  window.speechSynthesis?.speak(u);
};
