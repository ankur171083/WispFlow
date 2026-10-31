import json
import math
import os
import wave
import struct
import numpy as np
import imageio_ffmpeg
import subprocess

SAMPLE_RATE = 44100

def generate_tone(freq, duration, sample_rate=SAMPLE_RATE, wave_type='sine'):
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    if wave_type == 'sine':
        return np.sin(2 * np.pi * freq * t)
    elif wave_type == 'flute':
        # Indian Bansuri approximation: warm fundamental + rich 2nd, 3rd harmonics + breath noise
        sig = 1.0 * np.sin(2 * np.pi * freq * t)
        sig += 0.45 * np.sin(2 * np.pi * (2 * freq) * t)
        sig += 0.20 * np.sin(2 * np.pi * (3 * freq) * t)
        sig += 0.08 * np.sin(2 * np.pi * (4 * freq) * t)
        # soft breath air noise
        noise = np.random.normal(0, 0.03, len(t))
        return sig + noise
    elif wave_type == 'tanpura':
        # Rich drone string
        sig = np.sin(2 * np.pi * freq * t)
        for h in [2, 3, 4, 5, 6]:
            sig += (1.0 / h) * np.sin(2 * np.pi * (h * freq) * t)
        return sig
    return np.zeros(int(sample_rate * duration))

def apply_envelope(signal, attack=0.08, release=0.15, sample_rate=SAMPLE_RATE):
    n = len(signal)
    env = np.ones(n)
    n_att = int(attack * sample_rate)
    n_rel = int(release * sample_rate)
    if n_att > 0 and n_att < n:
        env[:n_att] = np.linspace(0, 1, n_att)
    if n_rel > 0 and n_rel < n:
        env[-n_rel:] = np.linspace(1, 0, n_rel)
    return signal * env

