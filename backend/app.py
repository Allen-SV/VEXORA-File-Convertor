from flask import Flask, request, send_file
from flask_cors import CORS

from converters.image_converter import (
    image_to_format,
    images_to_pdf,
    batch_convert_images
)

from converters.pdf_converter import (
    pdf_to_images
)

from converters.office_converter import (
    docx_to_pdf,
    pptx_to_pdf,
    pptx_to_images,
    xlsx_to_csv,
    xlsx_to_pdf,
    csv_to_xlsx
)

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "File Converter API is running!"


@app.route("/convert/image", methods=["POST"])
def convert_image():

    file = request.files["file"]

    target_format = request.form.get("target")

    if not target_format:

        return {
            "error": "No target format was specified."
        }, 400


    try:

        output, extension = image_to_format(
            file,
            target_format
        )

    except ValueError as error:

        return {
            "error": str(error)
        }, 400


    mimetypes = {

        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
        "bmp": "image/bmp"

    }


    return send_file(

        output,

        mimetype=mimetypes[extension],

        as_attachment=True,

        download_name=f"converted.{extension}"

    )


@app.route("/convert/images-to-pdf", methods=["POST"])
def convert_images_to_pdf():

    files = request.files.getlist("files")

    if not files:
        return {"error": "No images were uploaded."}, 400

    output = images_to_pdf(files)

    return send_file(
        output,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="converted.pdf"
    )


@app.route("/convert/images", methods=["POST"])
def convert_images():

    files = request.files.getlist("files")
    target_format = request.form.get("target")

    if not files:
        return {"error": "No images were uploaded."}, 400

    if not target_format:
        return {"error": "No target format was specified."}, 400

    try:

        output = batch_convert_images(
            files,
            target_format
        )

    except ValueError as error:

        return {"error": str(error)}, 400

    return send_file(
        output,
        mimetype="application/zip",
        as_attachment=True,
        download_name="converted_images.zip"
    )

@app.route("/convert/pdf-to-images", methods=["POST"])
def convert_pdf_to_images():

    file = request.files.get("file")

    target_format = request.form.get(
        "target"
    )


    if not file:

        return {
            "error": "No PDF was uploaded."
        }, 400


    if not target_format:

        return {
            "error": "No target format was specified."
        }, 400


    try:

        output = pdf_to_images(
            file,
            target_format
        )

    except ValueError as error:

        return {
            "error": str(error)
        }, 400


    return send_file(
        output,
        mimetype="application/zip",
        as_attachment=True,
        download_name="combined.zip"
    )

@app.route("/convert/docx-to-pdf", methods=["POST"])
def convert_docx_to_pdf():

    file = request.files.get("file")

    if not file:
        return {
            "error": "No DOCX file was uploaded."
        }, 400

    try:

        output = docx_to_pdf(file)

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="converted.pdf"
    )

@app.route("/convert/pptx-to-pdf", methods=["POST"])
def convert_pptx_to_pdf():

    file = request.files.get("file")

    if not file:
        return {
            "error": "No PPTX file was uploaded."
        }, 400

    try:

        output = pptx_to_pdf(file)

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="converted.pdf"
    )

@app.route("/convert/pptx-to-images", methods=["POST"])
def convert_pptx_to_images():

    file = request.files.get("file")
    target_format = request.form.get("target")

    if not file:
        return {
            "error": "No PPTX file was uploaded."
        }, 400

    if not target_format:
        return {
            "error": "No image format was specified."
        }, 400

    try:

        output = pptx_to_images(
            file,
            target_format
        )

    except ValueError as error:

        return {
            "error": str(error)
        }, 400

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="application/zip",
        as_attachment=True,
        download_name="combined.zip"
    )

@app.route("/convert/xlsx-to-csv", methods=["POST"])
def convert_xlsx_to_csv():

    file = request.files.get("file")

    if not file:
        return {
            "error": "No XLSX file was uploaded."
        }, 400

    try:

        output = xlsx_to_csv(file)

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="text/csv",
        as_attachment=True,
        download_name="converted.csv"
    )

@app.route("/convert/xlsx-to-pdf", methods=["POST"])
def convert_xlsx_to_pdf():

    file = request.files.get("file")

    if not file:
        return {
            "error": "No XLSX file was uploaded."
        }, 400

    try:

        output = xlsx_to_pdf(file)

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="converted.pdf"
    )

@app.route("/convert/csv-to-xlsx", methods=["POST"])
def convert_csv_to_xlsx():

    file = request.files.get("file")

    if not file:
        return {
            "error": "No CSV file was uploaded."
        }, 400

    try:

        output = csv_to_xlsx(file)

    except Exception as error:

        return {
            "error": str(error)
        }, 500

    return send_file(
        output,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="converted.xlsx"
    )

if __name__ == "__main__":
    app.run(debug=True)