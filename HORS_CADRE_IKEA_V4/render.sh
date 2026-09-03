#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p media tmp assets

command -v ffmpeg >/dev/null || { echo 'FFmpeg manquant'; exit 1; }
command -v curl >/dev/null || { echo 'curl manquant'; exit 1; }
command -v base64 >/dev/null || { echo 'base64 manquant'; exit 1; }

# Réutilise la voix validée de la V3.
if [ ! -s assets/voice.ogg ]; then
  cat ../HORS_CADRE_IKEA_V3/assets/voice8_parts/part*.b64 | tr -d '\n\r ' | base64 -d > assets/voice.ogg
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

# Médias réels Pexels validés.
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

# Look HORS CADRE : contraste contenu, saturation réduite, grain discret, vignette légère.
GRADE="eq=contrast=1.065:saturation=0.88:brightness=-0.015,unsharp=5:5:0.35:5:5:0,noise=alls=2:allf=t+u,vignette=PI/11"
GRADE_DARK="eq=contrast=1.08:saturation=0.72:brightness=-0.055,unsharp=5:5:0.3:5:5:0,noise=alls=2:allf=t+u,vignette=PI/9"

make_video() {
  local src="$1" start="$2" dur="$3" out="$4"
  ffmpeg -y -ss "$start" -i "$src" -t "$dur" -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,${GRADE}" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

make_photo() {
  local src="$1" dur="$2" out="$3" zoom_dir="${4:-in}" dark="${5:-no}"
  local frames zoomexpr grade
  frames=$(python3 - <<PY
print(int(round(float('$dur')*30)))
PY
)
  if [ "$zoom_dir" = "out" ]; then
    zoomexpr="if(eq(on,1),1.045,max(1.0,zoom-0.00022))"
  else
    zoomexpr="min(zoom+0.00022,1.045)"
  fi
  grade="$GRADE"
  [ "$dark" = "yes" ] && grade="$GRADE_DARK"
  ffmpeg -y -loop 1 -i "$src" -t "$dur" -an \
    -vf "scale=1400:2400:force_original_aspect_ratio=increase,crop=1400:2400,zoompan=z='${zoomexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,setsar=1,${grade}" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$out"
}

# 0–5.5 s : hook à 3 cuts, fini -> effort -> montage.
make_photo media/shelf.jpg 1.35 tmp/01a.mp4 out
make_video media/furniture.mp4 0.2 1.55 tmp/01b.mp4
make_photo media/assembly.jpg 2.60 tmp/01c.mp4 in
printf "file '01a.mp4'\nfile '01b.mp4'\nfile '01c.mp4'\n" > tmp/01.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 01.txt -c copy 01.mp4)

# 5.5–8.2 s : nom du biais, notice propre.
make_photo media/instructions.jpg 2.70 tmp/02.mp4 out

# 8.2–14.9 s : expérience, blocs + origami.
make_photo media/blocks.jpg 3.40 tmp/03a.mp4 in
make_photo media/origami.jpg 3.30 tmp/03b.mp4 out
printf "file '03a.mp4'\nfile '03b.mp4'\n" > tmp/03.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 03.txt -c copy 03.mp4)

# 14.9–18.8 s : réussite / construction.
make_video media/furniture.mp4 5.8 3.90 tmp/04.mp4

# 18.8–25.1 s : valeur perçue, objet fini puis effort.
make_photo media/shelf.jpg 3.10 tmp/05a.mp4 in
make_photo media/assembly.jpg 3.20 tmp/05b.mp4 out
printf "file '05a.mp4'\nfile '05b.mp4'\n" > tmp/05.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i 05.txt -c copy 05.mp4)

# 25.1–28.7 s : rupture / échec, plus sombre.
make_photo media/manual.jpg 3.60 tmp/06.mp4 out yes

# 28.7–33.6 s : effort et attachement.
make_photo media/assembly.jpg 4.90 tmp/07.mp4 in

# 33.6–35.6 s : conclusion sobre HORS CADRE.
make_photo media/shelf.jpg 2.00 tmp/08.mp4 out

printf "file '01.mp4'\nfile '02.mp4'\nfile '03.mp4'\nfile '04.mp4'\nfile '05.mp4'\nfile '06.mp4'\nfile '07.mp4'\nfile '08.mp4'\n" > tmp/list.txt
(cd tmp && ffmpeg -y -f concat -safe 0 -i list.txt -c copy picture.mp4)

# Impacts très subtils : hook, révélation, conclusion.
ffmpeg -y -f lavfi -i "sine=frequency=52:duration=0.22" \
  -af "afade=t=out:st=0.02:d=0.20,volume=0.14" tmp/impact.wav

# Burn subtitles + overlays éditoriaux, puis mix audio premium.
ffmpeg -y -i tmp/picture.mp4 -i assets/voice.ogg -i tmp/impact.wav \
  -filter_complex "[0:v]ass=assets/subtitles.ass,ass=assets/overlays.ass[v];[1:a]highpass=f=70,lowpass=f=15000,acompressor=threshold=0.12:ratio=2:attack=10:release=110:makeup=1.35[voice];[2:a]asplit=3[s0][s1][s2];[s0]adelay=0|0[i0];[s1]adelay=6900|6900[i1];[s2]adelay=28900|28900[i2];[voice][i0][i1][i2]amix=inputs=4:duration=first:normalize=0,alimiter=limit=0.94[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 16 -c:a aac -b:a 192k \
  -t 35.6 -movflags +faststart -map_metadata -1 \
  HORS_CADRE_EFFET_IKEA_MASTER_V4_PREMIUM.mp4

echo "DONE: $(pwd)/HORS_CADRE_EFFET_IKEA_MASTER_V4_PREMIUM.mp4"
