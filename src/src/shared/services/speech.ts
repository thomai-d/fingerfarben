import { getConfig } from '../../config';

export const say = (text: string) => {
  if (!getConfig('enableSound')) return;

  window.speechSynthesis?.cancel();

  const u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'de';
  window.speechSynthesis?.speak(u);
};
