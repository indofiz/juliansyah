#!/usr/bin/env bash
# Compresses a scroll recording (scripts/record-scroll.mjs) for the site,
# with no audio, in the two formats ScrollVideo.tsx plays:
#
#   <out>.webm   VP9, two-pass, constant quality   (Chrome, Firefox, Edge)
#   <out>.mp4    H.264 High, +faststart            (Safari)
#
#   scripts/encode-scroll.sh <master.mp4> <out-without-extension> <width> [vp9-crf] [h264-crf]
#
# e.g. scripts/encode-scroll.sh master.mp4 public/projects/alindo/video/card 960
# Higher CRF = smaller file, softer picture. Check a few frames by eye.
set -euo pipefail

in=$1
out=$2
width=$3
crf_vp9=${4:-36}
crf_h264=${5:-26}

mkdir -p "$(dirname "$out")"
vf="scale=${width}:-2:flags=lanczos,fps=30,format=yuv420p"
log=$(mktemp -t vp9pass)

ffmpeg -y -hide_banner -loglevel error -i "$in" -an -vf "$vf" \
  -c:v libvpx-vp9 -b:v 0 -crf "$crf_vp9" -row-mt 1 -deadline good -cpu-used 2 \
  -pass 1 -passlogfile "$log" -f null /dev/null
ffmpeg -y -hide_banner -loglevel error -i "$in" -an -vf "$vf" \
  -c:v libvpx-vp9 -b:v 0 -crf "$crf_vp9" -row-mt 1 -deadline good -cpu-used 2 \
  -pass 2 -passlogfile "$log" "$out.webm"
rm -f "$log"*

ffmpeg -y -hide_banner -loglevel error -i "$in" -an -vf "$vf" \
  -c:v libx264 -preset slow -crf "$crf_h264" -profile:v high -movflags +faststart "$out.mp4"

ls -lh "$out.webm" "$out.mp4"
