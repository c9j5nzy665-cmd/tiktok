#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p media tmp assets

command -v ffmpeg >/dev/null || { echo 'FFmpeg manquant'; exit 1; }
command -v curl >/dev/null || { echo 'curl manquant'; exit 1; }
command -v base64 >/dev/null || { echo 'base64 manquant'; exit 1; }

if [ ! -s assets/voice.ogg ]; then
  cat assets/voice8_parts/part*.b64 | tr -d '\n\r ' | base64 -d > assets/voice.ogg
fi
[ -s assets/voice.ogg ] || { echo 'Impossible de reconstruire assets/voice.ogg'; exit 1; }

download_any() {
  local out="$1"; shift
  if [ -s "$out" ]; then return 0; fi
  rm -f "$out" "$out.part"
  local url
  for url in "$@"; do
    echo "Téléchargement: $url"
    if curl -L --fail --retry 3 --retry-all-errors --connect-timeout 30 \
      -A 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36' \
      -o "$out.part" "$url" && [ -s "$out.part" ]; then
      mv "$out.part" "$out"
      return 0
    fi
    rm -f "$out.part"
  done
  echo "Échec téléchargement: $out"
  return 1
}

# Médias Pexels réels vérifiés pour le Reel Effet IKEA.
download_any media/furniture.mp4 \
  'https://videos.pexels.com/video-files/6136370/6136370-uhd_2560_1440_30fps.mp4'

download_any media/assembly.jpg \
  'https://images.pexels.com/photos/31755426/pexels-photo-31755426.jpeg?cs=srgb&dl=pexels-soc-nang-d-ng-2150345854-31755426.jpg&fm=jpg'

download_any media/instructions.jpg \
  'https://images.pexels.com/photos/5805491/pexels-photo-5805491.jpeg?cs=srgb&dl=pexels-athena-5805491.jpg&fm=jpg'

download_any media/manual.jpg \
  'https://images.pexels.com/photos/12442760/pexels-photo-12442760.jpeg?cs=srgb&dl=pexels-felipepelaquim-12442760.jpg&fm=jpg'

download_any media/blocks.jpg \
  'https://images.pexels.com/photos/7301355/pexels-photo-7301355.jpeg?cs=srgb&dl=pexels-kseniachernaya-7301355.jpg&fm=jpg'

download_any media/origami.jpg \
  'https://images.pexels.com/photos/5185147/pexels-photo-5185147.jpeg?cs=srgb&dl=pexels-cottonbro-5185147.jpg&fm=jpg'

download_any media/shelf.jpg \
  'https://images.pexels.com/photos/8927360/pexels-photo-8927360.jpeg?cs=srgb&dl=pexels-dan-hadley-360599-8927360.jpg&fm=jpg'

D1=5.5; D2=2.7; D3A=3.4; D3B=3.3; D4=3.9; D5=6.3; D6=3.6; D7=4.9; D8=2.0

make_video() {
  local src="$1" start="$2" dur="$3" out="$4"
  local fadeout
  fadeout=$(python3 - <<PY
print(max(0,float('$dur')-0.10))
PY
)
  ffmpeg -y -ss "$start" -i "$src" -t "$dur" -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,fade=t=in:st=0:d=0.10,fade=t=out:st=${fadeout}:d=0.10" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

make_photo() {
  local src="$1" dur="$2" out="$3" zoom_dir="${4:-in}"
  local frames fadeout zoomexpr
  frames=$(python3 - <<PY
print(int(round(float('$dur')*30)))
PY
)
  fadeout=$(python3 - <<PY
print(max(0,float('$dur')-0.10))
PY
)
  if [ "$zoom_dir" = "out" ]; then
    zoomexpr="if(eq(on,1),1.055,max(1.0,zoom-0.00032))"
  else
    zoomexpr="min(zoom+0.00032,1.055)"
  fi
  ffmpeg -y -loop 1 -i "$src" -t "$dur" -an \
    -vf "scale=1400:2400:force_original_aspect_ratio=increase,crop=1400:2400,zoompan=z='${zoomexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,fade=t=in:st=0:d=0.10,fade=t=out:st=${fadeout}:d=0.10" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

make_video media/furniture.mp4 0.0 "$D1" tmp/01.mp4
make_photo media/instructions.jpg "$D2" tmp/02.mp4 out
make_photo media/blocks.jpg "$D3A" tmp/03a.mp4 in
make_photo media/origami.jpg "$D3B" tmp/03b.mp4 out
printf "file '03a.mp4'\nfile '03b.mp4'\n" > tmp/03.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 03.txt -c copy 03.mp4)
make_video media/furniture.mp4 5.8 "$D4" tmp/04.mp4
make_photo media/assembly.jpg "$D5" tmp/05.mp4 in
make_photo media/manual.jpg "$D6" tmp/06.mp4 out
make_photo media/shelf.jpg "$D7" tmp/07.mp4 in
make_photo media/shelf.jpg "$D8" tmp/08.mp4 out

printf "file '01.mp4'\nfile '02.mp4'\nfile '03.mp4'\nfile '04.mp4'\nfile '05.mp4'\nfile '06.mp4'\nfile '07.mp4'\nfile '08.mp4'\n" > tmp/list.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i list.txt -c copy picture.mp4)

ffmpeg -y -i tmp/picture.mp4 -i assets/voice.ogg \
  -vf "ass=assets/subtitles.ass" \
  -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k \
  -t 35.6 -movflags +faststart -map_metadata -1 \
  HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4

echo "DONE: $(pwd)/HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4"
