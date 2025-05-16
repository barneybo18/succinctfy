import type { ColorOption } from '../types'; // Assuming your ColorOption type is in src/types.ts

// --- Helper Functions ---

// Function to create rounded rectangles
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  radius = Math.min(radius, Math.min(width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

// Function to draw rounded rectangle with shadow (creates floating effect)
function drawRoundedRectWithShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  shadowBlur: number,
  shadowColor: string
) {
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadowBlur / 2;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowColor = shadowColor;

  roundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = 'rgba(0,0,0,0.01)'; // Transparent fill to create shadow
  ctx.fill();
  ctx.restore();
}

// Function to adjust color brightness
function adjustColorBrightness(hexColor: string, factor: number): string {
  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.floor(r * factor)));
  g = Math.min(255, Math.max(0, Math.floor(g * factor)));
  b = Math.min(255, Math.max(0, Math.floor(b * factor)));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, doFill: boolean = false) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(hx, hy);
    } else {
      ctx.lineTo(hx, hy);
    }
  }
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

// Function to draw hexagon pattern background
function drawHexagonPattern(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  width: number,
  height: number
) {
  const hexSize = width * 0.03;
  const cols = Math.ceil(width / (hexSize * 1.5)) + 2; // +2 for overlap
  const rows = Math.ceil(height / (hexSize * 1.732)) + 2; // +2 for overlap

  ctx.save();
  ctx.lineWidth = 1;

  for (let r = -1; r < rows; r++) { // Start from -1 to ensure edges are covered
    for (let c = -1; c < cols; c++) {
      const x = c * hexSize * 1.5;
      const y = r * hexSize * 1.732 + (c % 2) * (hexSize * 0.866);

      const randomFactor = Math.random();
      if (randomFactor < 0.3) { // Draw some hexagons outlined
        ctx.globalAlpha = 0.03 + Math.random() * 0.05; // Vary opacity
        ctx.strokeStyle = adjustColorBrightness(baseColor, 1.4);
        drawHexagon(ctx, x, y, hexSize, false); // false for not filling
      } else if (randomFactor < 0.5) { // Draw some filled lightly
        ctx.globalAlpha = 0.02 + Math.random() * 0.03;
        ctx.fillStyle = adjustColorBrightness(baseColor, 1.2);
        drawHexagon(ctx, x, y, hexSize, true); // true for filling
      }
    }
  }
  ctx.restore();
}

function drawAbstractTechGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  teamColor: string
) {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = adjustColorBrightness(teamColor, 0.7); // Darker grid lines
  ctx.lineWidth = 0.5;

  const gridSize = width * 0.05;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5;
  const numShapes = 20;
  for (let i = 0; i < numShapes; i++) {
    ctx.beginPath();
    const shapeX = Math.random() * width;
    const shapeY = Math.random() * height;
    const shapeSize = Math.random() * (gridSize / 2) + (gridSize / 4);
    ctx.strokeStyle = Math.random() > 0.5 ? teamColor : adjustColorBrightness(teamColor, 1.3);

    if (Math.random() > 0.66) {
      ctx.moveTo(shapeX, shapeY - shapeSize / 2);
      ctx.lineTo(shapeX + shapeSize / 2, shapeY + shapeSize / 2);
      ctx.lineTo(shapeX - shapeSize / 2, shapeY + shapeSize / 2);
      ctx.closePath();
    } else if (Math.random() > 0.33) {
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = startAngle + Math.PI * (0.5 + Math.random() * 1.2);
      ctx.arc(shapeX, shapeY, shapeSize / 2, startAngle, endAngle);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawPatternedText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
) {
  const texts = ["sp1", "prover", "stage 2", "op succinct", "zk", "SNARK", "recursion", "verify", "polynomial", "commit", "0x", "circuit", "trusted setup"];
  const count = 60;
  const baseFontSize = Math.max(10, Math.min(15, width * 0.01));
  const funAngles = [-Math.PI / 12, 0, Math.PI / 12, Math.PI / 18, -Math.PI / 18];

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < count; i++) {
    const text = texts[Math.floor(Math.random() * texts.length)];
    const x = Math.random() * width;
    const y = Math.random() * height;
    const angle = funAngles[Math.floor(Math.random() * funAngles.length)];
    const opacity = Math.random() * 0.09 + 0.07;
    const fontSize = baseFontSize + (Math.random() - 0.5) * 3;
    const brightnessFactor = 0.55 + Math.random() * 0.3;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `${fontSize}px 'Courier New', monospace, sans-serif`;
    ctx.fillStyle = adjustColorBrightness(baseColor, brightnessFactor);
    ctx.globalAlpha = opacity;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawFloatingEffect(
  ctx: CanvasRenderingContext2D,
  gpuImage: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  teamColor: string
) {
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 30;
  ctx.shadowColor = `${teamColor}33`;
  ctx.drawImage(gpuImage, x, y, width, height);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 15;
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.drawImage(gpuImage, x, y, width, height);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.translate(0, 2 * y + height);
  ctx.scale(1, -0.2);
  ctx.drawImage(gpuImage, x, y, width, height);
  ctx.restore();
}

function angularRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, cornerCut: number) {
  ctx.beginPath();
  ctx.moveTo(x + cornerCut, y);
  ctx.lineTo(x + width - cornerCut, y);
  ctx.lineTo(x + width, y + cornerCut);
  ctx.lineTo(x + width, y + height - cornerCut);
  ctx.lineTo(x + width - cornerCut, y + height);
  ctx.lineTo(x + cornerCut, y + height);
  ctx.lineTo(x, y + height - cornerCut);
  ctx.lineTo(x, y + cornerCut);
  ctx.closePath();
}

function drawTeamTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colorOption: ColorOption
) {
  const cornerCut = height * 0.2;
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.shadowBlur = 15;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, adjustColorBrightness(colorOption.heartColor, 0.8));
  gradient.addColorStop(0.5, colorOption.heartColor);
  gradient.addColorStop(1, adjustColorBrightness(colorOption.heartColor, 0.8));
  ctx.fillStyle = gradient;
  angularRect(ctx, x, y, width, height, cornerCut);
  ctx.fill();
  ctx.strokeStyle = adjustColorBrightness(colorOption.heartColor, 1.3);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  angularRect(ctx, x + ctx.lineWidth, y + ctx.lineWidth, width - ctx.lineWidth * 2, height - ctx.lineWidth * 2, cornerCut - ctx.lineWidth > 0 ? cornerCut - ctx.lineWidth : 2);
  ctx.stroke();
  ctx.globalAlpha = 0.15;
  const glossGradient = ctx.createLinearGradient(x, y, x, y + height / 2);
  glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
  glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = glossGradient;
  angularRect(ctx, x, y, width, height / 1.8, cornerCut);
  ctx.fill();
  ctx.restore();
}

function drawCircuitLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  teamColor: string
) {
  const lineCount = Math.floor(width / 80);
  const segmentLength = width / 12;
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < lineCount; i++) {
    ctx.beginPath();
    let currentX = Math.random() * width;
    let currentY = Math.random() * height;
    ctx.moveTo(currentX, currentY);
    const pathLength = Math.random() * 6 + 4;
    for (let j = 0; j < pathLength; j++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * segmentLength + segmentLength / 2;
      currentX += Math.cos(angle) * length;
      currentY += Math.sin(angle) * length;
      ctx.lineTo(currentX, currentY);
      if (Math.random() > 0.65) {
        ctx.save();
        ctx.fillStyle = teamColor;
        ctx.globalAlpha = 0.85 + Math.random() * 0.15;
        ctx.beginPath();
        ctx.arc(currentX, currentY, Math.random() * 3 + 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.shadowColor = teamColor;
    ctx.shadowBlur = 10 + Math.random() * 10;
    ctx.strokeStyle = adjustColorBrightness(teamColor, 1.2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawGlowingParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  teamColor: string,
  count: number
) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3.5 + 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
    gradient.addColorStop(0, adjustColorBrightness(teamColor, 1.1));
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.globalAlpha = Math.random() * 0.4 + 0.4;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${Math.floor(width * 0.02)}px Arial`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Team Repping Generator', width - 15, height - 10);
  ctx.restore();
}

interface GeneratePosterParams {
  baseImageUrl: string;
  finalColor: ColorOption;
  currentGpuImage: HTMLImageElement | null;
  currentUsername: string;
}

export async function generatePosterDataUrl({
  baseImageUrl,
  finalColor,
  currentGpuImage,
  currentUsername,
}: GeneratePosterParams): Promise<string> {
  const imgToProcess = new Image();
  imgToProcess.crossOrigin = "anonymous";
  imgToProcess.src = baseImageUrl;

  await new Promise((resolve, reject) => {
    imgToProcess.onload = resolve;
    imgToProcess.onerror = () => reject(new Error('Failed to load the image for editing'));
  });

  const canvasWidth = 1280;
  const canvasHeight = canvasWidth * (9 / 16);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  gradient.addColorStop(0, adjustColorBrightness(finalColor.bgColor, 0.4));
  gradient.addColorStop(0.7, adjustColorBrightness(finalColor.bgColor, 0.8));
  gradient.addColorStop(1, finalColor.bgColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawHexagonPattern(ctx, finalColor.bgColor, canvasWidth, canvasHeight);
  drawAbstractTechGrid(ctx, canvasWidth, canvasHeight, finalColor.heartColor);
  drawPatternedText(ctx, canvasWidth, canvasHeight, finalColor.heartColor);

  const padding = canvasWidth * 0.04;
  const gpuSectionWidth = canvasWidth * 0.52;
  const userSectionWidth = canvasWidth - gpuSectionWidth - padding * 2.5;
  const userSectionX = padding;
  const gpuSectionX = userSectionWidth + padding * 2;

  let userImgMaxHeight = canvasHeight * 0.65;
  let userImgMaxWidth = userSectionWidth * 0.9;
  let userImgDrawWidth = imgToProcess.width;
  let userImgDrawHeight = imgToProcess.height;
  const userImgAspectRatio = userImgDrawWidth / userImgDrawHeight;

  if (userImgDrawHeight > userImgMaxHeight) {
    userImgDrawHeight = userImgMaxHeight;
    userImgDrawWidth = userImgDrawHeight * userImgAspectRatio;
  }
  if (userImgDrawWidth > userImgMaxWidth) {
    userImgDrawWidth = userImgMaxWidth;
    userImgDrawHeight = userImgDrawWidth / userImgAspectRatio;
  }

  const userImgX = userSectionX + (userSectionWidth - userImgDrawWidth) / 2;
  const userImgY = padding * 2;
  const borderWidth = Math.max(8, userImgDrawWidth * 0.02);
  const cornerRadius = userImgDrawWidth * 0.5;

  drawRoundedRectWithShadow(ctx, userImgX, userImgY, userImgDrawWidth, userImgDrawHeight, cornerRadius, 15, `${adjustColorBrightness(finalColor.heartColor, 0.2)}AA`);

  ctx.save();
  const borderRectX = userImgX - borderWidth;
  const borderRectY = userImgY - borderWidth;
  const borderRectWidth = userImgDrawWidth + borderWidth * 2;
  const borderRectHeight = userImgDrawHeight + borderWidth * 2;
  const borderCornerRadius = cornerRadius + borderWidth;
  const borderGradient = ctx.createLinearGradient(borderRectX, borderRectY, borderRectX + borderRectWidth, borderRectY + borderRectHeight);
  borderGradient.addColorStop(0, adjustColorBrightness(finalColor.heartColor, 0.7));
  borderGradient.addColorStop(0.5, finalColor.heartColor);
  borderGradient.addColorStop(1, adjustColorBrightness(finalColor.heartColor, 1.3));
  ctx.fillStyle = borderGradient;
  roundedRect(ctx, borderRectX, borderRectY, borderRectWidth, borderRectHeight, borderCornerRadius);
  ctx.fill();
  ctx.strokeStyle = adjustColorBrightness(finalColor.heartColor, 1.5);
  ctx.lineWidth = borderWidth * 0.15;
  roundedRect(ctx, borderRectX + ctx.lineWidth / 2, borderRectY + ctx.lineWidth / 2, borderRectWidth - ctx.lineWidth, borderRectHeight - ctx.lineWidth, borderCornerRadius - ctx.lineWidth / 2 > 0 ? borderCornerRadius - ctx.lineWidth / 2 : 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  roundedRect(ctx, userImgX, userImgY, userImgDrawWidth, userImgDrawHeight, cornerRadius);
  ctx.clip();
  ctx.drawImage(imgToProcess, userImgX, userImgY, userImgDrawWidth, userImgDrawHeight);
  ctx.restore();

  if (currentGpuImage) {
    let gpuDrawWidth = currentGpuImage.width;
    let gpuDrawHeight = currentGpuImage.height;
    const gpuAspectRatio = gpuDrawWidth / gpuDrawHeight;
    gpuDrawWidth = gpuSectionWidth * 0.95;
    gpuDrawHeight = gpuDrawWidth / gpuAspectRatio;
    if (gpuDrawHeight > canvasHeight * 0.85) {
      gpuDrawHeight = canvasHeight * 0.85;
      gpuDrawWidth = gpuDrawHeight * gpuAspectRatio;
    }
    const gpuX = gpuSectionX + (gpuSectionWidth - gpuDrawWidth) / 2;
    const gpuY = (canvasHeight - gpuDrawHeight) / 2;
    drawFloatingEffect(ctx, currentGpuImage, gpuX, gpuY, gpuDrawWidth, gpuDrawHeight, finalColor.heartColor);
  }

  const displayUsername = currentUsername.toUpperCase();
  const usernameFontSize = Math.floor(userSectionWidth * 0.09);
  const usernameY = userImgY + userImgDrawHeight + padding * 0.8 + usernameFontSize;
  ctx.font = `bold ${usernameFontSize}px 'Segoe UI', 'Roboto', sans-serif`;
  ctx.fillStyle = finalColor.heartColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = usernameFontSize * 0.08;
  ctx.shadowOffsetX = usernameFontSize * 0.04;
  ctx.shadowOffsetY = usernameFontSize * 0.04;
  ctx.fillText(displayUsername, userSectionX + userSectionWidth / 2, usernameY);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const tagHeight = canvasHeight * 0.12;
  const tagWidth = userSectionWidth * 0.8;
  const tagX = userSectionX + (userSectionWidth - tagWidth) / 2;
  const tagY = usernameY + padding * 0.4;
  drawTeamTag(ctx, tagX, tagY, tagWidth, tagHeight, finalColor);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = Math.floor(tagHeight * 0.45);
  ctx.font = `bold ${fontSize}px 'Segoe UI', 'Roboto', sans-serif`;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = fontSize * 0.05;
  ctx.strokeText(`TEAM ${finalColor.name.toUpperCase()}`, tagX + tagWidth / 2, tagY + tagHeight / 2);
  ctx.fillText(`TEAM ${finalColor.name.toUpperCase()}`, tagX + tagWidth / 2, tagY + tagHeight / 2);

  drawCircuitLines(ctx, canvasWidth, canvasHeight, finalColor.heartColor);
  drawGlowingParticles(ctx, canvasWidth, canvasHeight, finalColor.heartColor, 35);
  drawWatermark(ctx, canvasWidth, canvasHeight);

  return canvas.toDataURL('image/png');
}