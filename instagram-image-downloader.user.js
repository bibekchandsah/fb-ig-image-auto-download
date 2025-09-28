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

    // Add styles for the download button and terminal UI
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

        #terminal-toggle-btn {
            position: fixed;
            top: 10px;
            right: 180px;
            z-index: 9999;
            background: #333;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-size: 16px;
        }

        #terminal-toggle-btn:hover {
            background: #444;
        }

        #terminal-console {
            position: fixed;
            bottom: -300px;
            left: 0;
            right: 0;
            height: 300px;
            background: #1e1e1e;
            border-top: 2px solid #333;
            z-index: 9998;
            transition: bottom 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        #terminal-console.show {
            bottom: 0;
        }

        #terminal-header {
            background: #333;
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #terminal-close {
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #terminal-close:hover {
            color: white;
        }

        #terminal-content {
            flex: 1;
            background: #1e1e1e;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 16px;
            overflow-y: auto;
            white-space: pre-wrap;
            line-height: 1.4;
        }

        #terminal-content::-webkit-scrollbar {
            width: 8px;
        }

        #terminal-content::-webkit-scrollbar-track {
            background: #2d2d2d;
        }

        #terminal-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        #terminal-content::-webkit-scrollbar-thumb:hover {
            background: #777;
        }

        .log-info {
            color: #00ff00;
        }

        .log-success {
            color: #00ff00;
            font-weight: bold;
        }

        .log-error {
            color: #ff4444;
            font-weight: bold;
        }

        .log-warning {
            color: #ffaa00;
        }

        .log-progress {
            color: #44aaff;
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

        .notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            min-width: 300px;
            animation: fadeInOut 3s ease-in-out;
        }

        .notification.error {
            background: rgba(220, 53, 69, 0.9);
            border: 2px solid #dc3545;
        }

        .notification.warning {
            background: rgba(255, 193, 7, 0.9);
            border: 2px solid #ffc107;
            color: #000;
        }

        .notification.info {
            background: #20a464e6;
            border: 2px solid #00ff73ff;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
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

        div.x5yr21d.x1n2onr6.xh8yej3 {
            position: relative !important;
        }

        div._aagw:hover .individual-download-icon {
            opacity: 1;
        }

        div.x5yr21d.x1n2onr6.xh8yej3:hover .individual-download-icon {
            opacity: 1;
        }
    `);

    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'instagram-downloader-btn';
    downloadBtn.textContent = 'Download Images';
    document.body.appendChild(downloadBtn);

    // Create terminal toggle button
    const terminalToggleBtn = document.createElement('button');
    terminalToggleBtn.id = 'terminal-toggle-btn';
    terminalToggleBtn.textContent = '⬇️';
    terminalToggleBtn.title = 'Toggle Terminal Console';
    document.body.appendChild(terminalToggleBtn);

    // Create terminal console
    const terminalConsole = document.createElement('div');
    terminalConsole.id = 'terminal-console';

    const terminalHeader = document.createElement('div');
    terminalHeader.id = 'terminal-header';
    terminalHeader.innerHTML = `
        <span>Instagram Downloader Terminal</span>
        <button id="terminal-close">×</button>
    `;

    const terminalContent = document.createElement('div');
    terminalContent.id = 'terminal-content';
    terminalContent.textContent = 'Terminal initialized. Ready for operations...\n';

    terminalConsole.appendChild(terminalHeader);
    terminalConsole.appendChild(terminalContent);
    document.body.appendChild(terminalConsole);

    // Create progress indicator
    const progressDiv = document.createElement('div');
    progressDiv.id = 'download-progress';
    document.body.appendChild(progressDiv);

    let downloadCount = 0;
    let isDownloading = false;
    let addedIcons = new Set(); // Track which divs already have download icons
    let terminalVisible = false;

    // Notification system
    function showNotification(message, type = 'info', duration = 3000) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);

        return notification;
    }

    // Terminal logging functions
    function logToTerminal(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = `[${timestamp}] ${message}\n`;

        const content = document.getElementById('terminal-content');
        const logElement = document.createElement('span');
        logElement.className = `log-${type}`;
        logElement.textContent = logLine;

        content.appendChild(logElement);
        content.scrollTop = content.scrollHeight;
    }

    function clearTerminal() {
        const content = document.getElementById('terminal-content');
        content.innerHTML = '';
        logToTerminal('Terminal cleared', 'info');
    }

    // Terminal toggle functionality
    function toggleTerminal() {
        terminalVisible = !terminalVisible;
        const terminal = document.getElementById('terminal-console');

        if (terminalVisible) {
            terminal.classList.add('show');
            terminalToggleBtn.textContent = '⬆️';
            terminalToggleBtn.title = 'Hide Terminal Console';
            logToTerminal('Terminal opened', 'info');
        } else {
            terminal.classList.remove('show');
            terminalToggleBtn.textContent = '⬇️';
            terminalToggleBtn.title = 'Show Terminal Console';
        }
    }

    // Add event listeners for terminal
    terminalToggleBtn.addEventListener('click', toggleTerminal);

    document.getElementById('terminal-close').addEventListener('click', () => {
        if (terminalVisible) {
            toggleTerminal();
        }
    });

    // Add keyboard shortcut for terminal (Ctrl + `)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Function to download a single image
    async function downloadSingleImage(img, divElement) {
        const imageUrl = extractImageUrl(img);
        if (!imageUrl) {
            logToTerminal('Could not extract image URL from current image', 'error');
            showNotification('❌ Failed to extract image URL!\nThe image source could not be found.', 'error', 4000);
            return;
        }

        // Check if this is likely a story by looking at the div class
        const isStory = divElement.classList.contains('x5yr21d') &&
                       divElement.classList.contains('x1n2onr6') &&
                       divElement.classList.contains('xh8yej3');

        const altText = img.alt || img.getAttribute('alt') || '';
        downloadCount++;
        const filename = generateFilenameFromAlt(altText, downloadCount);

        try {
            if (isStory) {
                logToTerminal(`Starting story image download: ${filename}`, 'info');
                logToTerminal(`Story image URL: ${imageUrl.substring(0, 100)}...`, 'info');
            } else {
                logToTerminal(`Starting download: ${filename}`, 'info');
            }

            GM_download(imageUrl, filename);

            // Visual feedback
            const icon = divElement.querySelector('.individual-download-icon');
            if (icon) {
                const originalBg = icon.style.background;
                icon.style.background = 'rgba(0, 128, 0, 0.8)';
                setTimeout(() => {
                    icon.style.background = originalBg;
                }, 1000);
            }

            if (isStory) {
                logToTerminal(`Successfully downloaded story image: ${filename}`, 'success');
                showNotification(`✅ Story downloaded!\n${filename}`, 'info', 2500);
            } else {
                logToTerminal(`Successfully downloaded: ${filename}`, 'success');
                showNotification(`✅ Image downloaded!\n${filename}`, 'info', 2500);
            }
            console.log(`Downloaded: ${filename}`);
        } catch (error) {
            logToTerminal(`Failed to download image: ${filename} - ${error.message}`, 'error');
            showNotification(`❌ Download failed!\n${filename}\n${error.message}`, 'error', 4000);
            console.error('Failed to download image:', error);
        }
    }

    // Function to add download icons to all visible div._aagv and div.x5yr21d.x1n2onr6.xh8yej3 elements
    function addDownloadIconsToVisibleDivs() {
        // Target both old and new div classes
        const targetDivs1 = document.querySelectorAll('div._aagv');
        const targetDivs2 = document.querySelectorAll('div.x5yr21d.x1n2onr6.xh8yej3');

        // Combine both NodeLists
        const allTargetDivs = [...targetDivs1, ...targetDivs2];
        let newIconsAdded = 0;

        allTargetDivs.forEach(div => {
            if (addDownloadIcon(div)) {
                newIconsAdded++;
            }
        });

        if (newIconsAdded > 0) {
            logToTerminal(`Added ${newIconsAdded} download icons to new posts`, 'info');
        }
    }

    // Function to create and add download icon to a div
    function addDownloadIcon(divElement) {
        // Check if icon already exists or div is already tracked
        if (divElement.querySelector('.individual-download-icon') || addedIcons.has(divElement)) {
            return false;
        }

        // Find the target image within this div - try both selectors
        let img = divElement.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
        if (!img) {
            // Try the new image selector
            img = divElement.querySelector('img.xl1xv1r.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x5yr21d.xmz0i5r.x193iq5w.xh8yej3');
        }

        if (!img) {
            return false; // No target image found
        }

        // Create download icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'individual-download-icon';
        iconContainer.title = 'Download this image';
        iconContainer.textContent = '💾'; // Use disk emoji

        // Add click event - dynamically find the current image at click time
        iconContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find the currently visible image at the time of click (important for stories)
            let currentImg = divElement.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
            if (!currentImg) {
                currentImg = divElement.querySelector('img.xl1xv1r.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x5yr21d.xmz0i5r.x193iq5w.xh8yej3');
            }

            if (currentImg) {
                await downloadSingleImage(currentImg, divElement);
            } else {
                // Check if this might be a video by looking for video elements
                const hasVideo = divElement.querySelector('video') !== null;
                const hasVideoIcon = divElement.querySelector('[aria-label*="video" i]') !== null;

                if (hasVideo || hasVideoIcon) {
                    logToTerminal('Video content detected - cannot download videos as images', 'warning');
                    showNotification('📹 This appears to be a video, not an image!\nVideos cannot be downloaded with this tool.', 'warning', 4000);
                } else {
                    logToTerminal('No current image found for download - content may be a video or unsupported format', 'error');
                    showNotification('🚫 No image found!\nThis might be a video or unsupported content.', 'error', 4000);
                }
            }
        });

        divElement.appendChild(iconContainer);
        addedIcons.add(divElement);
        return true;
    }

    // Function to continuously monitor and add icons to new divs
    function startIconMonitoring() {
        logToTerminal('Starting icon monitoring system', 'info');

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
        logToTerminal('Icon monitoring system active', 'success');
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
        // Target both old and new div classes
        const targetDivs1 = document.querySelectorAll('div._aagv');
        const targetDivs2 = document.querySelectorAll('div.x5yr21d.x1n2onr6.xh8yej3');

        // Combine both NodeLists
        const allTargetDivs = [...targetDivs1, ...targetDivs2];
        let newImagesDownloaded = 0;

        logToTerminal(`Scanning ${allTargetDivs.length} posts for new images`, 'progress');

        for (const div of allTargetDivs) {
            // Check if this is a story div
            const isStory = div.classList.contains('x5yr21d') &&
                           div.classList.contains('x1n2onr6') &&
                           div.classList.contains('xh8yej3');

            let images = [];

            if (isStory) {
                // For stories, only get the currently visible image
                const currentImg = div.querySelector('img.xl1xv1r.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x5yr21d.xmz0i5r.x193iq5w.xh8yej3');
                if (currentImg) {
                    images = [currentImg];
                }
            } else {
                // For regular posts, try both selectors
                images = div.querySelectorAll('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
                if (images.length === 0) {
                    images = div.querySelectorAll('img.xl1xv1r.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x5yr21d.xmz0i5r.x193iq5w.xh8yej3');
                }
            }

            for (const img of images) {
                const imageUrl = extractImageUrl(img);
                if (imageUrl && !downloadedUrls.has(imageUrl)) {
                    // Mark as downloaded to avoid duplicates
                    downloadedUrls.add(imageUrl);

                    // Generate filename
                    const altText = img.alt || img.getAttribute('alt') || '';
                    const filename = generateFilenameFromAlt(altText, downloadCount + 1);

                    try {
                        if (isStory) {
                            logToTerminal(`Downloading current story: ${filename}`, 'progress');
                        } else {
                            logToTerminal(`Downloading: ${filename}`, 'progress');
                        }
                        // Download immediately
                        GM_download(imageUrl, filename);
                        downloadCount++;
                        newImagesDownloaded++;

                        // Update progress
                        progressDiv.textContent = `Downloaded ${downloadCount} images - ${filename}`;

                        // Small delay to avoid overwhelming the browser
                        await delay(300);
                    } catch (error) {
                        logToTerminal(`Failed to download: ${filename} - ${error.message}`, 'error');
                        console.error(`Failed to download image:`, error);
                    }
                }
            }
        }

        if (newImagesDownloaded > 0) {
            logToTerminal(`Downloaded ${newImagesDownloaded} new images from current viewport`, 'success');
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

        logToTerminal('Starting bulk download process', 'info');
        logToTerminal('Collecting images from initial viewport', 'progress');

        // Download images from the initial viewport
        await collectAndDownloadNewImages(downloadedUrls);

        while (hasMoreContent && noNewImagesCount < 5 && noNewContentCount < 5) {
            const beforeHeight = document.body.scrollHeight;
            const beforeDownloadCount = downloadCount;

            // Scroll down
            logToTerminal(`Scrolling down (attempt ${scrollAttempts + 1})`, 'progress');
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
                logToTerminal(`New content loaded, page height: ${afterHeight}px`, 'info');
            } else {
                noNewContentCount++;
                logToTerminal(`No new content found (${noNewContentCount}/5)`, 'warning');
            }

            if (afterDownloadCount > beforeDownloadCount) {
                noNewImagesCount = 0; // Reset counter if new images were downloaded
            } else {
                noNewImagesCount++;
                logToTerminal(`No new images found (${noNewImagesCount}/5)`, 'warning');
            }

            // Update progress
            progressDiv.textContent = `Scrolling and downloading... Found ${downloadCount} images (attempt ${scrollAttempts})`;

            // Check if we've reached the end
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
                if (noNewContentCount >= 3 && noNewImagesCount >= 3) {
                    hasMoreContent = false;
                    logToTerminal('Reached end of content', 'info');
                }
            }
        }

        // Final attempt to collect any remaining images
        logToTerminal('Performing final scan for any remaining images', 'progress');
        await delay(2000);
        await collectAndDownloadNewImages(downloadedUrls);

        logToTerminal(`Bulk download completed! Total attempts: ${scrollAttempts}`, 'success');
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
            logToTerminal('Download already in progress!', 'warning');
            alert('Download already in progress!');
            return;
        }

        isDownloading = true;
        downloadCount = 0; // Reset counter
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Starting simultaneous scroll and download...';

        // Clear terminal and show it if not visible
        clearTerminal();
        if (!terminalVisible) {
            toggleTerminal();
        }

        logToTerminal('=== Starting Instagram Image Download Session ===', 'info');
        logToTerminal('Initializing bulk download process...', 'progress');

        try {
            // Scroll and download images simultaneously
            const { totalDownloaded, scrollAttempts } = await scrollAndDownloadImages();

            const successMessage = `Download complete! Successfully downloaded ${totalDownloaded} images after ${scrollAttempts} scroll attempts.`;
            progressDiv.textContent = successMessage;
            logToTerminal(`=== Download Session Complete ===`, 'success');
            logToTerminal(`Total images downloaded: ${totalDownloaded}`, 'success');
            logToTerminal(`Scroll attempts: ${scrollAttempts}`, 'info');

            if (totalDownloaded === 0) {
                const noImagesMessage = 'No images found with the specified classes. Make sure you are on an Instagram profile page.';
                progressDiv.textContent = noImagesMessage;
                logToTerminal(noImagesMessage, 'warning');
            }

            await delay(5000);
            progressDiv.style.display = 'none';

        } catch (error) {
            const errorMessage = `Error occurred during download process: ${error.message}`;
            console.error('Error during download process:', error);
            progressDiv.textContent = 'Error occurred during download process';
            logToTerminal(`=== Download Session Failed ===`, 'error');
            logToTerminal(errorMessage, 'error');
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

    logToTerminal('Instagram Image Downloader script loaded successfully', 'success');
    logToTerminal('Individual download icons will appear on hover', 'info');
    logToTerminal('Click the Download button or press Ctrl+Shift+D for bulk download', 'info');
    logToTerminal('Press Ctrl+` to toggle this terminal', 'info');

    console.log('Instagram Image Downloader script loaded. Individual download icons will appear on hover. Click the button or press Ctrl+Shift+D to start bulk downloading.');

})();