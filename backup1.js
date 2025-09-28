// ==UserScript==
// @name         Instagram Profile Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download all images from Instagram profile with specific classes
// @author       You
// @match        https://www.instagram.com/*
// @grant        GM_download
// @grant        GM_addStyle
// ==/UserScript==
// save icon in each post


(function() {
    'use strict';

    // Add styles for the download button
    GM_addStyle(`
        #instagram-downloader-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #405de6;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        #instagram-downloader-btn:hover {
            background: #3b57d6;
        }

        #download-progress {
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 9999;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            display: none;
        }

        .individual-download-icon {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 32px;
            height: 32px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            opacity: 1;
            font-size: 16px;
        }

        .individual-download-icon:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }

        div._aagv {
            position: relative !important;
        }

        div._aagw:hover .individual-download-icon {
            opacity: 1;
        }
    `);

    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'instagram-downloader-btn';
    downloadBtn.textContent = 'Download Images';
    document.body.appendChild(downloadBtn);

    // Create progress indicator
    const progressDiv = document.createElement('div');
    progressDiv.id = 'download-progress';
    document.body.appendChild(progressDiv);

    let downloadCount = 0;
    let isDownloading = false;
    let addedIcons = new Set(); // Track which divs already have download icons

    // Function to download a single image
    async function downloadSingleImage(img, divElement) {
        const imageUrl = extractImageUrl(img);
        if (!imageUrl) {
            alert('Could not extract image URL');
            return;
        }

        const altText = img.alt || img.getAttribute('alt') || '';
        downloadCount++;
        const filename = generateFilenameFromAlt(altText, downloadCount);

        try {
            GM_download(imageUrl, filename);

            // Visual feedback
            const icon = divElement.querySelector('.individual-download-icon');
            const originalBg = icon.style.background;
            icon.style.background = 'rgba(0, 128, 0, 0.8)';
            setTimeout(() => {
                icon.style.background = originalBg;
            }, 1000);

            console.log(`Downloaded: ${filename}`);
        } catch (error) {
            console.error('Failed to download image:', error);
            alert('Failed to download image');
        }
    }

    // Function to create and add download icon to a div
    function addDownloadIcon(divElement) {
        // Check if icon already exists or div is already tracked
        if (divElement.querySelector('.individual-download-icon') || addedIcons.has(divElement)) {
            return;
        }

        // Find the target image within this div
        const img = divElement.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
        if (!img) {
            return; // No target image found
        }

        // Create download icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'individual-download-icon';
        iconContainer.title = 'Download this image';
        iconContainer.textContent = '💾'; // Use disk emoji

        // Add click event
        iconContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await downloadSingleImage(img, divElement);
        });

        divElement.appendChild(iconContainer);
        addedIcons.add(divElement);
    }

    // Function to add download icons to all visible div._aagv elements
    function addDownloadIconsToVisibleDivs() {
        const targetDivs = document.querySelectorAll('div._aagv');
        targetDivs.forEach(div => {
            addDownloadIcon(div);
        });
    }

    // Function to continuously monitor and add icons to new divs
    function startIconMonitoring() {
        // Initial addition
        addDownloadIconsToVisibleDivs();

        // Set up observer for new content
        const observer = new MutationObserver((mutations) => {
            let shouldCheckForNewDivs = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheckForNewDivs = true;
                }
            });

            if (shouldCheckForNewDivs) {
                setTimeout(addDownloadIconsToVisibleDivs, 500); // Small delay to ensure content is rendered
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check periodically for any missed divs
        setInterval(addDownloadIconsToVisibleDivs, 3000);
    }

    // Function to wait for a specified time
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to scroll to load more content
    async function scrollToLoadMore() {
        const initialHeight = document.body.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);

        // Wait for potential new content to load
        await delay(3000);

        const newHeight = document.body.scrollHeight;
        return newHeight > initialHeight;
    }

    // Function to collect and download new images from current viewport
    async function collectAndDownloadNewImages(downloadedUrls) {
        const targetDivs = document.querySelectorAll('div._aagv');
        let newImagesDownloaded = 0;

        for (const div of targetDivs) {
            const images = div.querySelectorAll('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');

            for (const img of images) {
                const imageUrl = extractImageUrl(img);
                if (imageUrl && !downloadedUrls.has(imageUrl)) {
                    // Mark as downloaded to avoid duplicates
                    downloadedUrls.add(imageUrl);

                    // Generate filename
                    const altText = img.alt || img.getAttribute('alt') || '';
                    const filename = generateFilenameFromAlt(altText, downloadCount + 1);

                    try {
                        // Download immediately
                        GM_download(imageUrl, filename);
                        downloadCount++;
                        newImagesDownloaded++;

                        // Update progress
                        progressDiv.textContent = `Downloaded ${downloadCount} images - ${filename}`;

                        // Small delay to avoid overwhelming the browser
                        await delay(300);
                    } catch (error) {
                        console.error(`Failed to download image:`, error);
                    }
                }
            }
        }

        return newImagesDownloaded;
    }

    // Function to scroll and download images simultaneously
    async function scrollAndDownloadImages() {
        const downloadedUrls = new Set(); // Track downloaded URLs to avoid duplicates
        let hasMoreContent = true;
        let noNewImagesCount = 0;
        let noNewContentCount = 0;
        let scrollAttempts = 0;

        // Download images from the initial viewport
        await collectAndDownloadNewImages(downloadedUrls);

        while (hasMoreContent && noNewImagesCount < 5 && noNewContentCount < 5) {
            const beforeHeight = document.body.scrollHeight;
            const beforeDownloadCount = downloadCount;

            // Scroll down
            window.scrollTo(0, document.body.scrollHeight);
            scrollAttempts++;

            // Wait for content to load
            await delay(2000);

            // Download new images that appeared
            const newImages = await collectAndDownloadNewImages(downloadedUrls);

            const afterHeight = document.body.scrollHeight;
            const afterDownloadCount = downloadCount;

            // Check if we found new content or images
            if (afterHeight > beforeHeight) {
                noNewContentCount = 0; // Reset counter if new content appeared
            } else {
                noNewContentCount++;
            }

            if (afterDownloadCount > beforeDownloadCount) {
                noNewImagesCount = 0; // Reset counter if new images were downloaded
            } else {
                noNewImagesCount++;
            }

            // Update progress
            progressDiv.textContent = `Scrolling and downloading... Found ${downloadCount} images (attempt ${scrollAttempts})`;

            // Check if we've reached the end
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
                if (noNewContentCount >= 3 && noNewImagesCount >= 3) {
                    hasMoreContent = false;
                }
            }
        }

        // Final attempt to collect any remaining images
        await delay(2000);
        await collectAndDownloadNewImages(downloadedUrls);

        return { totalDownloaded: downloadCount, scrollAttempts };
    }

    // Function to extract image URL from various Instagram formats
    function extractImageUrl(img) {
        // Try to get the highest quality image URL
        if (img.src) {
            return img.src;
        } else if (img.dataset && img.dataset.src) {
            return img.dataset.src;
        } else if (img.getAttribute('data-src')) {
            return img.getAttribute('data-src');
        }
        return null;
    }

    // Function to generate filename from alt text and index
    function generateFilenameFromAlt(altText, index) {
        let filename = `image-${index}-`;

        if (altText) {
            // Extract meaningful part from alt text
            // Remove common prefixes like "Photo by username on"
            let cleanAlt = altText.replace(/^Photo by [^']+ on /, '');

            // Clean up the text for filename (remove invalid characters)
            cleanAlt = cleanAlt.replace(/[<>:"/\\|?*]/g, '').trim();

            // Limit length to avoid very long filenames
            if (cleanAlt.length > 100) {
                cleanAlt = cleanAlt.substring(0, 100) + '...';
            }

            filename += cleanAlt;
        } else {
            // Fallback if no alt text
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename += timestamp;
        }

        return filename + '.jpg'; // Add extension
    }

    // Function to find and download images
    async function findAndDownloadImages() {
        if (isDownloading) {
            alert('Download already in progress!');
            return;
        }

        isDownloading = true;
        downloadCount = 0; // Reset counter
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Starting simultaneous scroll and download...';

        try {
            // Scroll and download images simultaneously
            const { totalDownloaded, scrollAttempts } = await scrollAndDownloadImages();

            progressDiv.textContent = `Download complete! Successfully downloaded ${totalDownloaded} images after ${scrollAttempts} scroll attempts.`;

            if (totalDownloaded === 0) {
                progressDiv.textContent = 'No images found with the specified classes. Make sure you are on an Instagram profile page.';
            }

            await delay(5000);
            progressDiv.style.display = 'none';

        } catch (error) {
            console.error('Error during download process:', error);
            progressDiv.textContent = 'Error occurred during download process';
            await delay(3000);
            progressDiv.style.display = 'none';
        }

        isDownloading = false;
    }

    // Add click event to download button
    downloadBtn.addEventListener('click', findAndDownloadImages);

    // Optional: Add keyboard shortcut (Ctrl + Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            findAndDownloadImages();
        }
    });

    // Start monitoring for new divs and adding download icons
    setTimeout(startIconMonitoring, 2000); // Wait a bit for page to load

    console.log('Instagram Image Downloader script loaded. Individual download icons will appear on hover. Click the button or press Ctrl+Shift+D to start bulk downloading.');

})();