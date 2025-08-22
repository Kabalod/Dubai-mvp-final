from __future__ import annotations

import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter


def split_pdf(source_path: Path, output_dir: Path) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(source_path))

    for index, page in enumerate(reader.pages, start=1):
        writer = PdfWriter()
        writer.add_page(page)
        out_path = output_dir / f"page_{index:03}.pdf"
        with open(out_path, "wb") as f:
            writer.write(f)

    return len(reader.pages)


def main() -> None:
    # Defaults for this repo
    default_src = Path("Storybook/Book_component.pdf")
    default_out = Path("Storybook/pdf-pages")

    src = Path(sys.argv[1]) if len(sys.argv) > 1 else default_src
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else default_out

    if not src.exists():
        print(f"ERROR: Source PDF not found: {src}")
        sys.exit(1)

    pages = split_pdf(src, out_dir)
    print(f"Saved {pages} pages to: {out_dir.resolve()}")


if __name__ == "__main__":
    main()


