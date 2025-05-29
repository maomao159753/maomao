<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beating Heart</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
            background-color: black;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function drawHeart(x, y, size) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x + size, y + size / 3, x, y + size);
            ctx.bezierCurveTo(x - size, y + size / 3, x - size / 2, y - size / 2, x, y);
            ctx.fillStyle ='red';
            ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fill();
        }

        let size = 50;
        let direction = 1;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawHeart(canvas.width / 2, canvas.height / 2, size);
            size += direction;
            if (size >= 70 || size <= 30) {
                direction = -direction;
            }
            requestAnimationFrame(animate);
        }

        animate();
    </script>
</body>
</html>
