const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const fileSection = document.getElementById("fileSection");
const fileList = document.getElementById("fileList");
const conversionSection = document.getElementById("conversionSection");
const formatSelect = document.getElementById("formatSelect");
const convertButton = document.getElementById("convertButton");
const status = document.getElementById("status");


// ========================================
// SELECTED FILES
// ========================================

let selectedFiles = [];


// ========================================
// SUPPORTED CONVERSIONS
// ========================================

const conversions = {

    // Image formats

    png: [
        "JPG",
        "JPEG",
        "WEBP",
        "BMP",
        "PDF"
    ],

    jpg: [
        "PNG",
        "JPEG",
        "WEBP",
        "BMP",
        "PDF"
    ],

    jpeg: [
        "JPG",
        "PNG",
        "WEBP",
        "BMP",
        "PDF"
    ],

    webp: [
        "JPG",
        "JPEG",
        "PNG",
        "BMP",
        "PDF"
    ],

    bmp: [
        "JPG",
        "JPEG",
        "PNG",
        "WEBP",
        "PDF"
    ],


    // PDF

    pdf: [
        "JPG",
        "PNG",
        "JPEG"
    ],


    // Office documents

    docx: [
        "PDF"
    ],

    pptx: [
        "PDF",
        "PNG",
        "JPG"
    ],

    xlsx: [
        "PDF",
        "CSV"
    ],


    // Text / Data

    csv: [
        "XLSX"
    ]

};


// ========================================
// FILE SELECTION
// ========================================

fileInput.addEventListener("change", () => {

    const newFiles = Array.from(fileInput.files);

    if (newFiles.length === 0) {
        return;
    }

    selectedFiles.push(...newFiles);

    displayFiles();

    updateConversionOptions();

    fileInput.value = "";

});


// ========================================
// GET FILE EXTENSION
// ========================================

function getFileExtension(filename) {

    const parts = filename.split(".");

    return parts[parts.length - 1].toLowerCase();

}


// ========================================
// DISPLAY FILES
// ========================================

function displayFiles() {

    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `
            <span>
                ${index + 1}. ${file.name}
            </span>

            <span>
                ${formatFileSize(file.size)}

                <button
                    class="remove-button"
                    onclick="removeFile(${index})">
                    ✕
                </button>
            </span>
        `;

        fileList.appendChild(item);

    });

    fileSection.classList.remove("hidden");

}


// ========================================
// REMOVE FILE
// ========================================

function removeFile(index) {

    selectedFiles.splice(index, 1);

    if (selectedFiles.length === 0) {

        fileSection.classList.add("hidden");

        conversionSection.classList.add("hidden");

        status.textContent = "";

        fileList.innerHTML = "";

        return;
    }

    displayFiles();

    updateConversionOptions();

}


// ========================================
// FORMAT FILE SIZE
// ========================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }

    return (
        bytes / (1024 * 1024)
    ).toFixed(1) + " MB";

}


// ========================================
// UPDATE CONVERSION OPTIONS
// ========================================

function updateConversionOptions() {

    formatSelect.innerHTML = "";

    const extensions = selectedFiles.map(file =>
        getFileExtension(file.name)
    );


    // Check whether every selected file is an image

    const allImages = extensions.every(extension =>
        [
            "png",
            "jpg",
            "jpeg",
            "webp",
            "bmp"
        ].includes(extension)
    );


    // ========================================
    // MULTIPLE IMAGES
    // ========================================

    if (
        selectedFiles.length > 1 &&
        allImages
    ) {

        addOption("JPG");
        addOption("JPEG");
        addOption("PNG");
        addOption("WEBP");
        addOption("BMP");
        addOption("PDF");

    }


    // ========================================
    // SINGLE FILE
    // ========================================

    else if (
        selectedFiles.length === 1
    ) {

        const extension = extensions[0];

        if (conversions[extension]) {

            conversions[extension].forEach(format => {

                addOption(format);

            });

        }

        else {

            addOption("Unsupported");

        }

    }


    // ========================================
    // MIXED FILE TYPES
    // ========================================

    else {

        addOption("Unsupported");

    }


    conversionSection.classList.remove("hidden");

}


// ========================================
// ADD DROPDOWN OPTION
// ========================================

