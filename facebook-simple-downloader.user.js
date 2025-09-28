// ==UserScript==
// @name         Facebook Simple Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple Facebook image downloader for specific div and image classes
// @author       You
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://m.facebook.com/*
// @grant        GM_download
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add minimal styles
    GM_addStyle(`
        #facebook-downloader-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #1877f2;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        #facebook-downloader-btn:hover {
            background: #166fe5;
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
            max-width: 300px;
            word-wrap: break-word;
        }

        .fb-download-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            opacity: 0;
            font-size: 14px;
        }

        .fb-download-icon:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }

        div.x10l6tqk.x13vifvy:hover .fb-download-icon {
            opacity: 1;
        }

        div.xh8yej3:hover .fb-download-icon {
            opacity: 1;
        }

        div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6 {
            position: relative !important;
        }

        div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6:hover .fb-download-icon {
            opacity: 1;
        }

        div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3 {
            position: relative !important;
        }

        div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3:hover .fb-download-icon {
            opacity: 1;
        }
    `);

    // Create bulk download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'facebook-downloader-btn';
    downloadBtn.textContent = 'Download All Images';
    document.body.appendChild(downloadBtn);

    // Create progress indicator
    const progressDiv = document.createElement('div');
    progressDiv.id = 'download-progress';
    document.body.appendChild(progressDiv);

    let downloadCount = 0;
    let isDownloading = false;
    let addedIcons = new Set();

    // Function to extract image URL
    function extractImageUrl(img) {
        if (img.src) {
            return img.src;
        } else if (img.dataset && img.dataset.src) {
            return img.dataset.src;
        } else if (img.getAttribute('data-src')) {
            return img.getAttribute('data-src');
        }
        return null;
    }

    // Function to extract post date from Facebook post
    function extractPostDate(divElement) {
        try {
            // Find the closest post container first
            const postContainer = divElement.closest('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld') || 
                                divElement.querySelector('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld');
            
            if (!postContainer) {
                console.log('Facebook Date Extractor: No post container found');
                return null;
            }
            
            // Try multiple approaches to find date elements
            let dateText = null;
            
            // Approach 1: Look for the specific date structure you mentioned
            const dateDiv = postContainer.querySelector('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x17zd0t2.x78zum5.x1q0g3np.x1a02dak');
            if (dateDiv) {
                console.log('Facebook Date Extractor: Found date div');
                const dateSpan = dateDiv.querySelector('span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j');
                if (dateSpan) {
                    console.log('Facebook Date Extractor: Found date span');
                    const dateAnchor = dateSpan.querySelector('a.x1i10hfl.xjbqb8w.x1ejq31n.x18oe1m7.x1sy0etr.xstzfhl.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xt0psk2.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f');
                    if (dateAnchor) {
                        console.log('Facebook Date Extractor: Found date anchor');
                        const finalSpan = dateAnchor.querySelector('span.x1rg5ohu.x6ikm8r.x10wlt62.x16dsc37.xt0b8zv');
                        if (finalSpan) {
                            dateText = finalSpan.textContent || finalSpan.innerText;
                            console.log('Facebook Date Extractor: Found date text (Approach 1):', dateText);
                        }
                    }
                }
            }
            
            // Approach 2: Look for any time/date related elements
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 2 - time elements');
                const timeElements = postContainer.querySelectorAll('time, [datetime], [data-utime], [title*="20"], [aria-label*="20"]');
                for (let timeEl of timeElements) {
                    const text = timeEl.textContent || timeEl.innerText || timeEl.getAttribute('datetime') || 
                                timeEl.getAttribute('data-utime') || timeEl.getAttribute('title') || timeEl.getAttribute('aria-label');
                    if (text && text.trim().length > 2) {
                        dateText = text;
                        console.log('Facebook Date Extractor: Found date text (Approach 2):', dateText);
                        break;
                    }
                }
            }
            
            // Approach 3: Look for spans that might contain date text (more aggressive)
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 3 - span search');
                const spans = postContainer.querySelectorAll('span, a');
                for (let span of spans) {
                    const text = span.textContent || span.innerText;
                    if (text && text.trim().length > 2 && text.trim().length < 50) {
                        // Check for date patterns
                        if (/\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}[,\\s]*\\d{4}/i.test(text) ||
                            /\\b\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{4}\\b/.test(text) ||
                            /\\b\\d{4}[/\\-]\\d{1,2}[/\\-]\\d{1,2}\\b/.test(text) ||
                            /\\b(yesterday|today|\\d+\\s*(h|hour|hours|m|min|minute|minutes|d|day|days)\\s*ago)\\b/i.test(text) ||
                            /\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}\\b/i.test(text) ||
                            text.includes('20') && (text.includes('Jan') || text.includes('Feb') || text.includes('Mar') || 
                            text.includes('Apr') || text.includes('May') || text.includes('Jun') ||
                            text.includes('Jul') || text.includes('Aug') || text.includes('Sep') ||
                            text.includes('Oct') || text.includes('Nov') || text.includes('Dec'))) {
                            dateText = text;
                            console.log('Facebook Date Extractor: Found date text (Approach 3):', dateText);
                            break;
                        }
                    }
                }
            }
            
            // Approach 4: Really aggressive search - look for any text that might be a date
            if (!dateText || dateText.length < 3) {
                console.log('Facebook Date Extractor: Trying Approach 4 - aggressive search');
                const allElements = postContainer.querySelectorAll('*');
                for (let elem of allElements) {
                    const text = elem.textContent || elem.innerText;
                    if (text && elem.children.length === 0 && text.trim().length > 2 && text.trim().length < 30) {
                        // Look for very specific patterns
                        if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2}[,\\s]*\\d{4}$/i.test(text.trim()) ||
                            /^\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{4}$/.test(text.trim()) ||
                            /^(yesterday|today|\\d+\\s*(h|hour|hours|m|min|minute|minutes|d|day|days)\\s*ago)$/i.test(text.trim())) {
                            dateText = text.trim();
                            console.log('Facebook Date Extractor: Found date text (Approach 4):', dateText);
                            break;
                        }
                    }
                }
            }
            
            if (dateText) {
                console.log('Facebook Date Extractor: Raw date text:', dateText);
                
                // First, handle the Facebook dash-separated character issue
                let cleanDate = dateText;
                
                // Remove the dash-separated character formatting that Facebook uses
                // This converts "-S---e--p-------t-e----m--b---er-- --25--" to "September 25"
                cleanDate = cleanDate.replace(/-+/g, '').replace(/\s+/g, ' ').trim();
                
                console.log('Facebook Date Extractor: After removing dashes:', cleanDate);
                
                // Now remove any remaining invalid filename characters
                cleanDate = cleanDate.replace(/[<>:"/\\|?*\x00-\x1f\x7f-\x9f]/g, '').trim();
                
                console.log('Facebook Date Extractor: After removing invalid chars:', cleanDate);
                
                // Replace multiple spaces with single spaces
                cleanDate = cleanDate.replace(/\s+/g, ' ');
                
                console.log('Facebook Date Extractor: Final cleaning:', cleanDate);
                
                // Validate the cleaned date
                if (cleanDate.length > 2 && cleanDate.length < 50) {
                    // Check if it contains reasonable date content
                    const hasMonth = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(cleanDate);
                    const hasNumber = /\d/.test(cleanDate);
                    const hasTimeIndicator = /\b(AM|PM|at|ago|hour|min|day|yesterday|today)\b/i.test(cleanDate);
                    
                    if (hasMonth || hasNumber || hasTimeIndicator) {
                        console.log('Facebook Date Extractor: Final date:', cleanDate);
                        return cleanDate;
                    }
                }
                
                console.log('Facebook Date Extractor: Date validation failed');
                return null;
            }
            
            console.log('Facebook Date Extractor: No date found');
            return null;
        } catch (error) {
            console.log('Facebook Date Extractor: Error extracting post date:', error);
            return null;
        }
    }

    // Function to determine image type based on CSS classes
    function getImageType(img) {
        const className = img.className;
        
        // Check for new image class (priority check)
        if (className.includes('xz74otr') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('xjbqb8w') && className.includes('xu25z0z') && className.includes('x1fmog5m') && className.includes('x1o0tod') && className.includes('x10l6tqk') && className.includes('xwa60dl') && className.includes('x1cb1t30') && className.includes('xh8yej3') && className.includes('x1ja2u2z')) {
            return 'story-view';
        }
        // Check for post view (existing class)
        else if (className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('x1bwycvy') && className.includes('x193iq5w') && className.includes('x4fas0m') && className.includes('x19kjcj4')) {
            return 'post-view';
        }
        // Check for multiple photos (existing class)
        else if (className.includes('xz74otr') && className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw')) {
            return 'multiple-photos';
        }
        // Check for post photo (priority 3)
        else if (className.includes('x15mokao') && className.includes('x1ga7v0g') && className.includes('x16uus16') && className.includes('xbiv7yw') && className.includes('xl1xv1r')) {
            return 'post-photo';
        }
        // Check for profile photo (priority 1)
        else if (className.includes('x1rg5ohu') && className.includes('xl1xv1r') && !className.includes('x15mokao')) {
            return 'profile-photo';
        }
        // Check for cover photo (priority 2)
        else if (className.includes('xz74otr') && className.includes('x1ey2m1c') && className.includes('x9f619')) {
            return 'cover-photo';
        }
        // Fallback
        else {
            return 'unknown-photo';
        }
    }

    // Function to generate filename
    function generateFilename(altText, index, imageType, postDate) {
        let filename = `fb-image-${index}-`;
        
        // Add post date if available
        if (postDate) {
            filename += `${postDate}-`;
        }
        
        filename += `${imageType}-`;

        if (altText) {
            let cleanAlt = altText.replace(/[<>:"/\\|?*]/g, '').trim();
            if (cleanAlt.length > 50) {
                cleanAlt = cleanAlt.substring(0, 50) + '...';
            }
            filename += cleanAlt;
        } else {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            filename += timestamp;
        }

        return filename + '.jpg';
    }

    // Function to download image
    async function downloadImage(img, divElement) {
        const imageUrl = extractImageUrl(img);
        if (!imageUrl) {
            alert('Could not extract image URL');
            return;
        }

        const altText = img.alt || img.getAttribute('alt') || '';
        const imageType = getImageType(img);
        const postDate = extractPostDate(divElement);
        downloadCount++;
        const filename = generateFilename(altText, downloadCount, imageType, postDate);

        try {
            GM_download(imageUrl, filename);
            console.log(`Downloaded: ${filename}`);
        } catch (error) {
            console.error('Failed to download image:', error);
            alert('Failed to download image');
        }
    }

    // Function to add download icon to a div
    function addDownloadIcon(divElement) {
        // Check if icon already exists
        if (divElement.querySelector('.fb-download-icon') || addedIcons.has(divElement)) {
            return false;
        }

        // Find the specific image with the target classes - try all six selectors
        let img = divElement.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3'); // Priority 1
        
        if (!img) {
            // Try the second image selector
            img = divElement.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3'); // Priority 2
        }
        
        if (!img) {
            // Try the third image selector
            img = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r'); // Priority 3
        }
        
        if (!img) {
            // Try the fourth image selector (multiple photos)
            img = divElement.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3'); // Priority 4
        }
        
        if (!img) {
            // Try the fifth image selector (post view)
            img = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4'); // Priority 5
        }
        
        if (!img) {
            // Try the sixth image selector (special photo)
            img = divElement.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z'); // Priority 6
        }
        
        if (!img) {
            return false;
        }

        // Create download icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'fb-download-icon';
        iconContainer.title = 'Download this image';
        iconContainer.textContent = '💾';

        // Add click event
        iconContainer.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find current image at click time - try all six selectors
            let currentImg = divElement.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3');
            
            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
            }
            
            if (!currentImg) {
                currentImg = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r');
            }
            
            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
            }
            
            if (!currentImg) {
                currentImg = divElement.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4');
            }
            
            if (!currentImg) {
                currentImg = divElement.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z');
            }
            
            if (currentImg) {
                await downloadImage(currentImg, divElement);
                
                // Visual feedback
                const originalBg = iconContainer.style.background;
                iconContainer.style.background = 'rgba(0, 128, 0, 0.8)';
                setTimeout(() => {
                    iconContainer.style.background = originalBg;
                }, 1000);
            } else {
                alert('No image found');
            }
        });

        divElement.appendChild(iconContainer);
        addedIcons.add(divElement);
        return true;
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
        const allDivs = [
            ...document.querySelectorAll('div.xh8yej3'),
            ...document.querySelectorAll('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z'),
            ...document.querySelectorAll('div.x10l6tqk.x13vifvy'),
            ...document.querySelectorAll('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6'),
            ...document.querySelectorAll('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3')
        ];
        
        let newImagesDownloaded = 0;

        for (const div of allDivs) {
            // Try to find image with any of the supported selectors
            let img = div.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3') ||
                     div.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3') ||
                     div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r') ||
                     div.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3') ||
                     div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4') ||
                     div.querySelector('img.xz74otr.x16uus16.xbiv7yw.xjbqb8w.xu25z0z.x1fmog5m.x1o0tod.x10l6tqk.xwa60dl.x1cb1t30.xh8yej3.x1ja2u2z');

            if (img) {
                const imageUrl = extractImageUrl(img);
                if (imageUrl && !downloadedUrls.has(imageUrl)) {
                    downloadedUrls.add(imageUrl);

                    const altText = img.alt || img.getAttribute('alt') || '';
                    const imageType = getImageType(img);
                    const postDate = extractPostDate(div);
                    downloadCount++;
                    const filename = generateFilename(altText, downloadCount, imageType, postDate);

                    try {
                        GM_download(imageUrl, filename);
                        newImagesDownloaded++;

                        progressDiv.textContent = `Downloaded ${downloadCount} images - ${filename.substring(0, 50)}...`;
                        await delay(300);
                    } catch (error) {
                        console.error('Failed to download image:', error);
                    }
                }
            }
        }

        return newImagesDownloaded;
    }

    // Function to scroll and download images simultaneously
    async function scrollAndDownloadImages() {
        const downloadedUrls = new Set();
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
                noNewContentCount = 0;
            } else {
                noNewContentCount++;
            }

            if (afterDownloadCount > beforeDownloadCount) {
                noNewImagesCount = 0;
            } else {
                noNewImagesCount++;
            }

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

    // Function to find and download all images
    async function findAndDownloadAllImages() {
        if (isDownloading) {
            alert('Download already in progress!');
            return;
        }

        isDownloading = true;
        downloadCount = 0;
        progressDiv.style.display = 'block';
        progressDiv.textContent = 'Starting simultaneous scroll and download...';

        try {
            const { totalDownloaded, scrollAttempts } = await scrollAndDownloadImages();

            progressDiv.textContent = `Download complete! Successfully downloaded ${totalDownloaded} images after ${scrollAttempts} scroll attempts.`;

            if (totalDownloaded === 0) {
                progressDiv.textContent = 'No images found with the specified classes. Make sure you are on a Facebook page with images.';
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

    // Function to scan for target divs with priority system
    function scanForImages() {
        // First, find all post containers
        const postContainers = document.querySelectorAll('div.x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld');
        let newIconsAdded = 0;

        postContainers.forEach(postContainer => {
            let hasAddedIcon = false;
            
            // Priority 1: Check for xh8yej3 div first
            const priority1Div = postContainer.querySelector('div.xh8yej3');
            
            if (priority1Div) {
                const priority1Img = priority1Div.querySelector('img.x1rg5ohu.x5yr21d.xl1xv1r.xh8yej3');
                
                if (priority1Img && addDownloadIcon(priority1Div)) {
                    newIconsAdded++;
                    hasAddedIcon = true;
                    return; // Skip other divs in this post container
                }
            }
            
            // Priority 2: Check for the new long div class
            const priority2Div = postContainer.querySelector('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z');
            
            if (priority2Div && !hasAddedIcon) {
                const priority2Img = priority2Div.querySelector('img.xz74otr.x1ey2m1c.x9f619.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
                
                if (priority2Img && addDownloadIcon(priority2Div)) {
                    newIconsAdded++;
                    hasAddedIcon = true;
                    return; // Skip other divs in this post container
                }
            }
            
            // Priority 3: Check for regular divs (x10l6tqk x13vifvy) - handle differently for multiple photos
            const priority3Divs = postContainer.querySelectorAll('div.x10l6tqk.x13vifvy');
            
            priority3Divs.forEach(div => {
                // Check if this div has multiple photos image
                const multiplePhotosImg = div.querySelector('img.xz74otr.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3');
                
                if (multiplePhotosImg) {
                    // For multiple photos, add icon to each individual div
                    if (addDownloadIcon(div)) {
                        newIconsAdded++;
                    }
                } else if (!hasAddedIcon) {
                    // For single post photos, use priority system
                    const priority3Img = div.querySelector('img.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x1ey2m1c.x5yr21d.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xh8yej3.xl1xv1r');
                    
                    if (priority3Img && addDownloadIcon(div)) {
                        newIconsAdded++;
                        hasAddedIcon = true;
                    }
                }
            });
        });

        // Also scan for standalone divs not inside post containers (fallback)
        const standaloneDivs1 = document.querySelectorAll('div.xh8yej3:not(.xdj266r .xh8yej3)');
        const standaloneDivs2 = document.querySelectorAll('div.x1qjc9v5.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.xtijo5x.x1o0tod.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x10l6tqk.x13vifvy.x1ja2u2z:not(.xdj266r .x1qjc9v5)');
        const standaloneDivs3 = document.querySelectorAll('div.x10l6tqk.x13vifvy:not(.xdj266r .x10l6tqk.x13vifvy)');
        const standaloneDivs4 = document.querySelectorAll('div.x6s0dn4.x78zum5.xdt5ytf.xl56j7k.x1n2onr6');
        const standaloneDivs5 = document.querySelectorAll('div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x18d0r48.x1ey2m1c.xtijo5x.x1o0tod.x10l6tqk.x13vifvy.xl8spv7.xt2wqj3');
        
        [...standaloneDivs1, ...standaloneDivs2, ...standaloneDivs3, ...standaloneDivs4, ...standaloneDivs5].forEach(div => {
            if (addDownloadIcon(div)) {
                newIconsAdded++;
            }
        });

        if (newIconsAdded > 0) {
            console.log(`Added ${newIconsAdded} download icons to Facebook posts`);
        }
    }

    // Start monitoring
    function startMonitoring() {
        console.log('Facebook Simple Image Downloader loaded');
        
        // Initial scan
        setTimeout(scanForImages, 2000);

        // Set up observer for new content
        const observer = new MutationObserver(() => {
            setTimeout(scanForImages, 1000);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Periodic scan
        setInterval(scanForImages, 5000);
    }

    // Add click event to bulk download button
    downloadBtn.addEventListener('click', findAndDownloadAllImages);

    // Add keyboard shortcut (Ctrl + Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            findAndDownloadAllImages();
        }
    });

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMonitoring);
    } else {
        startMonitoring();
    }

    console.log('Facebook Image Downloader loaded. Individual download icons will appear on hover. Click the "Download All Images" button or press Ctrl+Shift+D to start bulk downloading.');

})();