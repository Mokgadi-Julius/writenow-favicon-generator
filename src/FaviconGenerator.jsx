import React, { useState, useEffect, useRef, useCallback } from "react";
import JSZip from "jszip";

const PremiumFaviconGenerator = () => {
  // State management
  const [contentType, setContentType] = useState("text");
  const [textMode, setTextMode] = useState("custom"); // custom, icons, fonts
  const [letter, setLetter] = useState("P");
  const [selectedIcon, setSelectedIcon] = useState("🚀");
  const [iconCategory, setIconCategory] = useState("popular");
  const [iconSearch, setIconSearch] = useState("");
  const [font, setFont] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("700");
  const [bgColor, setBgColor] = useState("#dc2626"); // Red
  const [textColor, setTextColor] = useState("#ffffff");
  const [designStyle, setDesignStyle] = useState("solid");
  const [gradientColor1, setGradientColor1] = useState("#dc2626"); // Red
  const [gradientColor2, setGradientColor2] = useState("#000000"); // Black
  const [shadowIntensity, setShadowIntensity] = useState(5);
  const [glowIntensity, setGlowIntensity] = useState(10);
  const [glowColor, setGlowColor] = useState("#dc2626"); // Red
  const [logoScale, setLogoScale] = useState(80);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [faviconData, setFaviconData] = useState({});
  
  // New state for enhanced features
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandKeywords, setBrandKeywords] = useState("");
  const [savedBrandKits, setSavedBrandKits] = useState([]);
  const [selectedBrandKit, setSelectedBrandKit] = useState(null);
  const [texture, setTexture] = useState("none");
  const [borderRadius, setBorderRadius] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [animationStyle, setAnimationStyle] = useState("none");
  const [pattern, setPattern] = useState("none");
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);
  const [accessibilityScore, setAccessibilityScore] = useState(100);
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
  const [backgroundRemovalTolerance, setBackgroundRemovalTolerance] = useState(30);
  const [originalLogo, setOriginalLogo] = useState(null);
  const [processedLogo, setProcessedLogo] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("zip"); // "zip" or "files"
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Refs for canvas elements
  const canvasRefs = {
    16: useRef(null),
    32: useRef(null),
    64: useRef(null),
    128: useRef(null),
  };

  const fileInputRef = useRef(null);

  // Update previews when any setting changes
  useEffect(() => {
    updateAllPreviews();
    
    // Calculate accessibility score
    const ratio = getAccessibilityScore();
    const score = ratio >= 4.5 ? 100 : ratio >= 3 ? 75 : 50;
    setAccessibilityScore(score);
  }, [
    contentType,
    textMode,
    letter,
    selectedIcon,
    font,
    fontWeight,
    bgColor,
    textColor,
    designStyle,
    gradientColor1,
    gradientColor2,
    shadowIntensity,
    glowIntensity,
    glowColor,
    logoScale,
    uploadedLogo,
    texture,
    borderRadius,
    borderWidth,
    borderColor,
    pattern,
    backgroundRemovalEnabled,
    backgroundRemovalTolerance,
  ]);

  const updateAllPreviews = useCallback(() => {
    Object.entries(canvasRefs).forEach(([size, ref]) => {
      if (ref.current) {
        drawFavicon(ref.current.getContext("2d"), parseInt(size));
      }
    });
  }, [
    contentType,
    textMode,
    letter,
    selectedIcon,
    font,
    fontWeight,
    bgColor,
    textColor,
    designStyle,
    gradientColor1,
    gradientColor2,
    shadowIntensity,
    glowIntensity,
    glowColor,
    logoScale,
    uploadedLogo,
    texture,
    borderRadius,
    borderWidth,
    borderColor,
    pattern,
    backgroundRemovalEnabled,
    backgroundRemovalTolerance,
  ]);

  const drawBackground = (ctx, size) => {
    // Apply border radius
    ctx.save();
    if (borderRadius > 0) {
      const radius = (size * borderRadius) / 100;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
    }

    if (designStyle === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
    } else if (designStyle === "outline") {
      ctx.fillStyle = "transparent";
    } else {
      ctx.fillStyle = bgColor;
    }

    if (designStyle !== "outline") {
      ctx.fillRect(0, 0, size, size);
    }

    if (designStyle === "outline") {
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = Math.max(2, size * 0.05);
      ctx.strokeRect(
        ctx.lineWidth / 2,
        ctx.lineWidth / 2,
        size - ctx.lineWidth,
        size - ctx.lineWidth
      );
    }

    // Apply border if specified
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      const offset = borderWidth / 2;
      if (borderRadius > 0) {
        const radius = (size * borderRadius) / 100;
        ctx.beginPath();
        ctx.moveTo(radius + offset, offset);
        ctx.lineTo(size - radius - offset, offset);
        ctx.quadraticCurveTo(size - offset, offset, size - offset, radius + offset);
        ctx.lineTo(size - offset, size - radius - offset);
        ctx.quadraticCurveTo(size - offset, size - offset, size - radius - offset, size - offset);
        ctx.lineTo(radius + offset, size - offset);
        ctx.quadraticCurveTo(offset, size - offset, offset, size - radius - offset);
        ctx.lineTo(offset, radius + offset);
        ctx.quadraticCurveTo(offset, offset, radius + offset, offset);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.strokeRect(offset, offset, size - borderWidth, size - borderWidth);
      }
    }

    // Apply patterns and textures
    applyPattern(ctx, size);
    applyTexture(ctx, size);

    ctx.restore();
  };

  const drawText = (ctx, size) => {
    const content = textMode === "icons" ? selectedIcon : letter;
    const fontSize = textMode === "icons" ? Math.floor(size * 0.65) : Math.floor(size * 0.55);
    ctx.font = `${fontWeight} ${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const x = size / 2;
    const y = size / 2;

    // Apply effects
    if (designStyle === "shadow") {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillText(content, x + shadowIntensity, y + shadowIntensity);
    }

    if (designStyle === "glow") {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowIntensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Apply 3D effect
    if (designStyle === "3d") {
      // Draw shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillText(content, x + 2, y + 2);
      
      // Draw main text
      ctx.fillStyle = textColor;
      ctx.shadowBlur = 0;
      ctx.fillText(content, x, y);
      
      // Draw highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 0;
      ctx.fillText(content, x - 1, y - 1);
    } else {
      // Draw main text
      if (designStyle === "gradient") {
        const textGradient = ctx.createLinearGradient(0, 0, 0, size);
        textGradient.addColorStop(0, textColor);
        textGradient.addColorStop(1, lightenColor(textColor, 20));
        ctx.fillStyle = textGradient;
      } else {
        ctx.fillStyle = textColor;
      }

      ctx.fillText(content, x, y);
      ctx.shadowBlur = 0;
    }
  };

  const drawLogo = (ctx, size) => {
    if (!uploadedLogo) return;

    const scale = logoScale / 100;
    const logoSize = size * scale;
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;

    // Apply effects
    if (designStyle === "shadow") {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = shadowIntensity;
      ctx.shadowOffsetX = shadowIntensity;
      ctx.shadowOffsetY = shadowIntensity;
    }

    if (designStyle === "glow") {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowIntensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    if (designStyle === "3d") {
      // Draw shadow
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.drawImage(uploadedLogo, x + 2, y + 2, logoSize, logoSize);
      
      // Draw main logo
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.drawImage(uploadedLogo, x, y, logoSize, logoSize);
    } else {
      ctx.drawImage(uploadedLogo, x, y, logoSize, logoSize);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  };

  const drawFavicon = (ctx, size) => {
    // Clear and setup canvas
    ctx.canvas.width = size;
    ctx.canvas.height = size;

    const ratio = window.devicePixelRatio || 1;
    ctx.canvas.style.width = size + "px";
    ctx.canvas.style.height = size + "px";
    ctx.canvas.width = size * ratio;
    ctx.canvas.height = size * ratio;
    ctx.scale(ratio, ratio);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawBackground(ctx, size);

    if (contentType === "text") {
      drawText(ctx, size);
    } else if (contentType === "logo" && uploadedLogo) {
      drawLogo(ctx, size);
    }
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Calculate contrast ratio for accessibility
  const calculateContrastRatio = (color1, color2) => {
    const luminance = (color) => {
      const rgb = color.replace("#", "").match(/.{2}/g).map((c) => parseInt(c, 16) / 255);
      const sRGB = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const lum1 = luminance(color1);
    const lum2 = luminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Get accessibility score
  const getAccessibilityScore = () => {
    if (designStyle === "gradient") {
      // For gradient, we'll check contrast with a mid-point color
      const midColor = lightenColor(gradientColor1, 50);
      return calculateContrastRatio(midColor, textColor);
    } else {
      return calculateContrastRatio(bgColor, textColor);
    }
  };

  // Apply texture pattern to canvas
  const applyTexture = (ctx, size) => {
    if (texture === "none") return;

    ctx.save();
    switch (texture) {
      case "dots":
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let x = 0; x < size; x += 4) {
          for (let y = 0; y < size; y += 4) {
            if ((x + y) % 8 === 0) {
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;
      case "lines":
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        for (let y = 0; y < size; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size, y);
          ctx.stroke();
        }
        break;
      case "grid":
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        for (let x = 0; x < size; x += 4) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, size);
          ctx.stroke();
        }
        for (let y = 0; y < size; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size, y);
          ctx.stroke();
        }
        break;
    }
    ctx.restore();
  };

  // Apply pattern to background
  const applyPattern = (ctx, size) => {
    if (pattern === "none") return;

    ctx.save();
    switch (pattern) {
      case "circles":
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const radius = Math.random() * 10 + 5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case "triangles":
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const triangleSize = Math.random() * 10 + 5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + triangleSize, y + triangleSize);
          ctx.lineTo(x - triangleSize, y + triangleSize);
          ctx.closePath();
          ctx.fill();
        }
        break;
    }
    ctx.restore();
  };

  // Background removal function
  const removeBackground = (img, tolerance = 30) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Sample corner pixels to determine background color
    const corners = [
      [0, 0], // top-left
      [canvas.width - 1, 0], // top-right
      [0, canvas.height - 1], // bottom-left
      [canvas.width - 1, canvas.height - 1] // bottom-right
    ];
    
    // Get the most common corner color as background
    let bgR = 0, bgG = 0, bgB = 0;
    corners.forEach(([x, y]) => {
      const index = (y * canvas.width + x) * 4;
      bgR += data[index];
      bgG += data[index + 1];
      bgB += data[index + 2];
    });
    bgR = Math.floor(bgR / corners.length);
    bgG = Math.floor(bgG / corners.length);
    bgB = Math.floor(bgB / corners.length);
    
    // Remove background pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate color difference
      const diff = Math.sqrt(
        Math.pow(r - bgR, 2) + 
        Math.pow(g - bgG, 2) + 
        Math.pow(b - bgB, 2)
      );
      
      // If similar to background color, make transparent
      if (diff < tolerance) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Convert back to image
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const processedImg = new Image();
        processedImg.onload = () => resolve(processedImg);
        processedImg.src = URL.createObjectURL(blob);
      });
    });
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        setOriginalLogo(img);
        setUploadedImageSrc(e.target.result);
        
        if (backgroundRemovalEnabled) {
          try {
            const processedImg = await removeBackground(img, backgroundRemovalTolerance);
            setProcessedLogo(processedImg);
            setUploadedLogo(processedImg);
          } catch (error) {
            console.error('Background removal failed:', error);
            setUploadedLogo(img);
          }
        } else {
          setUploadedLogo(img);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (contentType === "logo" && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setUploadedImageSrc("");
    setOriginalLogo(null);
    setProcessedLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Effect to reprocess logo when background removal settings change
  useEffect(() => {
    const reprocessLogo = async () => {
      if (originalLogo && backgroundRemovalEnabled) {
        try {
          const processedImg = await removeBackground(originalLogo, backgroundRemovalTolerance);
          setProcessedLogo(processedImg);
          setUploadedLogo(processedImg);
        } catch (error) {
          console.error('Background removal failed:', error);
          setUploadedLogo(originalLogo);
        }
      } else if (originalLogo && !backgroundRemovalEnabled) {
        setUploadedLogo(originalLogo);
        setProcessedLogo(null);
      }
    };

    reprocessLogo();
  }, [backgroundRemovalEnabled, backgroundRemovalTolerance]);

  const generateAllSizes = async () => {
    const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
    const newFaviconData = {};

    for (const size of sizes) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size
      canvas.width = size;
      canvas.height = size;

      // Draw favicon
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      drawBackground(ctx, size);

      if (contentType === "text") {
        // Use the correct content based on text mode
        const content = textMode === "icons" ? selectedIcon : letter;
        const fontSize = textMode === "icons" ? Math.floor(size * 0.65) : Math.floor(size * 0.55);
        
        ctx.font = `${fontWeight} ${fontSize}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (designStyle === "shadow") {
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillText(
            content,
            size / 2 + shadowIntensity,
            size / 2 + shadowIntensity
          );
        }

        if (designStyle === "glow") {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = glowIntensity;
        }

        // Apply 3D effect
        if (designStyle === "3d") {
          // Draw shadow
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillText(content, size / 2 + 2, size / 2 + 2);
          
          // Draw main text
          ctx.fillStyle = textColor;
          ctx.shadowBlur = 0;
          ctx.fillText(content, size / 2, size / 2);
          
          // Draw highlight
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.shadowBlur = 0;
          ctx.fillText(content, size / 2 - 1, size / 2 - 1);
        } else {
          ctx.fillStyle = textColor;
          ctx.fillText(content, size / 2, size / 2);
          ctx.shadowBlur = 0;
        }
      } else if (contentType === "logo" && uploadedLogo) {
        const scale = logoScale / 100;
        const logoSize = size * scale;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        if (designStyle === "shadow") {
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = shadowIntensity;
          ctx.shadowOffsetX = shadowIntensity;
          ctx.shadowOffsetY = shadowIntensity;
        }

        if (designStyle === "glow") {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = glowIntensity;
        }

        if (designStyle === "3d") {
          // Draw shadow
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.drawImage(uploadedLogo, x + 2, y + 2, logoSize, logoSize);
          
          // Draw main logo
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.drawImage(uploadedLogo, x, y, logoSize, logoSize);
        } else {
          ctx.drawImage(uploadedLogo, x, y, logoSize, logoSize);
          ctx.shadowBlur = 0;
        }
      }

      newFaviconData[`${size}x${size}`] = canvas.toDataURL("image/png", 1.0);
    }

    setFaviconData(newFaviconData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contentType === "text" && !letter.trim()) {
      alert("Please enter text for your favicon");
      return;
    }

    if (contentType === "logo" && !uploadedLogo) {
      alert("Please upload a logo image");
      return;
    }

    setIsGenerating(true);

    try {
      await generateAllSizes();
      setShowDownload(true);
    } catch (error) {
      alert("Error generating favicons: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBrandKit = () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name");
      return;
    }

    const newKit = {
      id: Date.now(),
      name: brandName,
      description: brandDescription,
      keywords: brandKeywords,
      bgColor,
      textColor,
      font,
      fontWeight,
      designStyle,
      gradientColor1,
      gradientColor2,
      texture,
      pattern,
    };

    setSavedBrandKits([...savedBrandKits, newKit]);
    setSelectedBrandKit(newKit);
    alert("Brand kit saved successfully!");
  };

  const loadBrandKit = (kit) => {
    setSelectedBrandKit(kit);
    setBrandName(kit.name);
    setBrandDescription(kit.description);
    setBrandKeywords(kit.keywords);
    setBgColor(kit.bgColor);
    setTextColor(kit.textColor);
    setFont(kit.font);
    setFontWeight(kit.fontWeight);
    setDesignStyle(kit.designStyle);
    setGradientColor1(kit.gradientColor1);
    setGradientColor2(kit.gradientColor2);
    setTexture(kit.texture);
    setPattern(kit.pattern);
  };

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return 'showDirectoryPicker' in window;
  };

  // Download individual files to selected directory
  const downloadIndividualFiles = async () => {
    if (!isFileSystemAccessSupported()) {
      alert("File System Access API is not supported in your browser. Please use Chrome/Edge for directory selection.");
      return;
    }

    try {
      // Let user pick a directory
      const directoryHandle = await window.showDirectoryPicker();
      const contentName = contentType === "text" ? (textMode === "icons" ? selectedIcon : letter) : "logo";

      // Define files to create
      const filesToCreate = [
        { name: "favicon.ico", data: faviconData["32x32"] },
        { name: "favicon-16x16.png", data: faviconData["16x16"] },
        { name: "favicon-32x32.png", data: faviconData["32x32"] },
        { name: "favicon-64x64.png", data: faviconData["64x64"] },
        { name: "apple-touch-icon.png", data: faviconData["180x180"] },
        { name: "android-chrome-192x192.png", data: faviconData["192x192"] },
        { name: "android-chrome-512x512.png", data: faviconData["512x512"] },
      ];

      // Create manifest.json content
      const manifest = {
        name: `${contentName} - Premium Favicon`,
        short_name: contentName,
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: bgColor,
        background_color: bgColor,
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
      };

      // Setup guide content
      const setupGuide = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Favicon Setup Guide</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px auto; max-width: 800px; line-height: 1.6; }
        h1 { color: #333; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Favicon Setup Guide</h1>
    <h2>HTML Implementation</h2>
    <pre><code>&lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/manifest.json"&gt;
&lt;meta name="theme-color" content="${bgColor}"&gt;</code></pre>
</body>
</html>`;

      // Create image files
      for (const file of filesToCreate) {
        if (file.data) {
          try {
            const fileHandle = await directoryHandle.getFileHandle(file.name, { create: true });
            const writable = await fileHandle.createWritable();
            
            // Convert base64 to blob
            const base64Data = file.data.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/png" });
            
            await writable.write(blob);
            await writable.close();
          } catch (error) {
            console.error(`Failed to create ${file.name}:`, error);
          }
        }
      }

      // Create manifest.json
      try {
        const manifestHandle = await directoryHandle.getFileHandle("manifest.json", { create: true });
        const manifestWritable = await manifestHandle.createWritable();
        await manifestWritable.write(JSON.stringify(manifest, null, 2));
        await manifestWritable.close();
      } catch (error) {
        console.error("Failed to create manifest.json:", error);
      }

      // Create setup guide
      try {
        const guideHandle = await directoryHandle.getFileHandle("setup-guide.html", { create: true });
        const guideWritable = await guideHandle.createWritable();
        await guideWritable.write(setupGuide);
        await guideWritable.close();
      } catch (error) {
        console.error("Failed to create setup-guide.html:", error);
      }

      alert("✅ All favicon files have been saved to your selected directory!");
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled directory selection
        return;
      }
      console.error("Error saving files:", error);
      alert("❌ Failed to save files to directory. Please try again.");
    }
  };

  // Original zip download function
  const downloadZipPackage = async () => {
    const zip = new JSZip();
    const contentName = contentType === "text" ? (textMode === "icons" ? selectedIcon : letter) : "logo";

    // Add PNG files
    const pngSizes = [
      { size: "16x16", filename: "favicon-16x16.png" },
      { size: "32x32", filename: "favicon-32x32.png" },
      { size: "64x64", filename: "favicon-64x64.png" },
      { size: "180x180", filename: "apple-touch-icon.png" },
      { size: "192x192", filename: "android-chrome-192x192.png" },
      { size: "512x512", filename: "android-chrome-512x512.png" },
    ];

    pngSizes.forEach(({ size, filename }) => {
      if (faviconData[size]) {
        const base64Data = faviconData[size].split(",")[1];
        zip.file(filename, base64Data, { base64: true });
      }
    });

    // Add favicon.ico
    if (faviconData["32x32"]) {
      const icoData = faviconData["32x32"].split(",")[1];
      zip.file("favicon.ico", icoData, { base64: true });
    }

    // Add manifest.json
    const manifest = {
      name: `${contentName} - Premium Favicon`,
      short_name: contentName,
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      theme_color: bgColor,
      background_color: bgColor,
      display: "standalone",
      start_url: "/",
      scope: "/",
      orientation: "portrait",
    };
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

    // Add setup guide
    const setupGuide = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Favicon Setup Guide</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px auto; max-width: 800px; line-height: 1.6; }
        h1 { color: #333; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Favicon Setup Guide</h1>
    <h2>HTML Implementation</h2>
    <pre><code>&lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="manifest" href="/manifest.json"&gt;
&lt;meta name="theme-color" content="${bgColor}"&gt;</code></pre>
</body>
</html>`;
    zip.file("setup-guide.html", setupGuide);

    // Generate and download ZIP
    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `favicon-${contentName}-${designStyle}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Main download handler
  const handleDownload = () => {
    setShowDownloadOptions(true);
  };

  const executeDownload = () => {
    if (downloadFormat === "zip") {
      downloadZipPackage();
    } else {
      downloadIndividualFiles();
    }
    setShowDownloadOptions(false);
  };

  const designOptions = [
    { id: "solid", icon: "🟦", label: "Solid", desc: "Clean & Simple" },
    { id: "gradient", icon: "🌈", label: "Gradient", desc: "Colorful Blend" },
    { id: "shadow", icon: "🌫️", label: "Shadow", desc: "Depth Effect" },
    { id: "outline", icon: "⭕", label: "Outline", desc: "Border Style" },
    { id: "glow", icon: "💫", label: "Glow", desc: "Light Effect" },
    { id: "3d", icon: "🎲", label: "3D", desc: "Dimensional" },
  ];

  const fontOptions = [
    "Inter", "Poppins", "Montserrat", "Playfair Display", "Oswald", "Raleway", 
    "Roboto", "Lato", "Source Sans Pro", "Nunito", "Open Sans", "Merriweather", 
    "Rubik", "Work Sans", "Fira Sans", "Ubuntu", "Libre Baskerville", "PT Sans", 
    "Noto Sans", "Crimson Text", "IBM Plex Sans", "Quicksand", "Space Grotesk", 
    "JetBrains Mono", "Archivo Black", "Bebas Neue", "Righteous", "Anton", 
    "Cabin", "Dosis"
  ];

  const textureOptions = [
    { id: "none", label: "None" },
    { id: "dots", label: "Dots" },
    { id: "lines", label: "Lines" },
    { id: "grid", label: "Grid" },
  ];

  const patternOptions = [
    { id: "none", label: "None" },
    { id: "circles", label: "Circles" },
    { id: "triangles", label: "Triangles" },
  ];

  const animationOptions = [
    { id: "none", label: "None" },
    { id: "pulse", label: "Pulse" },
    { id: "rotate", label: "Rotate" },
    { id: "bounce", label: "Bounce" },
  ];

  // Comprehensive Professional Icon Library
  const iconLibrary = {
    popular: {
      label: "🔥 Popular",
      icons: ["🚀", "⭐", "💎", "🔥", "⚡", "🎯", "💼", "🏆", "🌟", "🎨", "📱", "💡", "🎪", "🎭", "🌈", "✨", "🎵", "🎬"]
    },
    business: {
      label: "💼 Business", 
      icons: ["💼", "📊", "🤝", "🎯", "📈", "⚖️", "🏢", "📋", "💳", "🗂️", "📞", "✉️", "💰", "💵", "📄", "📊", "📉", "📈", "💹", "🏦", "🏪", "🏬", "🛒", "💲", "📝", "🗃️", "📁", "🗄️"]
    },
    technology: {
      label: "⚡ Technology",
      icons: ["⚡", "💻", "🔧", "⚙️", "🔌", "📡", "🛰️", "🖥️", "⌨️", "🖱️", "💾", "🔒", "🔓", "🛡️", "⚙️", "🔧", "🔨", "🧰", "🖲️", "📱", "📟", "📠", "📞", "☎️", "📻", "📺", "⏰", "⏲️", "⏱️", "🧮", "💿", "💽", "💾", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "🕹️", "🗜️", "💡", "🔦", "🏮", "🪔", "🕯️", "🧯", "🛢️", "🔋", "🔌", "💎", "⚗️", "🔬", "🔭", "📡", "🛰️"]
    },
    creative: {
      label: "🎨 Creative",
      icons: ["🎨", "🖌️", "📷", "🎭", "🎪", "🎬", "🎵", "🎸", "✨", "🌈", "🎯", "🖼️", "🎶", "🎤", "🎧", "📹", "📸", "🎞️", "📽️", "🎦", "🎪", "🎨", "🖌️", "🖍️", "📝", "✏️", "✒️", "🖊️", "🖋️", "📐", "📏", "🧮", "📋", "📄", "📃", "📑", "🗒️", "🗓️", "📅", "📆", "🗃️", "🗳️", "🗄️", "📂", "📁", "🗂️", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🧷", "🔗", "📎", "🖇️", "📐", "📏", "📌", "📍", "📌", "🎪"]
    },
    lifestyle: {
      label: "🏠 Lifestyle", 
      icons: ["🏠", "❤️", "☀️", "🌙", "🌱", "🍃", "🌸", "🦋", "🐾", "🎪", "🎈", "🎁", "🌺", "🌻", "🌷", "🌹", "🥀", "🌲", "🌳", "🌴", "🌵", "🌶️", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "☘️", "🍀", "🍃", "🍂", "🍁", "🍄", "🌰", "🎃", "🐚", "🪨", "🌍", "🌎", "🌏", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌛", "🌜", "🌡️", "☀️", "🌝", "🌞", "⭐", "🌟", "🌠", "☁️", "⛅", "⛈️", "🌤️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️"]
    },
    professional: {
      label: "⚖️ Professional",
      icons: ["⚖️", "👑", "💎", "🛡️", "🏅", "🎖️", "🏆", "⭐", "🔱", "⚔️", "🎭", "🔮", "🗝️", "🔐", "🔑", "🗡️", "⚔️", "🛡️", "🏹", "🎯", "🔫", "🧨", "💣", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "⚱️", "🏺", "🔮", "📿", "💈", "⚗️", "🔬", "🔭", "📡", "💉", "💊", "🩹", "🩺", "🌡️", "🧪", "🧫", "🦠", "🧬", "🔬", "🔭", "📡"]
    },
    growth: {
      label: "🌱 Growth",
      icons: ["📈", "🚀", "⬆️", "🌱", "📊", "💹", "🎯", "🔝", "💪", "🌟", "⚡", "🔥", "📉", "📊", "💹", "💰", "💵", "💴", "💶", "💷", "💸", "💳", "🏧", "💎", "⚖️", "💼", "📊", "🤝", "🎯", "📈", "⚖️", "🏢", "📋", "💳", "🗂️", "📞", "✉️"]
    },
    symbols: {
      label: "🔣 Symbols",
      icons: ["✨", "⭐", "🌟", "💫", "⚡", "💥", "🔥", "🌈", "☀️", "🌙", "⭐", "🌟", "💫", "⚡", "💥", "🔥", "🌈", "☀️", "🌙", "❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️"]
    },
    nature: {
      label: "🌿 Nature",
      icons: ["🌿", "🌱", "🌳", "🌲", "🌴", "🌵", "🌾", "🌺", "🌸", "🌼", "🌻", "🌷", "🌹", "🥀", "💐", "🍀", "☘️", "🍃", "🍂", "🍁", "🍄", "🌰", "🦋", "🐝", "🐞", "🕷️", "🦗", "🐛", "🐌", "🐚", "🪲", "🪳", "🕸️", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦏", "🦛", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦔"]
    },
    transport: {
      label: "🚗 Transport",
      icons: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛹", "🛼", "🚁", "🛸", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚀", "🛰️", "🚢", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚁", "🚟", "🚠", "🚡", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🛻", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛴", "🚲", "🛹", "🛼", "⚓", "⛵", "🛶", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🚀", "🛸"]
    },
    food: {
      label: "🍕 Food",
      icons: ["🍕", "🍔", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥗", "🍿", "🧈", "🧂", "🥨", "🥖", "🍞", "🥐", "🥯", "🧇", "🥞", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥗", "🍿", "🧈", "🧂", "🥨", "🥖", "🍞", "🥐", "🥯", "🧇", "🥞", "🧀", "🍖", "🍗", "🥩", "🥓", "🍅", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🥑", "🍆", "🥔", "🍠", "🥐", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥨", "🥯", "🥖", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🌮", "🌯", "🥗", "🥘", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾"]
    },
    sports: {
      label: "⚽ Sports",
      icons: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏑", "🏒", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥽", "🥼", "🦺", "⛷️", "🏂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🏇", "⛷️", "🏂", "🏌️", "🏄", "🚣", "🏊", "⛹️", "🏋️", "🚴", "🚵", "🤸", "🤼", "🤽", "🤾", "🤹", "🧘", "🛀", "🛌", "🕴️", "🗣️", "👤", "👥", "🫂", "👪", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👦‍👦", "👩‍👧‍👧", "👨‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👦‍👦", "👨‍👧‍👧"]
    }
  };

  const premiumFonts = [
    { name: "Inter", category: "Modern", desc: "Clean & Professional", type: "Sans-Serif" },
    { name: "Poppins", category: "Friendly", desc: "Approachable & Bold", type: "Sans-Serif" },
    { name: "Montserrat", category: "Elegant", desc: "Sophisticated & Clean", type: "Sans-Serif" },
    { name: "Playfair Display", category: "Luxury", desc: "High-End & Serif", type: "Serif" },
    { name: "Oswald", category: "Strong", desc: "Impact & Bold", type: "Sans-Serif" },
    { name: "Raleway", category: "Refined", desc: "Elegant & Light", type: "Sans-Serif" },
    { name: "Roboto", category: "Tech", desc: "Google's Choice", type: "Sans-Serif" },
    { name: "Lato", category: "Versatile", desc: "Humanist & Warm", type: "Sans-Serif" },
    { name: "Nunito", category: "Rounded", desc: "Soft & Friendly", type: "Sans-Serif" },
    { name: "Source Sans Pro", category: "Clean", desc: "Adobe's Open Source", type: "Sans-Serif" },
    { name: "Open Sans", category: "Universal", desc: "Most Popular Web Font", type: "Sans-Serif" },
    { name: "Merriweather", category: "Reading", desc: "Perfect for Readability", type: "Serif" },
    { name: "Rubik", category: "Geometric", desc: "Modern Rounded", type: "Sans-Serif" },
    { name: "Work Sans", category: "Minimal", desc: "Clean & Minimal", type: "Sans-Serif" },
    { name: "Fira Sans", category: "Mozilla", desc: "Firefox Creator", type: "Sans-Serif" },
    { name: "Ubuntu", category: "Linux", desc: "Ubuntu's Font", type: "Sans-Serif" },
    { name: "Libre Baskerville", category: "Classic", desc: "Traditional Serif", type: "Serif" },
    { name: "PT Sans", category: "Russian", desc: "Public Type", type: "Sans-Serif" },
    { name: "Noto Sans", category: "Google", desc: "No More Tofu", type: "Sans-Serif" },
    { name: "Crimson Text", category: "Book", desc: "For Books & Magazines", type: "Serif" },
    { name: "IBM Plex Sans", category: "Corporate", desc: "IBM's Typeface", type: "Sans-Serif" },
    { name: "Quicksand", category: "Display", desc: "Modern Display", type: "Sans-Serif" },
    { name: "Space Grotesk", category: "Futuristic", desc: "Space Age Design", type: "Sans-Serif" },
    { name: "JetBrains Mono", category: "Code", desc: "Developer's Choice", type: "Monospace" },
    { name: "Archivo Black", category: "Heavy", desc: "Ultra Bold Impact", type: "Sans-Serif" },
    { name: "Bebas Neue", category: "Headlines", desc: "All Caps Display", type: "Sans-Serif" },
    { name: "Righteous", category: "Retro", desc: "Vintage Feel", type: "Sans-Serif" },
    { name: "Anton", category: "Impact", desc: "Condensed Sans", type: "Sans-Serif" },
    { name: "Cabin", category: "Humanist", desc: "Inspired by Edward Johnston", type: "Sans-Serif" },
    { name: "Dosis", category: "Rounded", desc: "Very Rounded", type: "Sans-Serif" }
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-red-900 to-gray-900 overflow-hidden">
      {/* Main Container - Full Screen Grid Layout */}
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-5 gap-0">
        
        {/* Left Sidebar - Controls */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border-r border-white/20 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-red-200 to-blue-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <span className="text-3xl lg:text-4xl">🎨</span>
                Favicon Studio Pro
              </h1>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className="text-blue-300">⚡</span>
                Create world-class favicons in seconds
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Content Type Selection */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></span>
                  Content Type
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "text", icon: "🔤", label: "Text" },
                    { id: "logo", icon: "🖼️", label: "Logo" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setContentType(option.id)}
                      className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-300 border ${
                        contentType === option.id
                          ? "bg-gradient-to-r from-red-600 to-blue-600 text-white border-transparent shadow-lg transform scale-105"
                          : "bg-white/10 border-white/20 hover:bg-white/20 text-white hover:scale-105"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{option.icon}</span>
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              {contentType === "text" && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                    <span className="text-xl">✍️</span>
                    <span className="w-2 h-2 bg-gradient-to-r from-red-400 to-white rounded-full"></span>
                    Text Content
                  </h3>
                  
                  {/* Content Mode Selection */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "custom", icon: "✍️", label: "Custom", desc: "Type text" },
                      { id: "icons", icon: "🎯", label: "Icons", desc: "Pro library" },
                      { id: "fonts", icon: "🔤", label: "Fonts", desc: "Premium" }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTextMode(mode.id)}
                        className={`p-3 rounded-lg text-center transition-all duration-300 border ${
                          textMode === mode.id
                            ? "bg-gradient-to-r from-red-500 to-blue-500 text-white border-transparent shadow-lg"
                            : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        }`}
                      >
                        <span className="text-lg block mb-1">{mode.icon}</span>
                        <span className="text-xs font-bold block">{mode.label}</span>
                        <span className="text-xs opacity-75">{mode.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Text Input */}
                  {textMode === "custom" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={letter}
                        onChange={(e) => setLetter(e.target.value)}
                        maxLength={3}
                        placeholder="✨ Enter 1-3 characters"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-all text-center text-2xl"
                        required
                      />
                    </div>
                  )}

                  {/* Professional Icon Selection */}
                  {textMode === "icons" && (
                    <div className="space-y-4">
                      {/* Icon Search */}
                      <div className="relative">
                        <input
                          type="text"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="🔍 Search icons..."
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-red-400 focus:outline-none transition-all pl-4"
                        />
                      </div>

                      {/* Icon Categories */}
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                        {Object.entries(iconLibrary).map(([key, category]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setIconCategory(key)}
                            className={`p-2 rounded-lg text-xs transition-all ${
                              iconCategory === key
                                ? "bg-red-500 text-white"
                                : "bg-white/10 text-white/80 hover:bg-white/20"
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>

                      {/* Icon Grid */}
                      <div className="bg-white/10 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2">
                          {(() => {
                            // Enhanced search function - searches across all categories if search term exists
                            let filteredIcons = [];
                            
                            if (iconSearch.trim() === "") {
                              // No search term, show current category
                              filteredIcons = iconLibrary[iconCategory]?.icons || [];
                            } else {
                              // Search across ALL categories
                              Object.entries(iconLibrary).forEach(([categoryKey, category]) => {
                                const matchingIcons = category.icons.filter(icon => {
                                  const searchTerm = iconSearch.toLowerCase();
                                  // Search by icon itself or category name
                                  return icon.toLowerCase().includes(searchTerm) ||
                                         category.label.toLowerCase().includes(searchTerm) ||
                                         categoryKey.toLowerCase().includes(searchTerm);
                                });
                                filteredIcons = [...filteredIcons, ...matchingIcons];
                              });
                              // Remove duplicates
                              filteredIcons = [...new Set(filteredIcons)];
                            }
                            
                            return filteredIcons.map((icon, index) => (
                              <button
                                key={`${icon}-${index}`}
                                type="button"
                                onClick={() => setSelectedIcon(icon)}
                                className={`p-3 rounded-lg text-2xl transition-all hover:scale-110 ${
                                  selectedIcon === icon
                                    ? "bg-red-500 shadow-lg"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                                title={icon}
                              >
                                {icon}
                              </button>
                            ));
                          })()}
                        </div>
                        
                        {/* Search Results Info */}
                        {iconSearch.trim() !== "" && (
                          <div className="mt-3 text-center text-white/70 text-xs">
                            {(() => {
                              let totalResults = 0;
                              Object.entries(iconLibrary).forEach(([categoryKey, category]) => {
                                const matchingIcons = category.icons.filter(icon => {
                                  const searchTerm = iconSearch.toLowerCase();
                                  return icon.toLowerCase().includes(searchTerm) ||
                                         category.label.toLowerCase().includes(searchTerm) ||
                                         categoryKey.toLowerCase().includes(searchTerm);
                                });
                                totalResults += matchingIcons.length;
                              });
                              const uniqueResults = [...new Set(Object.values(iconLibrary).flatMap(category => 
                                category.icons.filter(icon => {
                                  const searchTerm = iconSearch.toLowerCase();
                                  return icon.toLowerCase().includes(searchTerm) ||
                                         Object.values(iconLibrary).some(cat => 
                                           cat.label.toLowerCase().includes(searchTerm) && cat.icons.includes(icon)
                                         );
                                })
                              ))].length;
                              
                              return `🔍 Found ${uniqueResults} icons matching "${iconSearch}"`;
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Selected Icon Display */}
                      <div className="bg-white/10 rounded-xl p-4 text-center">
                        <span className="text-4xl">{selectedIcon}</span>
                        <p className="text-white/70 text-sm mt-2">Selected Icon</p>
                      </div>
                    </div>
                  )}

                  {/* Premium Font Showcase */}
                  {textMode === "fonts" && (
                    <div className="space-y-4">
                      {/* Font Type Filter */}
                      <div className="flex gap-2 flex-wrap">
                        {["All", "Sans-Serif", "Serif", "Monospace"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                            onClick={() => {
                              // Simple filter functionality - you could expand this
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      
                      <div className="bg-white/10 rounded-xl p-4 max-h-80 overflow-y-auto space-y-2">
                        {premiumFonts.map((fontInfo, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFont(fontInfo.name)}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              font === fontInfo.name
                                ? "bg-red-500 text-white"
                                : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div 
                                  className="text-lg font-bold mb-1"
                                  style={{ fontFamily: fontInfo.name }}
                                >
                                  {textMode === "custom" ? (letter || "Aa") : selectedIcon}
                                </div>
                                <div className="text-sm opacity-90 font-semibold">{fontInfo.name}</div>
                                <div className="text-xs opacity-70">{fontInfo.desc}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs bg-blue-500/50 px-2 py-1 rounded mb-1">
                                  {fontInfo.category}
                                </div>
                                <div className="text-xs bg-gray-500/50 px-2 py-1 rounded mb-1">
                                  {fontInfo.type}
                                </div>
                                {font === fontInfo.name && (
                                  <span className="text-xs bg-green-500/50 px-2 py-1 rounded">✓ Active</span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Font Count */}
                        <div className="text-center text-white/70 text-xs pt-2 border-t border-white/20">
                          🔤 {premiumFonts.length} Premium Fonts Available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logo Upload */}
              {contentType === "logo" && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                    <span className="text-xl">🖼️</span>
                    <span className="w-2 h-2 bg-gradient-to-r from-red-400 to-white rounded-full"></span>
                    Logo Upload
                  </h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-white/30 rounded-xl p-6 cursor-pointer transition-all hover:border-red-400 hover:bg-white/5 text-center"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files[0] && handleFileUpload(e.target.files[0])
                      }
                      className="hidden"
                    />

                    {uploadedImageSrc ? (
                      <div className="relative inline-block">
                        <img
                          src={uploadedImageSrc}
                          alt="Uploaded logo"
                          className="max-w-24 max-h-24 rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="text-5xl block mb-4">📁</span>
                        <span className="block text-white font-medium mb-2 flex items-center justify-center gap-2">
                          <span>📄</span>
                          Click to upload or drag & drop
                        </span>
                        <span className="block text-white/60 text-sm flex items-center justify-center gap-2">
                          <span>🎨</span>
                          PNG, JPG, SVG supported
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Background Removal Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                          <span>✂️</span>
                          Smart Background Removal
                        </h4>
                        <p className="text-white/70 text-xs">Remove white/solid backgrounds automatically</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={backgroundRemovalEnabled}
                          onChange={(e) => setBackgroundRemovalEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>

                    {backgroundRemovalEnabled && (
                      <div className="space-y-3 p-4 bg-white/10 rounded-xl">
                        <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                          <span>🎯</span>
                          Removal Sensitivity: {backgroundRemovalTolerance}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={backgroundRemovalTolerance}
                          onChange={(e) => setBackgroundRemovalTolerance(parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-xs text-white/60 flex justify-between">
                          <span>Precise</span>
                          <span>Aggressive</span>
                        </div>
                        
                        {originalLogo && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (originalLogo) {
                                try {
                                  const processedImg = await removeBackground(originalLogo, backgroundRemovalTolerance);
                                  setProcessedLogo(processedImg);
                                  setUploadedLogo(processedImg);
                                } catch (error) {
                                  console.error('Background removal failed:', error);
                                }
                              }
                            }}
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold text-sm rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <span>🔄</span>
                              Reprocess Background
                            </span>
                          </button>
                        )}
                        
                        {originalLogo && processedLogo && (
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedLogo(originalLogo);
                              setProcessedLogo(null);
                            }}
                            className="w-full py-2 bg-white/20 border border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-white/30 transition-all duration-300"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <span>↩️</span>
                              Use Original
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {uploadedLogo && (
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>🔍</span>
                        Logo Scale: {logoScale}%
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={logoScale}
                        onChange={(e) => setLogoScale(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Design Style */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                  <span className="text-xl">🎨</span>
                  <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></span>
                  Design Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {designOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setDesignStyle(option.id)}
                      className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-300 border ${
                        designStyle === option.id
                          ? "bg-gradient-to-r from-red-600 to-black text-white border-transparent shadow-lg"
                          : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{option.icon}</span>
                      <span className="text-xs font-bold block mb-1">
                        {option.label}
                      </span>
                      <span className="text-xs opacity-75">
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                  <span className="text-xl">🎨</span>
                  <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-white rounded-full"></span>
                  Colors
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🖼️</span>
                      Background
                    </label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>

                  {contentType === "text" && (
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>🔤</span>
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Gradient Colors */}
                {designStyle === "gradient" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>🌅</span>
                        Gradient Start
                      </label>
                      <input
                        type="color"
                        value={gradientColor1}
                        onChange={(e) => setGradientColor1(e.target.value)}
                        className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>🌆</span>
                        Gradient End
                      </label>
                      <input
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Glow Controls */}
                {designStyle === "glow" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>✨</span>
                        Glow Intensity: {glowIntensity}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={glowIntensity}
                        onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>💫</span>
                        Glow Color
                      </label>
                      <input
                        type="color"
                        value={glowColor}
                        onChange={(e) => setGlowColor(e.target.value)}
                        className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Shadow Intensity */}
                {designStyle === "shadow" && (
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🌫️</span>
                      Shadow Intensity: {shadowIntensity}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={shadowIntensity}
                      onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Font Settings (Text Mode Only) */}
              {contentType === "text" && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                    <span className="text-xl">🔤</span>
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-white rounded-full"></span>
                    Typography
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>🔤</span>
                        Font Family
                      </label>
                      <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
                      >
                        {fontOptions.map((fontName) => (
                          <option key={fontName} value={fontName} className="bg-gray-800">
                            {fontName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                        <span>💪</span>
                        Font Weight
                      </label>
                      <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
                      >
                        <option value="400" className="bg-gray-800">Regular</option>
                        <option value="600" className="bg-gray-800">Semi Bold</option>
                        <option value="700" className="bg-gray-800">Bold</option>
                        <option value="900" className="bg-gray-800">Black</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-3">
                  <span className="text-xl">⚙️</span>
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></span>
                  Advanced Settings
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🔘</span>
                      Border Radius: {borderRadius}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🗺</span>
                      Border Width: {borderWidth}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                {borderWidth > 0 && (
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🎨</span>
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-full h-12 border border-white/20 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🧽</span>
                      Texture
                    </label>
                    <select
                      value={texture}
                      onChange={(e) => setTexture(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:border-red-400 focus:outline-none transition-all"
                    >
                      {textureOptions.map((option) => (
                        <option key={option.id} value={option.id} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-white/80 text-sm font-medium flex items-center gap-2">
                      <span>🔲</span>
                      Pattern
                    </label>
                    <select
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:border-red-400 focus:outline-none transition-all"
                    >
                      {patternOptions.map((option) => (
                        <option key={option.id} value={option.id} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-black to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <span className="text-lg">⚙️</span>
                      Crafting your masterpiece...
                      <div className="ml-3 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                    <span className="text-xl">🎨</span>
                    Generate World-Class Favicon Package
                    <span className="text-xl">✨</span>
                  </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Preview and Results */}
        <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl overflow-y-auto">
          <div className="p-6 h-full">
            
            {/* Live Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-white rounded-full animate-pulse"></span>
                  Live Preview
                </h2>
                
                {/* Accessibility Score */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white/80 text-sm flex items-center gap-1">
                      <span>♿</span>
                      Accessibility
                    </div>
                    <div className={`text-lg font-bold ${
                      accessibilityScore >= 75 ? "text-white" : 
                      accessibilityScore >= 50 ? "text-blue-300" : "text-red-400"
                    }`}>
                      {accessibilityScore}/100
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${
                    accessibilityScore >= 75 ? "bg-white" : 
                    accessibilityScore >= 50 ? "bg-blue-400" : "bg-red-500"
                  }`}></div>
                </div>
              </div>
              
              {/* Preview Grid */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                  {Object.entries(canvasRefs).map(([size, ref]) => (
                    <div key={size} className="text-center group">
                      <div className="bg-white/20 rounded-xl p-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                        <canvas
                          ref={ref}
                          width={size}
                          height={size}
                          className={`rounded-lg shadow-lg mx-auto ${
                            animationStyle === "pulse" ? "animate-pulse" :
                            animationStyle === "rotate" ? "animate-spin" :
                            animationStyle === "bounce" ? "animate-bounce" : ""
                          }`}
                          style={{ width: size > 64 ? '64px' : `${size}px`, height: size > 64 ? '64px' : `${size}px` }}
                        />
                      </div>
                      <div className="text-white/80 text-sm font-medium mt-3 group-hover:text-white transition-colors flex items-center justify-center gap-1">
                        <span>📐</span>
                        {size}×{size}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand Kit Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-xl">🎭</span>
                <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></span>
                Brand Kit
              </h3>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="🏢 Brand Name"
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-red-400 focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    placeholder="📝 Description"
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-red-400 focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={brandKeywords}
                    onChange={(e) => setBrandKeywords(e.target.value)}
                    placeholder="🏷️ Keywords"
                    className="p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-red-400 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={saveBrandKit}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-black text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <span>💾</span>
                      Save Brand Kit
                    </span>
                  </button>
                  
                  {savedBrandKits.length > 0 && (
                    <select
                      value={selectedBrandKit ? selectedBrandKit.id : ""}
                      onChange={(e) => {
                        const kit = savedBrandKits.find(k => k.id === parseInt(e.target.value));
                        if (kit) loadBrandKit(kit);
                      }}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-red-400 focus:outline-none transition-all"
                    >
                      <option value="" className="bg-gray-800">Load Kit</option>
                      {savedBrandKits.map((kit) => (
                        <option key={kit.id} value={kit.id} className="bg-gray-800">
                          {kit.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
                    className="px-4 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      {showAccessibilityInfo ? (
                        <>
                          <span>🙈</span>
                          Hide Accessibility
                        </>
                      ) : (
                        <>
                          <span>👁️</span>
                          Show Accessibility
                        </>
                      )}
                    </span>
                  </button>
                </div>
                
                {showAccessibilityInfo && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span>📊</span>
                      Accessibility Information
                    </h4>
                    <p className="text-white/70 text-sm mb-3 flex items-center gap-2">
                      <span>🎯</span>
                      Contrast Ratio: {getAccessibilityScore().toFixed(2)}:1
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          accessibilityScore >= 75 ? "bg-white" : 
                          accessibilityScore >= 50 ? "bg-blue-400" : "bg-red-500"
                        }`} 
                        style={{ width: `${accessibilityScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/60">
                      {accessibilityScore >= 75 
                        ? "✅ Meets WCAG AA standards" 
                        : accessibilityScore >= 50 
                        ? "⚠️ Limited contrast - consider adjusting" 
                        : "❌ Does not meet minimum contrast requirements"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Download Section */}
            {showDownload && (
              <div className="bg-gradient-to-r from-red-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-400/30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-white rounded-full animate-pulse"></span>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🎉</span>
                    Ready to Download!
                  </h3>
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-black text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-4"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-xl">📦</span>
                    Download Favicon Package
                    <span className="text-xl">🚀</span>
                  </span>
                </button>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">📬</span>
                    Professional Package Includes:
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>favicon.ico</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                        <span>🔄</span>
                        Multi-size
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>PNG files (16x16-512x512)</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                        <span>📊</span>
                        All sizes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>apple-touch-icon.png</span>
                      <span className="text-xs bg-blue-500/50 px-2 py-1 rounded flex items-center gap-1">
                        <span>📱</span>
                        iOS
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>manifest.json</span>
                      <span className="text-xs bg-purple-500/50 px-2 py-1 rounded flex items-center gap-1">
                        <span>🌐</span>
                        PWA
                      </span>
                    </div>
                    <div className="flex justify-between lg:col-span-2">
                      <span>Setup guide + HTML code</span>
                      <span className="text-xs bg-green-500/50 px-2 py-1 rounded flex items-center gap-1">
                        <span>✅</span>
                        Complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Options Modal */}
      {showDownloadOptions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <span className="text-3xl">📁</span>
                Choose Download Method
              </h3>
              <p className="text-white/70 text-sm">How would you like to receive your favicon files?</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* ZIP Download Option */}
              <label className={`block p-4 rounded-xl cursor-pointer transition-all border-2 ${
                downloadFormat === "zip" 
                  ? "bg-red-500/20 border-red-500 text-white" 
                  : "bg-white/10 border-white/20 hover:bg-white/20 text-white/80"
              }`}>
                <input
                  type="radio"
                  name="downloadFormat"
                  value="zip"
                  checked={downloadFormat === "zip"}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📦</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">ZIP Package</div>
                    <div className="text-sm opacity-80">Download as a single ZIP file</div>
                    <div className="text-xs opacity-60 mt-1">• Easy to share • Standard browser download</div>
                  </div>
                  {downloadFormat === "zip" && <span className="text-red-400">✓</span>}
                </div>
              </label>

              {/* Individual Files Option */}
              <label className={`block p-4 rounded-xl cursor-pointer transition-all border-2 ${
                downloadFormat === "files" 
                  ? "bg-red-500/20 border-red-500 text-white" 
                  : "bg-white/10 border-white/20 hover:bg-white/20 text-white/80"
              }`}>
                <input
                  type="radio"
                  name="downloadFormat"
                  value="files"
                  checked={downloadFormat === "files"}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📂</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Individual Files</div>
                    <div className="text-sm opacity-80">Choose folder & save files directly</div>
                    <div className="text-xs opacity-60 mt-1">• Choose location • Ready to use • Chrome/Edge only</div>
                  </div>
                  {downloadFormat === "files" && <span className="text-red-400">✓</span>}
                </div>
              </label>

              {/* Browser compatibility warning */}
              {downloadFormat === "files" && !isFileSystemAccessSupported() && (
                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-300 text-sm">
                    <span>⚠️</span>
                    <span className="font-semibold">Browser Not Supported</span>
                  </div>
                  <div className="text-yellow-200/80 text-xs mt-1">
                    Directory selection requires Chrome or Edge. Use ZIP option instead.
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDownloadOptions(false)}
                className="flex-1 py-3 px-4 bg-white/20 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={executeDownload}
                disabled={downloadFormat === "files" && !isFileSystemAccessSupported()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-black text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{downloadFormat === "zip" ? "📦" : "📁"}</span>
                  Download
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumFaviconGenerator;