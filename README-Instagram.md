# Instagram Profile Image Downloader

A powerful Tampermonkey userscript that allows you to download all images from Instagram profiles with both individual and bulk download capabilities. Features a modern draggable UI with enhanced user experience.

## 📸 Features

### Modern User Interface
- **🌠 Draggable UI**: Main download button with shooting star drag handle for repositioning
- **📍 Position Dropdown**: Five preset positions (Top Left, Top Right, Bottom Right, Bottom Left, Center)
- **⭐ Contributor Button**: Direct link to GitHub repository with star icon
- **🎨 Animated Elements**: Subtle pulse animation on drag handle with smooth hover effects
- **💾 Persistent Settings**: Remembers chosen position across browser sessions
- **🖱️ Intuitive Controls**: All UI elements appear on hover for clean interface
- **⚡ Smooth Transitions**: Fluid animations and visual feedback for all interactions

### Individual Downloads
- **💾 Save Icons**: Hover over Instagram posts to see individual download icons
- **One-Click Download**: Click any icon to instantly download that specific image
- **Visual Feedback**: Icons turn green when download is successful
- **Smart Detection**: Automatically detects images in both post and story containers
- **Video Detection**: Smart detection of video content with appropriate warnings

### Bulk Downloads
- **Download All Button**: Purple "Download Images" button in top-right corner
- **Automatic Scrolling**: Intelligently scrolls through profile to load all content
- **Simultaneous Processing**: Downloads images while scrolling for maximum efficiency
- **Progress Tracking**: Real-time progress indicator showing download count and status
- **Duplicate Prevention**: Smart URL tracking prevents downloading the same image twice
- **Story Support**: Handles Instagram stories with current image detection

### Terminal Console
- **⬇️ Terminal Toggle**: Collapsible terminal console with live logging
- **Real-time Logs**: Timestamped logs with color-coded message types (info, success, error, warning, progress)
- **Session Tracking**: Complete download session logs with statistics
- **Terminal Shortcuts**: `Ctrl + `` ` to toggle terminal visibility
- **Auto-scroll**: Terminal automatically scrolls to show latest messages

### Smart Notifications
- **Toast Messages**: Center-screen notifications with automatic fade-in/out animation
- **Success Notifications**: ✅ Green notifications for successful downloads (2.5s duration)
- **Error Notifications**: ❌ Red notifications for failed downloads (4s duration)
- **Warning Notifications**: ⚠️ Yellow notifications for video detection (4s duration)
- **Auto-dismiss**: Notifications automatically disappear after set duration
- **Non-blocking**: Notifications don't interfere with scrolling or clicking
- **Smart Replacement**: New notifications replace existing ones to prevent spam

### Enhanced User Experience
- **Keyboard Shortcuts**: 
  - `Ctrl + Shift + D` to start bulk downloading
  - `Ctrl + `` ` (backtick) to toggle terminal console
- **Draggable Interface**: Click and drag the 🌠 shooting star handle to reposition
- **Position Presets**: Choose from 5 strategic positions via 📍 dropdown menu
- **GitHub Integration**: Quick access to contribute via ⭐ star button
- **Smart Notifications**: Toast notifications with success/error messages
- **Smart Filename Generation**: Creates descriptive filenames based on image alt text
- **Error Handling**: Graceful error handling with detailed logging and user notifications
- **Non-Intrusive**: Minimal UI that doesn't interfere with normal Instagram usage

## 🚀 Installation

