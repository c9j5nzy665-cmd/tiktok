#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p media tmp assets

command -v ffmpeg >/dev/null || { echo 'FFmpeg manquant'; exit 1; }
command -v curl >/dev/null || { echo 'curl manquant'; exit 1; }
command -v base64 >/dev/null || { echo 'base64 manquant'; exit 1; }

# Reconstitue automatiquement la voix IKEA depuis les fragments texte stockés dans GitHub.
if [ ! -s assets/voice.ogg ]; then
  cat assets/voice8_parts/part*.b64 | tr -d '\n\r ' | base64 -d > assets/voice.ogg
fi
[ -s assets/voice.ogg ] || { echo 'Impossible de reconstruire assets/voice.ogg'; exit 1; }

# Téléchargement robuste : n'utilise jamais un cache vide ou partiel.
download_any() {
  local out="$1"; shift
  if [ -s "$out" ]; then return 0; fi
  rm -f "$out" "$out.part"
  local url
  for url in "$@"; do
    echo "Téléchargement: $url"
    if curl -L --fail --retry 3 --retry-all-errors --connect-timeout 20 \
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

# V3 = médias photographiques réels. Pexels supprimé car son CDN renvoie HTTP 403 dans Codex.
download_any media/furniture.jpg \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Assembling_furniture_(3840186153).jpg' \
  'https://images.unsplash.com/photo-1776773299716-1ebcd15ac61b?auto=format&fit=crop&fm=jpg&q=85&w=2400'

download_any media/screwdriver.jpg \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hand_working_with_screw_and_screwdriver_on_wooden_project_in_bright_outdoor_workspace.jpg' \
  'https://images.unsplash.com/photo-1776773299716-1ebcd15ac61b?auto=format&fit=crop&fm=jpg&q=85&w=2400'

download_any media/lego.jpg \
  'https://upload.wikimedia.org/wikipedia/commons/3/37/Lego_figures_at_CTC_event.jpg' \
  'https://images.unsplash.com/photo-1773944897057-b3e4bdf3c74d?auto=format&fit=crop&fm=jpg&q=85&w=2400'

download_any media/origami.jpg \
  'https://upload.wikimedia.org/wikipedia/commons/2/2c/Origami_crane_cropped.jpg' \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Origami_Paper_Crane.jpg'

download_any media/instructions.jpg \
  'https://images.unsplash.com/photo-1773944897057-b3e4bdf3c74d?auto=format&fit=crop&fm=jpg&q=85&w=2400' \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Assembling_furniture_(3840186153).jpg'

download_any media/woodwork.jpg \
  'https://images.unsplash.com/photo-1776773299716-1ebcd15ac61b?auto=format&fit=crop&fm=jpg&q=85&w=2400' \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hand_working_with_screw_and_screwdriver_on_wooden_project_in_bright_outdoor_workspace.jpg'

download_any media/shelf.jpg \
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Living_Room_Display_Shelves_(14427977414).jpg' \
  'https://images.unsplash.com/photo-1724004546303-c676b7d1ab71?auto=format&fit=crop&fm=jpg&q=85&w=2400'

D1=5.5; D2=2.7; D3=6.7; D4=3.9; D5=6.3; D6=3.6; D7=4.9; D8=2.0

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

# Découpage aligné sur la voix officielle (35,6 s).
make_photo media/furniture.jpg   "$D1" tmp/01.mp4 in
make_photo media/screwdriver.jpg "$D2" tmp/02.mp4 out
make_photo media/lego.jpg        3.4   tmp/03a.mp4 in
make_photo media/origami.jpg     3.3   tmp/03b.mp4 out
printf "file '03a.mp4'\nfile '03b.mp4'\n" > tmp/03.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 03.txt -c copy 03.mp4)
make_photo media/furniture.jpg   "$D4" tmp/04.mp4 out
make_photo media/instructions.jpg "$D5" tmp/05.mp4 in
make_photo media/woodwork.jpg    "$D6" tmp/06.mp4 out
make_photo media/shelf.jpg       "$D7" tmp/07.mp4 in
make_photo media/shelf.jpg       "$D8" tmp/08.mp4 out

printf "file '01.mp4'\nfile '02.mp4'\nfile '03.mp4'\nfile '04.mp4'\nfile '05.mp4'\nfile '06.mp4'\nfile '07.mp4'\nfile '08.mp4'\n" > tmp/list.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i list.txt -c copy picture.mp4)

ffmpeg -y -i tmp/picture.mp4 -i assets/voice.ogg \
  -vf "ass=assets/subtitles.ass" \
  -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k \
  -t 35.6 -movflags +faststart -map_metadata -1 \
  HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4

echo "DONE: $(pwd)/HORS_CADRE_EFFET_IKEA_MASTER_V3_REEL_IMAGES_REELLES.mp4"