function addOption(format) {

    const option = document.createElement("option");

    option.value = format;

    option.textContent = format;

    formatSelect.appendChild(option);

}


// ========================================
// CONVERT FILES
// ========================================

convertButton.addEventListener("click", async () => {

    if (selectedFiles.length === 0) {

        status.textContent =
            "Please select at least one file.";

        return;
    }


    const selectedFormat =
        formatSelect.value;


    status.textContent =
        "Converting...";

    convertButton.disabled = true;


    try {

        const formData =
            new FormData();

        let endpoint;

        let downloadName;


        // ========================================
        // GET FILE EXTENSION
        // ========================================

        const firstFileExtension =
            getFileExtension(
                selectedFiles[0].name
            );


        // ========================================
        // SINGLE DOCX → PDF
        // ========================================

        if (
            selectedFiles.length === 1 &&
            firstFileExtension === "docx" &&
            selectedFormat === "PDF"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/docx-to-pdf";

            formData.append(
                "file",
                selectedFiles[0]
            );

            const originalName =
                selectedFiles[0].name;

            const nameWithoutExtension =
                originalName.substring(
                    0,
                    originalName.lastIndexOf(".")
                );

            downloadName =
                `${nameWithoutExtension}.pdf`;
        }    
        

        // ========================================
        // SINGLE PPTX → PDF
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "pptx" &&
            selectedFormat === "PDF"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/pptx-to-pdf";

            formData.append(
                "file",
                selectedFiles[0]
            );

            const originalName =
                selectedFiles[0].name;

            const nameWithoutExtension =
                originalName.substring(
                    0,
                    originalName.lastIndexOf(".")
                );

            downloadName =
                `${nameWithoutExtension}.pdf`;
        }


        // ========================================
        // SINGLE PPTX → IMAGE
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "pptx" &&
            (
                selectedFormat === "JPG" ||
                selectedFormat === "PNG"
            )
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/pptx-to-images";

            formData.append(
                "file",
                selectedFiles[0]
            );

            formData.append(
                "target",
                selectedFormat
            );

            downloadName =
                "combined.zip";
        }


        // ========================================
        // SINGLE XLSX → CSV
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "xlsx" &&
            selectedFormat === "CSV"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/xlsx-to-csv";

            formData.append(
                "file",
                selectedFiles[0]
            );

            const originalName =
                selectedFiles[0].name;

            const nameWithoutExtension =
                originalName.substring(
                    0,
                    originalName.lastIndexOf(".")
                );

            downloadName =
                `${nameWithoutExtension}.csv`;
        }


        // ========================================
        // SINGLE XLSX → PDF
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "xlsx" &&
            selectedFormat === "PDF"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/xlsx-to-pdf";

            formData.append(
                "file",
                selectedFiles[0]
            );

            const originalName =
                selectedFiles[0].name;

            const nameWithoutExtension =
                originalName.substring(
                    0,
                    originalName.lastIndexOf(".")
                );

            downloadName =
                `${nameWithoutExtension}.pdf`;
        }


        // ========================================
        // SINGLE CSV → XLSX
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "csv" &&
            selectedFormat === "XLSX"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/csv-to-xlsx";

            formData.append(
                "file",
                selectedFiles[0]
            );

            const originalName =
                selectedFiles[0].name;

            const nameWithoutExtension =
                originalName.substring(
                    0,
                    originalName.lastIndexOf(".")
                );

            downloadName =
                `${nameWithoutExtension}.xlsx`;
        }

            
        // ========================================
        // SINGLE IMAGE
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            [
                "png",
                "jpg",
                "jpeg",
                "webp",
                "bmp"
            ].includes(firstFileExtension)
        ) {

            // IMAGE → PDF

            if (selectedFormat === "PDF") {

                endpoint =
                    "http://127.0.0.1:5000/convert/images-to-pdf";


                formData.append(
                    "files",
                    selectedFiles[0]
                );


                const originalName =
                    selectedFiles[0].name;


                const nameWithoutExtension =
                    originalName.substring(
                        0,
                        originalName.lastIndexOf(".")
                    );


                downloadName =
                    `${nameWithoutExtension}.pdf`;

            }


            // IMAGE → IMAGE

            else {

                endpoint =
                    "http://127.0.0.1:5000/convert/image";


                formData.append(
                    "file",
                    selectedFiles[0]
                );


                formData.append(
                    "target",
                    selectedFormat
                );


                const originalName =
                    selectedFiles[0].name;


                const nameWithoutExtension =
                    originalName.substring(
                        0,
                        originalName.lastIndexOf(".")
                    );


                downloadName =
                    `${nameWithoutExtension}.${selectedFormat.toLowerCase()}`;

            }

        }


        // ========================================
        // SINGLE PDF → IMAGE
        // ========================================

        else if (
            selectedFiles.length === 1 &&
            firstFileExtension === "pdf" &&
            [
                "JPG",
                "JPEG",
                "PNG",
                "WEBP"
            ].includes(selectedFormat)
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/pdf-to-images";


            formData.append(
                "file",
                selectedFiles[0]
            );


            formData.append(
                "target",
                selectedFormat
            );


            downloadName =
                "combined.zip";

        }


        // ========================================
        // MULTIPLE IMAGES → PDF
        // ========================================

        else if (
            selectedFiles.length > 1 &&
            selectedFormat === "PDF"
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/images-to-pdf";


            selectedFiles.forEach(file => {

                formData.append(
                    "files",
                    file
                );

            });


            downloadName =
                "combined.pdf";

        }


        // ========================================
        // MULTIPLE IMAGES → IMAGE FORMAT
        // ========================================

        else if (
            selectedFiles.length > 1 &&
            [
                "JPG",
                "JPEG",
                "PNG",
                "WEBP",
                "BMP"
            ].includes(selectedFormat)
        ) {

            endpoint =
                "http://127.0.0.1:5000/convert/images";


            selectedFiles.forEach(file => {

                formData.append(
                    "files",
                    file
                );

            });


            formData.append(
                "target",
                selectedFormat
            );


            downloadName =
                "combined.zip";

        }


        // ========================================
        // NOT IMPLEMENTED YET
        // ========================================

        else {

            status.textContent =
                "This conversion is not implemented yet.";

            convertButton.disabled = false;

            return;

        }


        // ========================================
        // SEND REQUEST
        // ========================================

        const response =
            await fetch(
                endpoint,
                {
                    method: "POST",
                    body: formData
                }
            );


        // ========================================
        // HANDLE ERROR
        // ========================================

        if (!response.ok) {

            let errorMessage =
                "Conversion failed.";


            try {

                const errorData =
                    await response.json();


                errorMessage =
                    errorData.error ||
                    errorMessage;

            }

            catch {

                // Server did not return JSON

            }


            throw new Error(
                errorMessage
            );

        }


        // ========================================
        // DOWNLOAD RESULT
        // ========================================

        const blob =
            await response.blob();


        const downloadUrl =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            downloadUrl;


        link.download =
            downloadName;


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(
            downloadUrl
        );


        status.textContent =
            "Conversion complete!";


    }

    catch (error) {

        console.error(error);

        status.textContent =
            "Error: " + error.message;

    }

    finally {

        convertButton.disabled =
            false;

    }

});


// ========================================
// DRAG AND DROP
// ========================================


// Prevent browser from opening dropped files

[
    "dragenter",
    "dragover",
    "dragleave",
    "drop"
].forEach(eventName => {

    uploadArea.addEventListener(
        eventName,
        event => {

            event.preventDefault();

            event.stopPropagation();

        }
    );

});


// Highlight upload area

[
    "dragenter",
    "dragover"
].forEach(eventName => {

    uploadArea.addEventListener(
        eventName,
        () => {

            uploadArea.classList.add(
                "drag-active"
            );

        }
    );

});


// Remove highlight

[
    "dragleave",
    "drop"
].forEach(eventName => {

    uploadArea.addEventListener(
        eventName,
        () => {

            uploadArea.classList.remove(
                "drag-active"
            );

        }
    );

});


// Handle dropped files

uploadArea.addEventListener(
    "drop",
    event => {

        const droppedFiles =
            Array.from(
                event.dataTransfer.files
            );


        if (droppedFiles.length === 0) {
            return;
        }


        selectedFiles.push(
            ...droppedFiles
        );


        displayFiles();

        updateConversionOptions();

    }
);