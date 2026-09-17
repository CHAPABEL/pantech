from __future__ import annotations

import re
import unicodedata
from pathlib import Path

from fastapi import HTTPException, UploadFile

# Корень всех файлов на диске
UPLOAD_ROOT = Path("uploads")

# Картинки из админки (отдельно от вложений формы обратной связи)
IMAGES_ROOT = UPLOAD_ROOT / "images"
ATTACHMENTS_DIR = UPLOAD_ROOT / "attachments"

# Подпапки в uploads/images/
IMAGE_CATEGORIES = frozenset({"partners", "cards", "services", "projects", "media"})

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

CONTENT_TYPE_EXT: dict[str, str] = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
}

_SAFE_FILENAME_RE = re.compile(r"[^A-Za-zА-Яа-яЁё0-9_.\- ]+")
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
PARTNER_IMAGE_EXTENSIONS = {".png", ".webp", ".svg"}

PDF_RENDER_DPI = 200
MAX_PDF_SIZE = 20 * 1024 * 1024  # 20 MB


def _is_pdf(file: UploadFile, content: bytes) -> bool:
    ct = (file.content_type or "").split(";")[0].strip().lower()
    if ct == "application/pdf":
        return True
    if (file.filename or "").lower().endswith(".pdf"):
        return True
    return content[:5] == b"%PDF-"


def _render_pdf_first_page(content: bytes) -> bytes:
    """Растеризует первую страницу PDF в PNG — сертификат должен сразу
    отображаться как картинка, без отдельного PDF-просмотрщика."""
    import fitz  # PyMuPDF

    if len(content) > MAX_PDF_SIZE:
        raise HTTPException(
            status_code=413, detail="PDF слишком большой. Максимум 20 МБ."
        )
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        if doc.page_count == 0:
            raise HTTPException(status_code=400, detail="PDF-файл пустой")
        page = doc.load_page(0)
        zoom = PDF_RENDER_DPI / 72
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
        return pix.tobytes("png")
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=400, detail=f"Не удалось прочитать PDF: {exc}"
        ) from None

# Статика из frontend/public (не в uploads)
STATIC_PUBLIC_IMAGES: tuple[str, ...] = (
    "images/Logo2.svg",
    "images/Brialin.svg",
    "images/Brialin2.svg",
    "images/Brialin3.svg",
    "images/Success.svg",
    "images/mail.svg",
    "images/telega.svg",
    "images/stack/python.svg",
    "images/stack/docker.svg",
    "images/stack/carbon.svg",
    "images/full.png",
    "images/services/audi.svg",
    "images/services/Ai.png",
    "images/services/dev.svg",
    "images/services/jira.svg",
    "images/projects/bgCover1.png",
    "images/projects/bgCover2.png",
    "images/projects/bgCover3.png",
    "images/partners/microsoft.svg",
    "images/partners/aws.svg",
    "images/partners/ibm.svg",
    "images/partners/oracle.svg",
)


def ensure_upload_dirs() -> None:
    """Создаёт структуру каталогов при старте приложения."""
    ATTACHMENTS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_ROOT.mkdir(parents=True, exist_ok=True)
    for cat in IMAGE_CATEGORIES:
        (IMAGES_ROOT / cat).mkdir(parents=True, exist_ok=True)
    # Совместимость со старыми путями uploads/partners, uploads/media
    (UPLOAD_ROOT / "partners").mkdir(parents=True, exist_ok=True)
    (UPLOAD_ROOT / "media").mkdir(parents=True, exist_ok=True)


def category_dir(category: str) -> Path:
    if category not in IMAGE_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Категория должна быть одной из: {', '.join(sorted(IMAGE_CATEGORIES))}",
        )
    return IMAGES_ROOT / category


def public_url(relative_to_upload_root: str) -> str:
    rel = relative_to_upload_root.lstrip("/")
    return f"/api/uploads/{rel}"


def _sanitize_filename(name: str) -> str:
    name = unicodedata.normalize("NFC", name).strip().replace("/", "_").replace("\\", "_")
    name = _SAFE_FILENAME_RE.sub("_", name)
    return Path(name).stem[:96] or "image"


