from PIL import Image
import io
import zipfile


def image_to_format(file, target_format):

    image = Image.open(file)

    target_format = target_format.upper()

    if target_format in ["JPG", "JPEG", "BMP"]:

        if image.mode != "RGB":
            image = image.convert("RGB")


    if target_format == "JPG":
        image_format = "JPEG"
        extension = "jpg"

    elif target_format == "JPEG":
        image_format = "JPEG"
        extension = "jpeg"

    elif target_format == "PNG":
        image_format = "PNG"
        extension = "png"

    elif target_format == "WEBP":
        image_format = "WEBP"
        extension = "webp"

    elif target_format == "BMP":
        image_format = "BMP"
        extension = "bmp"

    else:

        raise ValueError(
            "Unsupported image format"
        )


    output = io.BytesIO()

    image.save(
        output,
        format=image_format
    )

    output.seek(0)

    return output, extension


def images_to_pdf(files):

    images = []

    for file in files:

        image = Image.open(file)

        if image.mode != "RGB":
            image = image.convert("RGB")

        images.append(image)


    output = io.BytesIO()

    first_image = images[0]

    remaining_images = images[1:]


    first_image.save(
        output,
        format="PDF",
        save_all=True,
        append_images=remaining_images
    )


    output.seek(0)

    return output


def batch_convert_images(files, target_format):

    zip_buffer = io.BytesIO()

    target_format = target_format.upper()


    with zipfile.ZipFile(
        zip_buffer,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zip_file:


        for file in files:

            image = Image.open(file)

            original_name = file.filename

            name_without_extension = original_name.rsplit(
                ".",
                1
            )[0]


            if target_format in ["JPG", "JPEG", "BMP"]:

                if image.mode != "RGB":
                    image = image.convert("RGB")


            if target_format == "JPG":

                extension = "jpg"
                image_format = "JPEG"

            elif target_format == "JPEG":

                extension = "jpeg"
                image_format = "JPEG"

            elif target_format == "PNG":

                extension = "png"
                image_format = "PNG"

            elif target_format == "WEBP":

                extension = "webp"
                image_format = "WEBP"

            elif target_format == "BMP":

                extension = "bmp"
                image_format = "BMP"

            else:

                raise ValueError(
                    "Unsupported image format"
                )


            output = io.BytesIO()


            image.save(
                output,
                format=image_format
            )


            output.seek(0)


            converted_name = (
                f"{name_without_extension}.{extension}"
            )


            zip_file.writestr(
                converted_name,
                output.getvalue()
            )


    zip_buffer.seek(0)

    return zip_buffer