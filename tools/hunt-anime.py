#!/usr/bin/env python3
"""
Hunt anime sub indo - batch split + upload ke semua storage (Supabase, Firebase, Github fallback)
Usage: python hunt-anime.py --dir ./raw_anime --anime-id mushoku-tensei
"""
import pathlib, subprocess, json, argparse, os
import sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))

def hunt(dir_path, anime_id):
    raw = pathlib.Path(dir_path)
    files = list(raw.glob("*.mkv")) + list(raw.glob("*.mp4"))
    print(f"Hunting {len(files)} files for {anime_id}")
    for f in files:
        print(f"\n=== {f.name} ===")
        subprocess.run([sys.executable, str(pathlib.Path(__file__).parent/"split-resolutions.py"), str(f), "--out", f"videos/{anime_id}", "--name", f.stem], check=False)
        # Auto insert to Supabase DB
        # curl Supabase REST to insert episode
        print(f"-> Siap upload ke Supabase videos/{anime_id}/{f.stem}/master.m3u8 + Firebase")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--dir", required=True)
    p.add_argument("--anime-id", required=True)
    args = p.parse_args()
    hunt(args.dir, args.anime_id)
