const BACKEND_URL = "https://vexora-backend-9v12.onrender.com";

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const fileSection = document.getElementById("fileSection");
const fileList = document.getElementById("fileList");
const conversionSection = document.getElementById("conversionSection");
const formatSelect = document.getElementById("formatSelect");
const convertButton = document.getElementById("convertButton");
const status = document.getElementById("status");

let selectedFiles = [];


const conversions = {
    png: ["JPG", "JPEG", "WEBP", "BMP", "PDF"],
    jpg: ["PNG", "JPEG", "WEBP", "BMP", "PDF"],
    jpeg: ["JPG", "PNG", "WEBP", "BMP", "PDF"],
    webp: ["JPG", "JPEG", "PNG", "BMP", "PDF"],
    bmp: ["JPG", "JPEG", "PNG", "WEBP", "PDF"],
    pdf: ["JPG", "PNG", "JPEG"],
    docx: ["PDF"],
    pptx: ["PDF", "PNG", "JPG"],
    xlsx: ["PDF", "CSV"],
    csv: ["XLSX"]
};


/* =========================
   FILE SELECTION
========================= */

fileInput.addEventListener("change", function () {

    const files = Array.from(fileInput.files);

    if (files.length === 0) {
        return;
    }

    selectedFiles.push(...files);

    displayFiles();
    updateConversionOptions();

    fileInput.value = "";
});


/* =========================
   DISPLAY FILES
========================= */

function displayFiles() {

    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const fileItem =
            document.createElement("div");

        fileItem.className = "file-item";

        fileItem.innerHTML = `
            <div class="file-name">
                ${file.name}
            </div>

            <button
                class="remove-file"
                onclick="removeFile(${index})"
            >
                ✕
            </button>
        `;

        fileList.appendChild(fileItem);
    });


    if (selectedFiles.length > 0) {

        fileSection.classList.remove("hidden");

    } else {

        fileSection.classList.add("hidden");
    }
}


/* =========================
   REMOVE FILE
========================= */

function removeFile(index) {

    selectedFiles.splice(index, 1);

    displayFiles();
    updateConversionOptions();

    if (selectedFiles.length === 0) {

        conversionSection.classList.add("hidden");

        status.textContent = "";
    }
}


/* =========================
   GET FILE EXTENSION
========================= */

function getExtension(filename) {

    return filename
        .split(".")
        .pop()
        .toLowerCase();
}


/* =========================
   UPDATE CONVERSION OPTIONS
========================= */

function updateConversionOptions() {

    formatSelect.innerHTML = "";

    if (selectedFiles.length === 0) {

        conversionSection.classList.add("hidden");

        return;
    }


    /* =========================
       MULTIPLE FILES
    ========================= */

    if (selectedFiles.length > 1) {

        const extensions =
            selectedFiles.map(file =>
                getExtension(file.name)
            );


        const allImages =
            extensions.every(ext =>
                [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "bmp"
                ].includes(ext)
            );


        if (allImages) {

            /* Images → PDF */

            const pdfOption =
                document.createElement("option");

            pdfOption.value = "PDF";
            pdfOption.textContent = "PDF";

            formatSelect.appendChild(pdfOption);


            /* Images → Image ZIP */

            const imageFormats = [
                "JPG",
                "JPEG",
                "PNG",
                "WEBP",
                "BMP"
            ];


            imageFormats.forEach(format => {

                const option =
                    document.createElement("option");

                option.value = format;

                option.textContent =
                    `${format} (ZIP)`;

                formatSelect.appendChild(option);
            });


            conversionSection.classList.remove(
                "hidden"
            );

            return;
        }


        status.textContent =
            "Multiple files are currently supported only for images.";

        conversionSection.classList.add(
            "hidden"
        );

        return;
    }


    /* =========================
       SINGLE FILE
    ========================= */

    const extension =
        getExtension(selectedFiles[0].name);


    const availableConversions =
        conversions[extension];


    if (!availableConversions) {

        status.textContent =
            "This file type is not supported.";

        conversionSection.classList.add(
            "hidden"
        );

        return;
    }


    availableConversions.forEach(format => {

        const option =
            document.createElement("option");

        option.value = format;
        option.textContent = format;

        formatSelect.appendChild(option);
    });


    conversionSection.classList.remove(
        "hidden"
    );

    status.textContent = "";
}


/* =========================
   CONVERSION
========================= */

