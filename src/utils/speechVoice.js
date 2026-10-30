/**
 * Web Speech Recognition & Synthesis Utility
 * Powers next-gen voice search and spoken meteorological audio briefing.
 */

// Voice Recognition
export const initSpeechRecognition = () => {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    return recognition;
  } catch {
    return null;
  }
};

// Clean speech transcript to extract city query
export const cleanVoiceTranscript = (text) => {
  if (!text) return '';
  let cleaned = text.toLowerCase().trim();

  // Remove filler prefixes
  const fillers = [
    'what is the weather in',
    'weather in',
    'how is the weather in',
    'what is the temperature in',
    'temperature in',
    'show me',
    'tell me weather of',
    'check weather of',
    'forecast for',
    'weather of',
    'weather'
  ];

  for (const filler of fillers) {
    if (cleaned.startsWith(filler)) {
      cleaned = cleaned.replace(filler, '').trim();
      break;
    }
  }

  // Capitalize words
  return cleaned
    .replace(/[?.!]/g, '')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

// Spoken Audio Briefing (Text-To-Speech)
export const speakWeatherBriefing = (weather, unit = 'C', onEnd = null) => {
  if (!window.speechSynthesis || !weather?.current || !weather?.location) return false;

  try {
    window.speechSynthesis.cancel(); // stop any ongoing speech

    const { location, current } = weather;
    const tempText = `${current.tempC} degrees Celsius`;
    const feelsLikeText = `${current.feelsLikeC} degrees`;

    const speechText = `Good day! In ${location.name}, it is currently ${tempText} with ${current.condition}. ` +
      `It feels like ${feelsLikeText}. ` +
      `Humidity is at ${current.humidity} percent, with wind speed of ${current.windSpeedKmh} kilometers per hour. ` +
      `${current.uvIndex >= 6 ? 'UV radiation is high, sun protection is advised.' : 'UV exposure is moderate.'} ` +
      `Have a wonderful day!`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
};

export const stopSpeechBriefing = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

