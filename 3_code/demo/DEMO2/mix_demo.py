import os
import sys
from moviepy import VideoFileClip, AudioFileClip, concatenate_audioclips

DEMO_DIR   = os.path.dirname(__file__)
VIDEO_IN   = os.path.join(DEMO_DIR, "recorded_browser.webm")
VIDEO_OUT  = os.path.join(DEMO_DIR, "aumtech_ai_demo.mp4")
VO_DIR     = os.path.join(DEMO_DIR, "voiceovers")

AUDIO_FILES = [
    "01_Hook_EdNex.mp3",
    "02_Aura_Tiers.mp3",
    "03_SignIn.mp3",
    "04_Dashboard.mp3",
    "05_GetAuraChat.mp3",
    "06_Courses.mp3",
    "07_Tutoring.mp3",
    "08_Wellness.mp3",
    "09_Holds.mp3",
    "10_FinancialAid.mp3",
    "11_SocialCampus.mp3",
    "12_AdminPanel.mp3",
    "13_TCO.mp3",
    "14_Closing.mp3"
]

def mix():
    if not os.path.exists(VIDEO_IN):
        print(f"[ERROR] Video not found: {VIDEO_IN}")
        sys.exit(1)

    missing = [f for f in AUDIO_FILES if not os.path.exists(os.path.join(VO_DIR, f))]
    if missing:
        print(f"[ERROR] Missing audio files: {missing}")
        sys.exit(1)

    print("[LOADING] Reading audio clips...")
    clips = [AudioFileClip(os.path.join(VO_DIR, f)) for f in AUDIO_FILES]
    full_audio = concatenate_audioclips(clips)
    audio_dur  = full_audio.duration

    print("[LOADING] Reading video...")
    video = VideoFileClip(VIDEO_IN)
    video_dur = video.duration

    print(f"  Audio total : {audio_dur:.2f}s  ({audio_dur/60:.1f} min)")
    print(f"  Video total : {video_dur:.2f}s  ({video_dur/60:.1f} min)")

    final_dur = min(audio_dur, video_dur)
    print(f"  Final clip  : {final_dur:.2f}s  ({final_dur/60:.1f} min)")

    video      = video.subclipped(0, final_dur)
    full_audio = full_audio.subclipped(0, final_dur)
    final      = video.with_audio(full_audio)

    print(f"\n[RENDERING] Writing {VIDEO_OUT} ...")
    final.write_videofile(VIDEO_OUT, codec="libx264", audio_codec="aac", fps=24, preset="fast", threads=4, logger="bar")
    print(f"\n[DONE] Final demo video: {VIDEO_OUT}")

if __name__ == "__main__":
    mix()