### Prerequisites
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
   - **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - **Edge**: [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### Install Script
1. **Copy the Script**: Copy the entire content of `instagram-image-downloader.user.js`
2. **Open Tampermonkey**: Click the Tampermonkey icon in your browser
3. **Create New Script**: Select "Create a new script"
4. **Paste Code**: Replace the template with the copied script code
5. **Save**: Press `Ctrl + S` or click the save icon
6. **Enable**: Make sure the script is enabled in Tampermonkey dashboard

## 📖 Usage

### UI Interaction Guide

#### Moving the Download Interface
1. **Hover** over the purple "Download Images" button to reveal controls
2. **Drag** the 🌠 shooting star handle to move the interface anywhere on screen
3. **Release** to lock the new position
4. **Position persists** across page refreshes and new Instagram sessions

#### Using Position Presets
1. **Hover** over the download button to reveal the 📍 position dropdown
2. **Click** the 📍 icon to open position menu
3. **Select** from five preset positions:
   - **Top Left**: Upper left corner
   - **Top Right**: Upper right corner (default)
   - **Bottom Right**: Lower right corner
   - **Bottom Left**: Lower left corner
   - **Center**: Center of screen
4. **Position updates** immediately with smooth animation

#### Contributing to Development
1. **Hover** over the download button to reveal the ⭐ contributor button
2. **Click** the ⭐ star icon to open GitHub repository
3. **Contribute** by reporting issues, suggesting features, or submitting code
4. **Star** the repository if you find it helpful

### Individual Image Downloads

1. **Navigate** to any Instagram profile or page with images
2. **Hover** over individual posts to see the 💾 download icon
3. **Click** the icon to download that specific image
4. **Visual Confirmation**: Icon turns green briefly when download starts
5. **Real-time Logging**: Check the terminal console for detailed download logs
6. **Smart Notifications**: Success notifications appear in center of screen

### Smart Notification Types

#### Success Messages (Green, 2.5s)
- `✅ Image downloaded!` - Regular image download success
- `✅ Story downloaded!` - Story image download success

#### Error Messages (Red, 4s)
- `❌ Failed to extract image URL!` - Cannot find image source
- `❌ Download failed!` - Network or browser download error
- `🚫 No image found!` - Content might be video or unsupported format

#### Warning Messages (Yellow, 4s)
- `📹 This appears to be a video, not an image!` - Video content detected

### Bulk Image Downloads

#### Method 1: Button Click
1. **Navigate** to an Instagram profile page
2. **Click** the purple "Download Images" button in the top-right corner
3. **Wait** for the automatic scrolling and downloading process
4. **Monitor Progress** via the progress indicator below the button

#### Method 2: Keyboard Shortcut
1. **Navigate** to an Instagram profile page
2. **Press** `Ctrl + Shift + D`
3. **Wait** for the process to complete

### Terminal Console Usage

#### Opening the Terminal
1. **Click** the ⬇️ button in the top-right corner
2. **Or Press** `Ctrl + `` ` (backtick key)
3. **Terminal** slides up from the bottom with live logging

#### Terminal Features
- **Live Logging**: Real-time download progress and status messages
- **Color Coding**: 
  - 🟢 Green: Success messages and info
  - 🔴 Red: Error messages
  - 🟡 Yellow: Warning messages
  - 🔵 Blue: Progress updates
- **Timestamps**: All messages include precise timestamps
- **Auto-scroll**: Terminal automatically shows latest messages
- **Session Logs**: Complete record of download sessions with statistics

### Download Process
- Script automatically scrolls through the profile
- Downloads images as they become visible
- Shows real-time progress: `"Downloaded 25 images - image-25-sunset-beach-photo.jpg"`
- Stops when no more content is found
- Displays completion summary

## 🎯 Target Elements

The script specifically targets Instagram's image containers:

### Post Containers
- **Regular Posts**: `div._aagv`
- **Story Containers**: `div.x5yr21d.x1n2onr6.xh8yej3`

### Image Selectors
- **Primary Images**: `img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3`
- **Alternative Images**: `img.xl1xv1r.x15mokao.x1ga7v0g.x16uus16.xbiv7yw.x5yr21d.xmz0i5r.x193iq5w.xh8yej3`

### Content Detection
- **Story Support**: Detects and handles Instagram stories with current image extraction
- **Video Detection**: Identifies video content and provides appropriate warnings
- **Dynamic Content**: Uses MutationObserver to detect new content as it loads

## 📁 File Naming Convention

Downloaded images follow this naming pattern:
```
image-{index}-{description}.jpg
```

### Examples:
- `image-1-Photo by john_doe on Instagram.jpg`
- `image-15-sunset-beach-vacation.jpg`
- `image-23-2024-12-28T10-30-45-123Z.jpg` (fallback when no alt text)

### Filename Processing:
- **Alt Text Extraction**: Uses Instagram's alt text for meaningful names
- **Prefix Removal**: Removes common prefixes like "Photo by username on"
- **Character Cleaning**: Removes invalid filename characters (`< > : " / \ | ? *`)
- **Length Limiting**: Truncates very long descriptions to 100 characters
- **Fallback**: Uses timestamp when no description is available

## ⚙️ Configuration

### Keyboard Shortcuts
- **Bulk Download**: `Ctrl + Shift + D` - Start bulk download process
- **Terminal Toggle**: `Ctrl + \`` (backtick key) - Show/hide terminal console

### UI Positioning
- **Drag Handle**: Click and drag the 🌠 shooting star to move interface
- **Position Presets**: Use 📍 dropdown for quick positioning:
  - Top Left (10px from top-left corner)
  - Top Right (10px from top-right corner) - Default
  - Bottom Right (10px from bottom-right corner)
  - Bottom Left (10px from bottom-left corner)
  - Center (centered on screen)
- **Persistent Memory**: Chosen position is remembered across sessions

### Timing Settings
- **Scroll Delay**: 2 seconds between scroll attempts
- **Download Delay**: 300ms between individual downloads
- **Content Load Wait**: 2 seconds for new content to appear
- **Icon Check Interval**: 3 seconds for periodic monitoring
- **Icon Rendering Delay**: 500ms for new content icons
- **Visual Feedback**: 1 second for download success indication

### Stopping Conditions
The bulk download stops when:
- **No New Images**: 5 consecutive attempts without finding new images
- **No New Content**: 5 consecutive attempts without page height increase
- **End of Page**: Reached bottom and no activity for 3 attempts

## 🔧 Technical Details

### Browser Compatibility
- ✅ **Chrome** (Recommended)
- ✅ **Firefox**
- ✅ **Edge**
- ✅ **Safari** (with Tampermonkey)

### Required Permissions
- `GM_download`: For downloading images directly
- `GM_addStyle`: For injecting CSS styles

### Performance Features
- **Mutation Observer**: Efficiently detects new content without constant polling
- **Set-based Tracking**: Prevents duplicate downloads using URL sets
- **Memory Management**: Cleans up event listeners and references
- **Throttled Downloads**: Prevents browser overwhelm with controlled timing
- **Dynamic Image Detection**: Finds current images at click time for stories
- **Efficient Monitoring**: Icon tracking system prevents duplicate UI elements
- **Smart Terminal**: Auto-scrolling terminal with memory-efficient logging
- **Toast Notifications**: Center-positioned with fade animations and auto-dismiss
- **CSS Injection**: Dynamic styling for notifications with color-coded message types
- **Event Management**: Proper cleanup of notification timers and DOM elements
- **Drag System**: Efficient mouse event handling with proper cleanup
- **Position Management**: LocalStorage integration for persistent UI settings
- **Hover Controls**: CSS-based reveal system for clean interface
- **Animation Engine**: Hardware-accelerated CSS transitions and transforms

## 🛠️ Troubleshooting

### Common Issues

#### "No images found" Message
**Cause**: Not on a valid Instagram page with images
**Solution**: 
- Navigate to an Instagram profile page
- Ensure you're logged into Instagram
- Try refreshing the page and waiting for content to load

#### Download Icons Not Appearing
**Cause**: Script not loaded or Instagram structure changed
**Solutions**:
- Check Tampermonkey is enabled
- Refresh the page
- Check browser console for errors
- Verify you're on instagram.com domain

#### Downloads Not Starting
**Cause**: Browser blocking downloads or popup blocker
**Solutions**:
- Allow popups for Instagram in browser settings
- Check if Tampermonkey has necessary permissions
- Try downloading individual images first
- Check terminal console for detailed error messages

#### Terminal Console Not Showing
**Cause**: CSS conflicts or script loading issues
**Solutions**:
- Press `Ctrl + `` ` to toggle terminal
- Refresh the page and wait for script to load
- Check if other extensions are interfering
- Ensure Tampermonkey has necessary CSS injection permissions

#### Smart Notifications Not Appearing
**Cause**: CSS injection issues or popup blockers
**Solutions**:
- Check if other extensions are blocking notifications
- Ensure Tampermonkey has CSS injection permissions
- Try refreshing the page to reinitialize the script
- Check browser console for CSS-related errors
- Verify no adblockers are interfering with popup elements

#### UI Controls Not Visible
**Cause**: CSS conflicts or hover state issues
**Solutions**:
- Hover over the main download button to reveal controls (🌠📍⭐)
- Refresh the page if controls don't appear on hover
- Check if other extensions are modifying CSS
- Try a different position preset if current position is problematic
- Clear browser cache and restart Tampermonkey if needed

#### Drag Functionality Not Working
**Cause**: Event conflicts or browser restrictions
**Solutions**:
- Ensure you're dragging the 🌠 shooting star handle, not the main button
- Check for interfering browser extensions
- Try using position presets as alternative to dragging
- Refresh page and wait for script to fully load
- Test in incognito mode to isolate extension conflicts

#### Position Settings Not Saving
**Cause**: LocalStorage restrictions or browser settings
**Solutions**:
- Check browser's localStorage permissions for Instagram
- Ensure cookies and site data are allowed for instagram.com
- Try manually selecting position again
- Clear browser data and reconfigure if persistent
- Check if private/incognito mode is preventing storage

#### Incomplete Downloads
**Cause**: Network issues or rate limiting
**Solutions**:
- Wait a moment and try again
- Try downloading in smaller batches
- Check internet connection stability

### Debug Information

#### Terminal Console Logging
The built-in terminal console provides comprehensive logging:
```
[10:30:15 AM] Instagram Image Downloader script loaded successfully
[10:30:15 AM] Individual download icons will appear on hover
[10:30:16 AM] Starting icon monitoring system
[10:30:16 AM] Icon monitoring system active
[10:30:45 AM] Starting download: image-1-beach-sunset.jpg
[10:30:45 AM] Successfully downloaded: image-1-beach-sunset.jpg
[10:31:20 AM] === Starting Instagram Image Download Session ===
[10:31:20 AM] Scrolling down (attempt 1)
[10:31:22 AM] Downloaded 5 new images from current viewport
[10:31:25 AM] === Download Session Complete ===
[10:31:25 AM] Total images downloaded: 23
```

#### Browser Console (F12)
Additional technical logging in browser console:
```javascript
Instagram Image Downloader script loaded. Individual download icons will appear on hover.
Downloaded: image-1-beach-sunset.jpg
Scrolling and downloading... Found 15 images (attempt 3)
Download complete! Successfully downloaded 23 images after 5 scroll attempts.
```

## 🔒 Privacy & Security

### Data Handling
- **No Data Collection**: Script runs entirely locally
- **No External Requests**: Only downloads images directly from Instagram
- **No User Tracking**: No analytics or tracking code
- **Local Processing**: All filename generation and processing happens in your browser

### Instagram Terms of Service
- **Personal Use**: Intended for personal archival of publicly available content
- **Respect Copyrights**: Only download content you have permission to save
- **Rate Limiting**: Script includes delays to avoid overwhelming Instagram's servers
- **No Circumvention**: Does not bypass any Instagram access controls

## 📝 Changelog

### Version 2.0 - Modern UI Update
- ✨ **Draggable Interface**: 🌠 Shooting star drag handle with smooth repositioning
- ✨ **Position Presets**: 📍 Five strategic preset positions with dropdown menu
- ✨ **Contributor Integration**: ⭐ Direct GitHub repository access button
- ✨ **Persistent Settings**: Position preferences saved across sessions
- ✨ **Enhanced Animations**: Subtle pulse effects and smooth transitions
- ✨ **Improved UX**: Hover-reveal controls for cleaner interface
- ✨ **Visual Polish**: Modern styling with consistent iconography
- 🐛 **Bug Fixes**: Resolved keyboard shortcut conflicts and duplicate event listeners
- 🔧 **Code Optimization**: Cleaner event handling and performance improvements

### Version 1.0 - Initial Release
- ✨ Individual download icons on hover
- ✨ Bulk download with automatic scrolling
- ✨ Smart filename generation from alt text
- ✨ Progress tracking and visual feedback
- ✨ Keyboard shortcut support (`Ctrl + Shift + D`)
- ✨ Duplicate prevention system
- ✨ Error handling and recovery
- ✨ **Terminal Console**: Real-time logging with color-coded messages
- ✨ **Terminal Toggle**: `Ctrl + `` ` keyboard shortcut
- ✨ **Story Support**: Instagram stories detection and download
- ✨ **Dual Image Selectors**: Support for multiple Instagram image classes
- ✨ **Smart Notifications**: Toast notifications for download status
  - Success notifications (✅ green, 2.5s duration)
  - Error notifications (❌ red, 4s duration)  
  - Warning notifications (📹 yellow, 4s duration)
  - Auto-dismiss and fade animations
  - Non-blocking center-screen positioning
- ✨ **Video Detection**: Identifies and warns about video content
- ✨ **Icon Monitoring**: Automatic detection and addition of download icons
- ✨ **Session Logging**: Complete download session tracking with statistics

## 🤝 Contributing

### Reporting Issues
If you encounter problems:
1. Check the troubleshooting section
2. Open browser console and look for error messages
3. Provide specific details about your browser and Instagram page
4. Include console error messages if any

### Feature Requests
Suggestions for improvements are welcome:
- Enhanced filename customization
- Additional image format support
- Filter options for specific image types
- Export options for download lists

## 📄 License

This script is provided as-is for educational and personal use. Please respect Instagram's Terms of Service and copyright laws when using this tool.

---

**Note**: This userscript is not affiliated with Instagram or Meta. Use responsibly and in accordance with applicable terms of service and copyright laws.