(function() {
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
    }

    function initButtonText() {
        var input = document.createElement('input'),
            button = document.querySelector('.upload-button-text');

        input.setAttribute('multiple', 'true');

        if (input.multiple === true && !qq.android()) {
            button.innerHTML = 'Select Files';
        }
        else {
            button.innerHTML = 'Select a File';
        }
    }

    function initDropZoneText() {
        var uploaderEl = document.querySelector('.qq-uploader');

        if (qq.supportedFeatures.folderDrop && !isTouchDevice()) {
            uploaderEl.setAttribute('qq-drop-area-text', 'Drop Files or Folders Here');
        }
        else if (qq.supportedFeatures.fileDrop && !isTouchDevice()) {
            uploaderEl.setAttribute('qq-drop-area-text', 'Drop Files Here');
        }
    }

    function openLargerPreview(uploader, modal, size, fileId) {
        uploader.drawThumbnail(fileId, new Image(), size).then(function(image) {
            largePreviewImg.src = image.src;
            modal.showModal();
        });
    }

    function closePreview(modal) {
        modal.close();
    }

    var largePreviewCloseBtn = document.querySelector('.large-preview-close-button'),
        largePreviewImg = document.querySelector('.large-preview-img'),
        previewDialog = document.querySelector('.large-preview'),
        uploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader'),
            request: {
                endpoint: 'http://fineuploader.com'
            },
            deleteFile: {
                endpoint: 'http://fineuploader.com',
                enabled: true
            },
            thumbnails: {
                placeholders: {
                    notAvailablePath: 'dependencies/fine-uploader/placeholders/not_available-generic.png',
                    waitingPath: 'dependencies/fine-uploader/placeholders/waiting-generic.png'
                }
            },
            display: {
                prependFiles: true
            },
            failedUploadTextDisplay: {
                mode: 'custom'
            },
            retry: {
                enableAuto: true
            },
            chunking: {
                enabled: true
            },
            resume: {
                enabled: true
            },
            callbacks: {
                // TODO make this one single delegated event handler
                onSubmitted: function(id) {
                    var fileEl = this.getItemByFileId(id),
                        thumbnailEl = fileEl.querySelector('.thumbnail-button');

                    thumbnailEl.addEventListener('click', function() {
                        openLargerPreview(uploader, previewDialog, 500, id);
                    });
                }
            }
        });

    initButtonText();
    initDropZoneText();

    dialogPolyfill.registerDialog(previewDialog);
    largePreviewCloseBtn.addEventListener('click', function() {
        closePreview(previewDialog)
    })
})();
