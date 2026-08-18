import { onMounted, ref } from "vue";

export function useTypewriter(
  fullText: string,
  options: { charDelay?: number; startDelay?: number } = {},
) {
  const { charDelay = 50, startDelay = 300 } = options;

  const displayText = ref("");
  const typing = ref(false);
  const done = ref(false);

  onMounted(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      displayText.value = fullText;
      done.value = true;
      return;
    }

    typing.value = true;
    let index = 0;

    function typeNextChar() {
      index++;
      displayText.value = fullText.slice(0, index);
      if (index < fullText.length) {
        setTimeout(typeNextChar, charDelay);
      } else {
        typing.value = false;
        done.value = true;
      }
    }

    setTimeout(typeNextChar, startDelay);
  });

  return { displayText, typing, done };
}
