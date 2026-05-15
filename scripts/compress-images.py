"""Compress lawyer*.png in public/images (resize + JPEG)."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
SITE_TS = Path(__file__).resolve().parent.parent / "data" / "site.ts"

TARGETS = {
    "lawyer.png": 1400,
    "lawyer2.png": 1600,
    "lawyer3.png": 1400,
}
JPEG_QUALITY = 82


def to_rgb(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return bg
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def compress_png_to_jpg(png_path: Path, max_edge: int) -> tuple[str, int, int]:
    before = png_path.stat().st_size
    img = Image.open(png_path)
    w, h = img.size
    longest = max(w, h)
    if longest > max_edge:
        scale = max_edge / longest
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    jpg_path = png_path.with_suffix(".jpg")
    to_rgb(img).save(jpg_path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    png_path.unlink()
    after = jpg_path.stat().st_size
    return jpg_path.name, before, after


def update_site_ts(replacements: dict[str, str]) -> None:
    text = SITE_TS.read_text(encoding="utf-8")
    for old, new in replacements.items():
        text = text.replace(old, new)
    SITE_TS.write_text(text, encoding="utf-8")


def main() -> None:
    path_updates: dict[str, str] = {}
    for png_name, max_edge in TARGETS.items():
        png_path = ROOT / png_name
        if not png_path.exists():
            print(f"skip missing: {png_name}")
            continue
        jpg_name, before, after = compress_png_to_jpg(png_path, max_edge)
        old_url = f"/images/{png_name}"
        new_url = f"/images/{jpg_name}"
        path_updates[old_url] = new_url
        pct = 100 - (after * 100 // before) if before else 0
        print(f"{png_name} -> {jpg_name}: {before // 1024} KB -> {after // 1024} KB ({pct}% smaller)")

    if path_updates:
        update_site_ts(path_updates)
        print("Updated data/site.ts image paths")


if __name__ == "__main__":
    main()
