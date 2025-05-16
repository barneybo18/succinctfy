export const drawHeart = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);

  // Draw the left curve
  ctx.bezierCurveTo(
    x, y,
    x - size / 2, y,
    x - size / 2, y + size / 4
  );

  // Draw the left bottom part
  ctx.bezierCurveTo(
    x - size / 2, y + size / 2,
    x, y + size * 3 / 4,
    x, y + size
  );

  // Draw the right bottom part
  ctx.bezierCurveTo(
    x, y + size * 3 / 4,
    x + size / 2, y + size / 2,
    x + size / 2, y + size / 4
  );

  // Draw the right curve
  ctx.bezierCurveTo(
        x + size / 2, y,
    x, y,
    x, y + size / 4
  );

  ctx.fillStyle = color;
  ctx.fill();

  // Add a slight pattern to the heart
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = size / 15;
  ctx.beginPath();
  ctx.arc(x - size / 4, y + size / 3, size / 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
};