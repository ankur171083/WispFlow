import asyncio
import os
import sys
import json
import edge_tts
import imageio_ffmpeg
import subprocess

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

SCRIPT_DATA = [
    # Scene 1: सुंदरपुर गाँव की सुबह (Morning in village, Ramu's hard work)
    {
        "scene_id": 1,
        "title": "सुंदरपुर गाँव की सुबह",
        "bg_type": "village_morning",
        "dialogues": [
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-3%",
                "pitch": "+0Hz",
                "text": "सुंदरपुर गाँव में रामू नाम का एक सीधा-साधा और मेहनती किसान रहता था। वह भोर होते ही अपने खेतों में पसीना बहाने निकल पड़ता था।"
            },
            {
                "speaker": "रामू",
                "char_key": "ramu",
                "voice": "hi-IN-MadhurNeural",
                "rate": "+2%",
                "pitch": "+8Hz",
                "text": "हे भगवान! इस बार अगर फसल अच्छी हो गई, तो बूढ़ी माँ का इलाज करा सकूँ और घर का कर्ज़ भी चुका दूँ।"
            }
        ]
    },
    # Scene 2: आलसी बहू राधा की दिनचर्या (Inside hut, Radha waking up late)
    {
        "scene_id": 2,
        "title": "आलसी बहू राधा की दिनचर्या",
        "bg_type": "hut_interior",
        "dialogues": [
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-3%",
                "pitch": "+0Hz",
                "text": "लेकिन रामू की पत्नी राधा बहुत आलसी थी। जब पूरा गाँव काम में जुट जाता, तब वह अंगड़ाई लेकर सोकर उठती थी।"
            },
            {
                "speaker": "राधा",
                "char_key": "radha",
                "voice": "hi-IN-SwaraNeural",
                "rate": "-2%",
                "pitch": "+4Hz",
                "text": "उफ़! इतनी सुबह उठने की क्या जल्दी है? रामू तो खेत पर चला ही गया है, मैं थोड़ी देर और सो लेती हूँ।"
            }
        ]
    },
    # Scene 3: सास की सीख और राधा के बहाने (Hut courtyard, mother-in-law talking to Radha)
    {
        "scene_id": 3,
        "title": "सास की सीख और राधा के बहाने",
        "bg_type": "courtyard",
        "dialogues": [
            {
                "speaker": "माँ जी",
                "char_key": "mother",
                "voice": "hi-IN-SwaraNeural",
                "rate": "-8%",
                "pitch": "-22Hz",
                "text": "बहू, दोपहर होने को आई। रामू सुबह से भूखा-प्यासा खेत में हल चला रहा है। कम से कम उसके लिए रोटियाँ तो बना दो।"
            },
            {
                "speaker": "राधा",
                "char_key": "radha",
                "voice": "hi-IN-SwaraNeural",
                "rate": "+2%",
                "pitch": "+6Hz",
                "text": "माँ जी! आज मेरे सिर में बहुत दर्द है। मुझसे चूल्हा नहीं जलाया जाएगा। रामू खुद आकर कुछ खा लेगा।"
            }
        ]
    },
    # Scene 4: खेत में संकट और किसान का दर्द (Scorching sun, sudden storm approaching)
    {
        "scene_id": 4,
        "title": "खेत में संकट और किसान का दर्द",
        "bg_type": "field_storm",
        "dialogues": [
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-2%",
                "pitch": "+0Hz",
                "text": "चिलचिलाती धूप में रामू बिना खाए-पिए जुताई करता रहा। तभी आसमान में काले बादल घिर आए और आंधी चलने लगी।"
            },
            {
                "speaker": "रामू",
                "char_key": "ramu",
                "voice": "hi-IN-MadhurNeural",
                "rate": "+4%",
                "pitch": "+6Hz",
                "text": "अगर बारिश से पहले क्यारी नहीं बांधी, तो सारी फसल बह जाएगी! पर भूख और थकान से मेरे हाथ-पैर कांप रहे हैं..."
            }
        ]
    },
    # Scene 5: राधा का पश्चाताप और हृदय परिवर्तन (Radha seeing Ramu from window)
    {
        "scene_id": 5,
        "title": "राधा का पश्चाताप",
        "bg_type": "hut_window",
        "dialogues": [
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-3%",
                "pitch": "+0Hz",
                "text": "आंधी की गड़गड़ाहट सुनकर राधा ने बाहर झांका। रामू को लड़खड़ाते देखा, तो उसके दिल को गहरी चोट लगी।"
            },
            {
                "speaker": "राधा",
                "char_key": "radha",
                "voice": "hi-IN-SwaraNeural",
                "rate": "+0%",
                "pitch": "+2Hz",
                "text": "हाय भगवान! मैंने कितना बड़ा पाप किया! मेरे पति हमारे लिए धूप में पसीना बहा रहे हैं और मैं यहाँ बहाने बना रही थी!"
            }
        ]
    },
    # Scene 6: मिलकर मेहनत और खुशहाल परिवार (Radha running to field, happy golden harvest)
    {
        "scene_id": 6,
        "title": "मेहनत का फल और खुशहाल परिवार",
        "bg_type": "golden_harvest",
        "dialogues": [
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-2%",
                "pitch": "+0Hz",
                "text": "राधा तुरंत भोजन और छाछ लेकर खेत दौड़ी और रामू के साथ काम में जुट गई। दोनों ने मिलकर सारी क्यारियां सुरक्षित कर लीं।"
            },
            {
                "speaker": "रामू",
                "char_key": "ramu",
                "voice": "hi-IN-MadhurNeural",
                "rate": "+2%",
                "pitch": "+6Hz",
                "text": "राधा! आज तुम्हारे साथ और हौसले ने हमारी साल भर की मेहनत और इस परिवार को बचा लिया!"
            },
            {
                "speaker": "राधा",
                "char_key": "radha",
                "voice": "hi-IN-SwaraNeural",
                "rate": "+0%",
                "pitch": "+4Hz",
                "text": "रामू, अब मैं समझ गई हूँ। सच्चा सुख आलस में नहीं, बल्कि साथ मिलकर मेहनत करने में है।"
            },
            {
                "speaker": "सूत्रधार",
                "char_key": "narrator",
                "voice": "hi-IN-MadhurNeural",
                "rate": "-6%",
                "pitch": "-2Hz",
                "text": "शिक्षा: परिवार की असली ताकत एकता और मेहनत है। जहाँ मिलकर प्रयास किया जाए, वहाँ बंजर धरती भी सोना उगलती है।"
            }
        ]
    }
]

