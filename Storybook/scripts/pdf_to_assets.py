from __future__ import annotations

import sys
from pathlib import Path

import fitz  # PyMuPDF


def pdf_to_svg_png(source_pdf: Path, out_svg: Path, out_png: Path, png_dpi: int = 192) -> int:
    out_svg.mkdir(parents=True, exist_ok=True)
    out_png.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(source_pdf))
    for idx, page in enumerate(doc, start=1):
        # SVG
        svg_text = page.get_svg_image()
        (out_svg / f"page_{idx:03}.svg").write_text(svg_text, encoding="utf-8")

        # PNG
        pix = page.get_pixmap(dpi=png_dpi)
        pix.save(str(out_png / f"page_{idx:03}.png"))

    return doc.page_count


def main() -> None:
    default_src = Path("Storybook/Book_component.pdf")
    default_out_svg = Path("Storybook/svg")
    default_out_png = Path("Storybook/png")

    src = Path(sys.argv[1]) if len(sys.argv) > 1 else default_src
    out_svg = Path(sys.argv[2]) if len(sys.argv) > 2 else default_out_svg
    out_png = Path(sys.argv[3]) if len(sys.argv) > 3 else default_out_png
    dpi = int(sys.argv[4]) if len(sys.argv) > 4 else 192

    if not src.exists():
        print(f"ERROR: Source PDF not found: {src}")
        sys.exit(1)

    pages = pdf_to_svg_png(src, out_svg, out_png, png_dpi=dpi)
    print(f"Converted {pages} pages → SVG: {out_svg.resolve()} and PNG: {out_png.resolve()} (dpi={dpi})")


if __name__ == "__main__":
    main()