def synthesize_bgm_track(total_duration, sample_rate=SAMPLE_RATE):
    print("Synthesizing authentic Indian background score (Tanpura + Bansuri + Folk beats + Storm SFX)...")
    total_samples = int(total_duration * sample_rate)
    left_channel = np.zeros(total_samples, dtype=np.float32)
    right_channel = np.zeros(total_samples, dtype=np.float32)

    t = np.linspace(0, total_duration, total_samples, False)

    # 1. Tanpura Drone (Sa = 146.83 Hz [D3], Pa = 220 Hz [A3])
    drone_sa = generate_tone(146.83, total_duration, wave_type='tanpura') * 0.08
    drone_pa = generate_tone(220.00, total_duration, wave_type='tanpura') * 0.06
    drone_sa_high = generate_tone(293.66, total_duration, wave_type='tanpura') * 0.04
    
    # Gentle drone slow pulsating swell
    drone_swell = 0.8 + 0.2 * np.sin(2 * np.pi * 0.15 * t)
    drone_mix = (drone_sa + drone_pa + drone_sa_high) * drone_swell

    left_channel += drone_mix * 0.95
    right_channel += drone_mix * 1.05

    # 2. Scene-based melodies and acoustic moods
    # Raag Bhupali notes in D: D (293.66), E (329.63), F# (369.99), A (440.00), B (493.88), D5 (587.33)
    notes_bhupali = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33]

    # Morning Flute phrases (0s to 50s)
    melody_times = [
        (1.0, [293.66, 329.63, 369.99, 440.00, 369.99]),
        (8.0, [440.00, 493.88, 587.33, 493.88, 440.00]),
        (15.0, [369.99, 440.00, 329.63, 293.66]),
        (24.0, [293.66, 369.99, 440.00, 369.99]),
        (35.0, [440.00, 369.99, 329.63, 293.66]),
        (48.0, [329.63, 369.99, 440.00, 493.88])
    ]
    for start_t, note_seq in melody_times:
        cur_t = start_t
        for pitch in note_seq:
            dur = 0.9
            sig = generate_tone(pitch, dur, wave_type='flute')
            sig = apply_envelope(sig, attack=0.15, release=0.25) * 0.15
            idx = int(cur_t * sample_rate)
            if idx + len(sig) < total_samples:
                left_channel[idx:idx+len(sig)] += sig * 0.8
                right_channel[idx:idx+len(sig)] += sig * 1.0
            cur_t += dur * 0.85

    # Morning birds chirping (0s to 45s)
    for chirp_t in [2.5, 6.0, 11.2, 18.0, 26.5, 33.0, 42.0]:
        c_dur = 0.25
        t_c = np.linspace(0, c_dur, int(sample_rate * c_dur), False)
        # Chirp frequency sweep: 2800Hz -> 4200Hz -> 3100Hz
        f_sweep = 2800 + 1400 * np.sin(np.pi * t_c / c_dur)
        chirp = np.sin(2 * np.pi * f_sweep * t_c) * np.linspace(0, 1, len(t_c)) * np.linspace(1, 0, len(t_c)) * 0.05
        idx = int(chirp_t * sample_rate)
        if idx + len(chirp) < total_samples:
            left_channel[idx:idx+len(chirp)] += chirp
            right_channel[idx:idx+len(chirp)] += chirp * 0.7

    # Scene 4: Storm wind & thunder rumble (70s to 93s)
    storm_start = 70.0
    storm_dur = 23.0
    t_s = np.linspace(0, storm_dur, int(sample_rate * storm_dur), False)
    # Wind howling low-frequency filtered noise
    wind_noise = np.random.normal(0, 0.15, len(t_s))
    # Low frequency modulation (wind gusts)
    gusts = (0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t_s)) * np.sin(2 * np.pi * 55 * t_s)
    wind = wind_noise * (0.6 + 0.4 * gusts) * 0.25
    # Thunder rumble at 74s and 83s
    for th_offset in [3.0, 12.0]:
        th_dur = 3.5
        t_th = np.linspace(0, th_dur, int(sample_rate * th_dur), False)
        th_sig = np.sin(2 * np.pi * 42 * t_th) * np.exp(-t_th * 1.1) * np.random.normal(0.8, 0.3, len(t_th)) * 0.35
        th_idx = int(th_offset * sample_rate)
        if th_idx + len(th_sig) < len(wind):
            wind[th_idx:th_idx+len(th_sig)] += th_sig

    idx_storm = int(storm_start * sample_rate)
    if idx_storm + len(wind) < total_samples:
        left_channel[idx_storm:idx_storm+len(wind)] += wind
        right_channel[idx_storm:idx_storm+len(wind)] += wind

    # Scene 5: Realization emotional cello-like warm chord (93s to 115s)
    real_start = 93.0
    real_dur = 22.0
    t_r = np.linspace(0, real_dur, int(sample_rate * real_dur), False)
    # Minor/emotional chord Dm (D, F, A)
    chord = (np.sin(2 * np.pi * 146.83 * t_r) + 
             0.8 * np.sin(2 * np.pi * 174.61 * t_r) + 
             0.7 * np.sin(2 * np.pi * 220.00 * t_r)) * 0.10 * np.sin(np.pi * t_r / real_dur)
    idx_real = int(real_start * sample_rate)
    if idx_real + len(chord) < total_samples:
        left_channel[idx_real:idx_real+len(chord)] += chord
        right_channel[idx_real:idx_real+len(chord)] += chord

    # Scene 6: Celebratory folk rhythm and flute resolution (116s to end)
    fest_start = 116.0
    fest_dur = total_duration - fest_start
    t_f = np.linspace(0, fest_dur, int(sample_rate * fest_dur), False)
    
    # Folk Dholak / rhythm beat pulses (every 0.5s = 120 bpm)
    beat_step = int(0.5 * sample_rate)
    for b_i in range(0, int(fest_dur * sample_rate), beat_step):
        # Bass thud (Dholak Ge)
        b_len = int(0.18 * sample_rate)
        if b_i + b_len < len(t_f):
            t_b = np.linspace(0, 0.18, b_len, False)
            thud = np.sin(2 * np.pi * 65 * np.exp(-t_b * 12) * t_b) * np.exp(-t_b * 15) * 0.22
            idx_b = int(fest_start * sample_rate) + b_i
            if idx_b + b_len < total_samples:
                left_channel[idx_b:idx_b+b_len] += thud
                right_channel[idx_b:idx_b+b_len] += thud
        # Treble slap (Dholak Ta) on offbeats
        if b_i + int(0.25 * sample_rate) + int(0.08 * sample_rate) < len(t_f):
            t_s = np.linspace(0, 0.08, int(0.08 * sample_rate), False)
            slap = np.random.normal(0, 0.12, len(t_s)) * np.exp(-t_s * 40)
            idx_s = int(fest_start * sample_rate) + b_i + int(0.25 * sample_rate)
            if idx_s + len(slap) < total_samples:
                left_channel[idx_s:idx_s+len(slap)] += slap * 0.7
                right_channel[idx_s:idx_s+len(slap)] += slap * 0.9

    # Happy ending flute fanfare in Scene 6
    fest_flute = [
        (117.0, [293.66, 369.99, 440.00, 587.33]),
        (124.0, [587.33, 493.88, 440.00, 493.88, 587.33]),
        (133.0, [440.00, 493.88, 587.33, 739.99]),
        (142.0, [587.33, 440.00, 369.99, 293.66]),
        (150.0, [293.66, 369.99, 440.00, 587.33, 587.33])
    ]
    for start_t, note_seq in fest_flute:
        cur_t = start_t
        for pitch in note_seq:
            dur = 0.8
            sig = generate_tone(pitch, dur, wave_type='flute')
            sig = apply_envelope(sig, attack=0.1, release=0.2) * 0.18
            idx = int(cur_t * sample_rate)
            if idx + len(sig) < total_samples:
                left_channel[idx:idx+len(sig)] += sig
                right_channel[idx:idx+len(sig)] += sig
            cur_t += dur * 0.75

    # Gentle master fade out in last 2 seconds
    fade_len = int(2.5 * sample_rate)
    left_channel[-fade_len:] *= np.linspace(1, 0, fade_len)
    right_channel[-fade_len:] *= np.linspace(1, 0, fade_len)

    # Soft clipping / limiter
    left_channel = np.clip(left_channel, -0.95, 0.95)
    right_channel = np.clip(right_channel, -0.95, 0.95)

    return left_channel, right_channel

