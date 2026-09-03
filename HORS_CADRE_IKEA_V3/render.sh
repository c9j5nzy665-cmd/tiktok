#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p media tmp

command -v ffmpeg >/dev/null || { echo 'FFmpeg manquant'; exit 1; }
[ -f assets/voice.mp3 ] || { echo 'assets/voice.mp3 manquant'; exit 1; }

[ -f media/furniture.mp4 ] || curl -L --fail --retry 3 -o media/furniture.mp4 'https://videos.pexels.com/video-files/6136370/6136370-uhd_2560_1440_30fps.mp4'
[ -f media/blocks.mp4 ] || curl -L --fail --retry 3 -o media/blocks.mp4 'https://videos.pexels.com/video-files/6666449/6666449-uhd_2160_3744_30fps.mp4'
[ -f media/origami.mp4 ] || curl -L --fail --retry 3 -o media/origami.mp4 'https://videos.pexels.com/video-files/6364305/6364305-hd_1920_1080_30fps.mp4'
[ -f media/blocks_instruction.jpg ] || curl -L --fail --retry 3 -o media/blocks_instruction.jpg 'https://images.unsplash.com/photo-1773944897057-b3e4bdf3c74d?auto=format&fit=crop&fm=jpg&q=85&w=2400'
[ -f media/woodwork.jpg ] || curl -L --fail --retry 3 -o media/woodwork.jpg 'https://images.unsplash.com/photo-1776773299716-1ebcd15ac61b?auto=format&fit=crop&fm=jpg&q=85&w=2400'
[ -f media/shelf.jpg ] || curl -L --fail --retry 3 -o media/shelf.jpg 'https://images.unsplash.com/photo-1724004546303-c676b7d1ab71?auto=format&fit=crop&fm=jpg&q=85&w=2400'

D1=5.5; D2=2.7; D3=6.7; D4=3.9; D5=6.3; D6=3.6; D7=4.9; D8=2.0

make_video() {
  local src="$1" start="$2" dur="$3" out="$4"
  ffmpeg -y -ss "$start" -i "$src" -t "$dur" -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,fade=t=in:st=0:d=0.10,fade=t=out:st=$(python3 - <<PY
print(max(0,float('$dur')-0.10))
PY
):d=0.10" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

make_photo() {
  local src="$1" dur="$2" out="$3"
  local frames
  frames=$(python3 - <<PY
print(int(round(float('$dur')*30)))
PY
)
  ffmpeg -y -loop 1 -i "$src" -t "$dur" -an \
    -vf "scale=1400:2400:force_original_aspect_ratio=increase,crop=1400:2400,zoompan=z='min(zoom+0.00032,1.055)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1080x1920:fps=30,fade=t=in:st=0:d=0.10,fade=t=out:st=$(python3 - <<PY
print(max(0,float('$dur')-0.10))
PY
):d=0.10" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

make_video media/furniture.mp4 0.0 "$D1" tmp/01.mp4
make_photo media/woodwork.jpg "$D2" tmp/02.mp4
make_video media/blocks.mp4 0.0 3.4 tmp/03a.mp4
make_video media/origami.mp4 0.0 3.3 tmp/03b.mp4
printf "file '03a.mp4'\nfile '03b.mp4'\n" > tmp/03.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 03.txt -c copy 03.mp4)
make_video media/furniture.mp4 5.8 "$D4" tmp/04.mp4
make_photo media/blocks_instruction.jpg "$D5" tmp/05.mp4
make_photo media/woodwork.jpg "$D6" tmp/06.mp4
make_photo media/shelf.jpg "$D7" tmp/07.mp4
make_photo media/shelf.jpg "$D8" tmp/08.mp4

printf "file '01.mp4'\nfile '02.mp4'\nfile '03.mp4'\nfile '04.mp4'\nfile '05.mp4'\nfile '06.mp4'\nfile '07.mp4'\nfile '08.mp4'\n" > tmp/list.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i list.txt -c copy picture.mp4)

ffmpeg -y -i tmp/picture.mp4 -i assets/voice.mp3 \
  -vf "ass=assets/subtitles.ass" \
  -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k \
  -t 35.6 -movflags +faststart -map_metadata -1 \
  HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4

echo "DONE: $(pwd)/HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4"