def _resolve_ext(file: UploadFile, content: bytes) -> str:
    ct = (file.content_type or "").split(";")[0].strip().lower()
    if ct in CONTENT_TYPE_EXT:
        return CONTENT_TYPE_EXT[ct]
    name = file.filename or ""
    suffix = Path(name).suffix.lower()
    if suffix in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}:
        return ".jpg" if suffix == ".jpeg" else suffix
    if content[:8] == b"\x89PNG\r\n\x1a\n":
        return ".png"
    if content[:3] == b"\xff\xd8\xff":
        return ".jpg"
    if content[:4] == b"RIFF" and len(content) >= 12 and content[8:12] == b"WEBP":
        return ".webp"
    if content.lstrip()[:5] == b"<?xml" or content.lstrip()[:4] == b"<svg":
        return ".svg"
    raise HTTPException(
        status_code=400,
        detail="Неподдерживаемый формат. Разрешены PNG, JPEG, WebP, GIF, SVG.",
    )


async def save_image(file: UploadFile, *, category: str = "media") -> str:
    """Сохраняет в uploads/images/<category>/ и возвращает URL /api/uploads/images/..."""
    dest_dir = category_dir(category)
    dest_dir.mkdir(parents=True, exist_ok=True)

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Файл пустой")

    original_name = file.filename or "image"
    if category == "partners" and _is_pdf(file, content):
        content = _render_pdf_first_page(content)
        ext = ".png"
    else:
        if len(content) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="Файл слишком большой. Максимум 5 МБ.",
            )
        ext = _resolve_ext(file, content)
        if category == "partners" and ext not in PARTNER_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Для партнёров разрешены только SVG, PNG, WebP или PDF (сертификат).",
            )
    safe_stem = _sanitize_filename(original_name)
    path = dest_dir / f"{safe_stem}{ext}"
    counter = 1
    while path.exists():
        path = dest_dir / f"{safe_stem}_{counter}{ext}"
        counter += 1

    path.write_bytes(content)
    rel = path.relative_to(UPLOAD_ROOT).as_posix()
    return public_url(rel)


def _scan_directory(directory: Path) -> list[dict[str, str]]:
    if not directory.is_dir():
        return []
    found: list[dict[str, str]] = []
    for file_path in sorted(directory.rglob("*")):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        try:
            rel = file_path.relative_to(UPLOAD_ROOT).as_posix()
        except ValueError:
            continue
        found.append(
            {
                "path": public_url(rel),
                "name": file_path.name,
                "source": "upload",
            }
        )
    return found


def list_available_images(category: str | None = None) -> list[dict[str, str]]:
    """Галерея админки: загруженные файлы + статические пути из public."""
    ensure_upload_dirs()
    seen: set[str] = set()
    items: list[dict[str, str]] = []

    def add(path: str, name: str, source: str) -> None:
        if path in seen:
            return
        seen.add(path)
        items.append({"path": path, "name": name, "source": source})

    for static_path in STATIC_PUBLIC_IMAGES:
        add(static_path, Path(static_path).name, "static")

    scan_roots: list[Path] = []
    if category and category in IMAGE_CATEGORIES:
        scan_roots.append(IMAGES_ROOT / category)
        # старые файлы uploads/<category>/
        legacy = UPLOAD_ROOT / category
        if legacy != IMAGES_ROOT / category:
            scan_roots.append(legacy)
    else:
        scan_roots.append(IMAGES_ROOT)
        for cat in IMAGE_CATEGORIES:
            legacy = UPLOAD_ROOT / cat
            if legacy.is_dir() and legacy != IMAGES_ROOT / cat:
                scan_roots.append(legacy)

    for root in scan_roots:
        for entry in _scan_directory(root):
            add(entry["path"], entry["name"], entry["source"])

    items.sort(
        key=lambda x: (
            0 if x["source"] == "upload" else 1,
            x["name"].lower(),
        )
    )
    return items
