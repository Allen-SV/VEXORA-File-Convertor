# VEXORA

### Versatile Exchange Of Resources Across-formats

VEXORA is a web-based file conversion application designed to make common file conversions simple, fast, and accessible through a clean web interface.

It supports image, PDF, Microsoft Office, and CSV conversions through a JavaScript frontend and a Flask-based Python backend.

---

## 🚀 Live Demo

**Try VEXORA:**  
https://vexora-file-convertor-frontend.vercel.app/

---

## ✨ Features

### 🖼️ Image Conversion

Supported image formats:

- PNG
- JPG
- JPEG
- WEBP

Available conversions:

- Image → JPG
- Image → JPEG
- Image → PNG
- Image → WEBP
- Image → PDF
- Multiple Images → PDF
- Multiple Images → Image ZIP

---

### 📄 PDF Conversion

Available conversions:

- PDF → JPG
- PDF → JPEG
- PDF → PNG

When converting a PDF to images, the individual pages are packaged into a ZIP file.

---

### 📊 Microsoft Office Conversion

#### DOCX

- DOCX → PDF

#### PPTX

- PPTX → PDF
- PPTX → JPG
- PPTX → PNG

#### XLSX

- XLSX → PDF
- XLSX → CSV

---

### 📑 CSV Conversion

- CSV → XLSX

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Vercel

### Backend

- Python
- Flask
- Flask-CORS
- Gunicorn
- Docker
- Render

### Conversion Libraries

- Pillow
- PyMuPDF
- OpenPyXL
- LibreOffice

---

## 🏗️ Architecture

```text
                         VEXORA
                            │
                            ▼
                   ┌─────────────────┐
                   │     Vercel      │
                   │    Frontend     │
                   │ HTML / CSS / JS │
                   └────────┬────────┘
                            │
                            │ HTTPS API
                            ▼
                   ┌─────────────────┐
                   │     Render      │
                   │ Flask Backend   │
                   │     + Docker    │
                   └────────┬────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Pillow         PyMuPDF      LibreOffice
