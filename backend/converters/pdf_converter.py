import fitz
import io
import zipfile


def pdf_to_images(file, target_format):

    pdf_data = file.read()

    document = fitz.open(
        stream=pdf_data,
        filetype="pdf"
    )

    target_format = target_format.upper()

    if target_format == "JPG":
        extension = "jpg"
        image_format = "jpeg"

    elif target_format == "JPEG":
        extension = "jpeg"
        image_format = "jpeg"

    elif target_format == "PNG":
        extension = "png"
        image_format = "png"

    elif target_format == "WEBP":
        extension = "webp"
        image_format = "webp"

    else:
        raise ValueError(
            "Unsupported image format"
        )


    zip_buffer = io.BytesIO()


    with zipfile.ZipFile(
        zip_buffer,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zip_file:

        for page_number in range(
            len(document)
        ):

            page = document[
                page_number
            ]

            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(2, 2),
                alpha=False
            )


            image_bytes = pixmap.tobytes(
                image_format
            )


            filename = (
                f"page_{page_number + 1}."
                f"{extension}"
            )


            zip_file.writestr(
                filename,
                image_bytes
            )


    document.close()

    zip_buffer.seek(0)

    return zip_buffer