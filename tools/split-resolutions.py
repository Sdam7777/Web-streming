#!/usr/bin/env python3
"""
Tariaki - Tools pecah resolusi untuk hunting anime
Tanpa ini, 1k penonton 1080p bakal jebol. Tool ini bikin 1080p bitrate rendah per-title + HLS SVC.
Usage: python split-resolutions.py input.mkv --out videos/Prison_School_01
Needs: ffmpeg installed
"""
import subprocess, pathlib, json, sys
import argparse

def run(cmd):
    print(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)

def transcode(input_path, out_dir, name):
    out = pathlib.Path(out_dir) / name
    out.mkdir(parents=True, exist_ok=True)
    # 1. Per-title 1080p bitrate rendah AV1/H264 - 1080p 1200k (hemat tapi 1080p)
    # 2. HLS SVC: master.m3u8 with 1080p,720p,480p variants
    # Generate 3 renditions + HLS
    renditions = [
        ("1080p", "1920:1080", "1200k", "av1"),
        ("720p", "1280:720", "800k", "av1"),
        ("480p", "854:480", "500k", "av1"),
    ]
    # Create HLS per rendition
    for label, scale, bitrate, codec in renditions:
        # Use libx264 for compat if libaom not available, fallback to libx264
        vcodec = "libaom-av1" if "av1" in codec else "libx264"
        # Probe for ffmpeg codecs - try av1 first
        cmd = [
            "ffmpeg", "-y", "-i", str(input_path),
            "-vf", f"scale={scale}:flags=lanczos",
            "-c:v", vcodec, "-b:v", bitrate, "-crf", "32" if "av1" in codec else "23",
            "-c:a", "aac", "-b:a", "128k",
            "-hls_time", "4", "-hls_playlist_type", "vod",
            "-hls_segment_filename", str(out / f"{label}_%03d.ts"),
            str(out / f"{label}.m3u8")
        ]
        try:
            run(cmd)
        except subprocess.CalledProcessError:
            # fallback to x264
            cmd[5] = "libx264"
            cmd[7] = "23"
            run(cmd)
    # SVC-like master playlist
    master = out / "master.m3u8"
    master.write_text(f"""#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1920x1080,NAME="1080p"
1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=1280x720,NAME="720p"
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=600000,RESOLUTION=854x480,NAME="480p"
480p.m3u8
""")
    print(f"Done -> {master}")
    print(f"Upload ke Supabase: supabase storage upload videos/{name}/master.m3u8")
    print(f"Upload ke Firebase: firebase storage cp -r {out} gs://tariaki.firebasestorage.app/videos/{name}/")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("input", help="input mkv/mp4")
    p.add_argument("--out", default="videos", help="out dir")
    p.add_argument("--name", help="output name without ext")
    args = p.parse_args()
    inp = pathlib.Path(args.input)
    name = args.name or inp.stem
    transcode(inp, args.out, name)