def get_audio_duration(file_path):
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg_exe, "-i", file_path]
    res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
    for line in res.stderr.splitlines():
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 3.0

async def generate_all_audio():
    os.makedirs("video_project/audio", exist_ok=True)
    manifest = []
    total_audio_time = 0.0

    print("Generating Hindi dialogue audio tracks with edge-tts...")
    
    for s_idx, scene in enumerate(SCRIPT_DATA):
        scene_manifest = {
            "scene_id": scene["scene_id"],
            "title": scene["title"],
            "bg_type": scene["bg_type"],
            "dialogues": []
        }
        
        for d_idx, d in enumerate(scene["dialogues"]):
            filename = f"scene_{scene['scene_id']}_d_{d_idx}_{d['char_key']}.mp3"
            filepath = os.path.join("video_project/audio", filename)
            
            communicate = edge_tts.Communicate(
                text=d["text"],
                voice=d["voice"],
                rate=d["rate"],
                pitch=d["pitch"]
            )
            await communicate.save(filepath)
            
            dur = get_audio_duration(filepath)
            total_audio_time += dur
            
            print(f"Scene {scene['scene_id']} - {d['char_key']}: {dur:.2f}s -> {filename}")
            
            scene_manifest["dialogues"].append({
                "speaker": d["speaker"],
                "char_key": d["char_key"],
                "text": d["text"],
                "file": filepath,
                "duration": dur
            })
            
        manifest.append(scene_manifest)
        
    manifest_path = "video_project/audio/manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print(f"\nAll dialogue audio files generated! Total spoken audio duration: {total_audio_time:.2f} seconds.")

if __name__ == "__main__":
    asyncio.run(generate_all_audio())