def build_full_audio_mix():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    with open("video_project/audio/manifest.json", "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # Calculate exact start and end times for all dialogues
    current_time = 0.0
    speech_intervals = []
    dialogue_events = []

    for s in manifest:
        s_start = current_time
        for d in s["dialogues"]:
            st = round(current_time, 3)
            current_time += d["duration"]
            et = round(current_time, 3)
            speech_intervals.append((st, et))
            dialogue_events.append({
                "scene_id": s["scene_id"],
                "speaker": d["speaker"],
                "char_key": d["char_key"],
                "text": d["text"],
                "file": d["file"],
                "start": st,
                "end": et,
                "duration": d["duration"]
            })
            current_time += 0.55  # comfortable breath pause
        s_end = round(current_time + 0.8, 3)
        current_time = s_end

    total_duration = round(current_time, 2)
    print(f"Total production timeline: {total_duration:.2f} seconds.")

    # 1. Synthesize BGM
    bgm_l, bgm_r = synthesize_bgm_track(total_duration)

    # 2. Apply Dynamic Ducking to BGM during dialogues
    duck_gain = np.ones(len(bgm_l), dtype=np.float32)
    ramp_len = int(0.15 * SAMPLE_RATE)
    for st, et in speech_intervals:
        idx_s = max(0, int((st - 0.2) * SAMPLE_RATE))
        idx_e = min(len(duck_gain), int((et + 0.3) * SAMPLE_RATE))
        f_down = min(ramp_len, max(1, idx_e - idx_s))
        duck_gain[idx_s:idx_s + f_down] = np.minimum(duck_gain[idx_s:idx_s + f_down], np.linspace(1.0, 0.22, f_down))
        duck_gain[idx_s + f_down:idx_e] = 0.22
        f_up = min(ramp_len, max(0, len(duck_gain) - idx_e))
        if f_up > 0:
            duck_gain[idx_e:idx_e + f_up] = np.minimum(duck_gain[idx_e:idx_e + f_up], np.linspace(0.22, 1.0, f_up))

    bgm_l *= duck_gain
    bgm_r *= duck_gain

    # Write BGM WAV file
    bgm_wav_path = "video_project/audio/bgm_ducked.wav"
    int_l = (bgm_l * 32767).astype(np.int16)
    int_r = (bgm_r * 32767).astype(np.int16)
    stereo_interleaved = np.empty((len(int_l) * 2,), dtype=np.int16)
    stereo_interleaved[0::2] = int_l
    stereo_interleaved[1::2] = int_r

    with wave.open(bgm_wav_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(stereo_interleaved.tobytes())

    print(f"BGM written to {bgm_wav_path}")

    # 3. Create full master audio by mixing dialogues over BGM using FFmpeg
    # Build filter_complex string
    inputs = ["-i", bgm_wav_path]
    filter_parts = []
    
    for idx, d in enumerate(dialogue_events):
        inputs.extend(["-i", d["file"]])
        delay_ms = int(d["start"] * 1000)
        filter_parts.append(f"[{idx+1}:a]adelay={delay_ms}|{delay_ms},volume=1.2[a{idx+1}];")

    mix_inputs = "".join([f"[a{i+1}]" for i in range(len(dialogue_events))])
    filter_str = "".join(filter_parts) + f"[0:a]{mix_inputs}amix=inputs={len(dialogue_events)+1}:duration=first:dropout_transition=2[outa]"

    master_audio_path = "video_project/audio/master_audio.wav"
    cmd = [ffmpeg_exe, "-y"] + inputs + ["-filter_complex", filter_str, "-map", "[outa]", master_audio_path]
    
    print("Mixing master audio track with FFmpeg...")
    res = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
    if res.returncode != 0:
        print("FFmpeg error:", res.stderr[-500:])
        raise RuntimeError("Master audio mix failed")
        
    print(f"Master audio generated successfully: {master_audio_path}")

    # Save complete dialogue timing manifest for video renderer
    timeline_manifest = {
        "total_duration": total_duration,
        "dialogue_events": dialogue_events
    }
    with open("video_project/timeline_manifest.json", "w", encoding="utf-8") as f:
        json.dump(timeline_manifest, f, ensure_ascii=False, indent=2)
    print("Timeline manifest saved: video_project/timeline_manifest.json")

if __name__ == "__main__":
    build_full_audio_mix()