convertButton.addEventListener(
    "click",
    async function () {

        if (selectedFiles.length === 0) {
            return;
        }


        const targetFormat =
            formatSelect.value.toUpperCase();


        convertButton.disabled = true;

        convertButton.textContent =
            "Converting...";

        status.textContent =
            "Converting your file...";


        try {

            /* =========================
               MULTIPLE IMAGE FILES
            ========================= */

            if (selectedFiles.length > 1) {

                const formData =
                    new FormData();


                selectedFiles.forEach(file => {

                    formData.append(
                        "files",
                        file
                    );
                });


                let endpoint;


                /* Images → PDF */

                if (targetFormat === "PDF") {

                    endpoint =
                        `${BACKEND_URL}/convert/images-to-pdf`;

                }

                /* Images → Image ZIP */

                else {

                    endpoint =
                        `${BACKEND_URL}/convert/images`;

                    formData.append(
                        "target",
                        targetFormat
                    );
                }


                const response =
                    await fetch(
                        endpoint,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Server response:",
                        errorText
                    );

                    throw new Error(
                        "Conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                if (targetFormat === "PDF") {

                    downloadBlob(
                        blob,
                        "converted_images.pdf"
                    );

                } else {

                    downloadBlob(
                        blob,
                        `converted_images_${targetFormat.toLowerCase()}.zip`
                    );
                }


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               SINGLE FILE
            ========================= */

            const file =
                selectedFiles[0];


            const extension =
                getExtension(file.name);


            const formData =
                new FormData();


            /* =========================
               DOCX → PDF
            ========================= */

            if (
                extension === "docx" &&
                targetFormat === "PDF"
            ) {

                formData.append(
                    "file",
                    file
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/docx-to-pdf`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "DOCX conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "pdf"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               PPTX → PDF
            ========================= */

            if (
                extension === "pptx" &&
                targetFormat === "PDF"
            ) {

                formData.append(
                    "file",
                    file
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/pptx-to-pdf`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "PPTX conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "pdf"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               PPTX → IMAGES
            ========================= */

            if (
                extension === "pptx" &&
                (
                    targetFormat === "PNG" ||
                    targetFormat === "JPG"
                )
            ) {

                formData.append(
                    "file",
                    file
                );


                formData.append(
                    "target",
                    targetFormat
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/pptx-to-images`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Server response:",
                        errorText
                    );

                    throw new Error(
                        "PPTX conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    `${replaceExtension(
                        file.name,
                        ""
                    )}${targetFormat.toLowerCase()}_slides.zip`
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               XLSX → CSV
            ========================= */

            if (
                extension === "xlsx" &&
                targetFormat === "CSV"
            ) {

                formData.append(
                    "file",
                    file
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/xlsx-to-csv`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "XLSX conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "csv"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               XLSX → PDF
            ========================= */

            if (
                extension === "xlsx" &&
                targetFormat === "PDF"
            ) {

                formData.append(
                    "file",
                    file
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/xlsx-to-pdf`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "XLSX conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "pdf"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               CSV → XLSX
            ========================= */

            if (
                extension === "csv" &&
                targetFormat === "XLSX"
            ) {

                formData.append(
                    "file",
                    file
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/csv-to-xlsx`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "CSV conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "xlsx"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               IMAGE → PDF
            ========================= */

            if (
                [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "bmp"
                ].includes(extension) &&
                targetFormat === "PDF"
            ) {

                formData.append(
                    "file",
                    file
                );


                /*
                    IMPORTANT:
                    Flask expects:
                    request.form.get("target")
                */

                formData.append(
                    "target",
                    targetFormat
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/image`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Server response:",
                        errorText
                    );

                    throw new Error(
                        "Image conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        "pdf"
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               IMAGE → IMAGE
            ========================= */

            if (
                [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "bmp"
                ].includes(extension)
            ) {

                formData.append(
                    "file",
                    file
                );


                formData.append(
                    "target",
                    targetFormat
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/image`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Server response:",
                        errorText
                    );

                    throw new Error(
                        "Image conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    replaceExtension(
                        file.name,
                        targetFormat.toLowerCase()
                    )
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            /* =========================
               PDF → IMAGES
            ========================= */

            if (
                extension === "pdf"
            ) {

                formData.append(
                    "file",
                    file
                );


                formData.append(
                    "target",
                    targetFormat
                );


                const response =
                    await fetch(
                        `${BACKEND_URL}/convert/pdf-to-images`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Server response:",
                        errorText
                    );

                    throw new Error(
                        "PDF conversion failed."
                    );
                }


                const blob =
                    await response.blob();


                downloadBlob(
                    blob,
                    `${replaceExtension(
                        file.name,
                        ""
                    )}${targetFormat.toLowerCase()}_pages.zip`
                );


                status.textContent =
                    "Conversion completed successfully.";

                return;
            }


            throw new Error(
                "This conversion is not supported."
            );


        } catch (error) {

            console.error(
                error
            );

            status.textContent =
                error.message ||
                "Something went wrong during conversion.";

        } finally {

            convertButton.disabled = false;

            convertButton.textContent =
                "Convert";
        }
    }
);


/* =========================
   REPLACE EXTENSION
========================= */

function replaceExtension(
    filename,
    newExtension
) {

    const lastDot =
        filename.lastIndexOf(".");


    if (lastDot === -1) {

        return newExtension
            ? `${filename}.${newExtension}`
            : filename;
    }


    const baseName =
        filename.substring(
            0,
            lastDot
        );


    return newExtension
        ? `${baseName}.${newExtension}`
        : baseName;
}


/* =========================
   DOWNLOAD FILE
========================= */

function downloadBlob(
    blob,
    filename
) {

    const url =
        window.URL.createObjectURL(
            blob
        );


    const link =
        document.createElement("a");


    link.href = url;
    link.download = filename;


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    window.URL.revokeObjectURL(
        url
    );
}


/* =========================
   DRAG AND DROP
========================= */

uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "drag-active"
        );
    }
);


uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.classList.remove(
            "drag-active"
        );
    }
);


uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove(
            "drag-active"
        );


        const files =
            Array.from(
                event.dataTransfer.files
            );


        if (files.length === 0) {
            return;
        }


        selectedFiles.push(
            ...files
        );


        displayFiles();

        updateConversionOptions();
    }
);