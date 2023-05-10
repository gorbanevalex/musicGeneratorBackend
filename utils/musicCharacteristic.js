import { Essentia, EssentiaWASM } from "essentia.js";
import fs from "fs";
import decode from "audio-decode";

const essentia = new Essentia(EssentiaWASM);

const decodeAudio = async (filepath) => {
  const buffer = fs.readFileSync(filepath);
  const audio = await decode(buffer);
  const audioVector = essentia.arrayToVector(audio._channelData[0]);
  return audioVector;
};

export const getMusicCharacteristic = async (trackUrl) => {
  const path = `./${trackUrl}`;
  const data = await decodeAudio(path);
  //насколько песня подходит для танцев, смесь факторов как сила удара и ритм
  const computedDanceability = essentia.Danceability(data);
  //продолжительность
  const computedDuration = essentia.Duration(data);
  //интенсивность и активность
  const computedEnergy = essentia.Energy(data);
  //группа нот составляющая основу песни, тип гаммы
  const computedKeyMode = essentia.KeyExtractor(data);
  //bpm
  const computedBpm = essentia.PercivalBpmEstimator(data);
  //громкость
  const computedLoudness = essentia.DynamicComplexity(data);
  return {
    computedDanceability,
    computedDuration,
    computedEnergy,
    computedKeyMode,
    computedBpm,
    computedLoudness,
  };
};
