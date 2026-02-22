import React, {useEffect, useRef, useState} from 'react';

const WheelComponent = ({
    segments,
    segColors,
    winningSegment,
    onStart = ()=>{},
    onSpinProgress,
    onFinished = () => {},
    primaryColor,
    contrastColor,
    buttonText,
    isOnlyOnce = true,
    size = 290,
    upDuration = 100,
    downDuration = 1000,
    fontFamily = 'proxima-nova',
    wheelHeight = 720,
    wheelWidth = 600,
    enableScrollTop = true,
    multilineDelimiter = null
}) => {
    let currentSegment = '';
    let currentSegmentLabel = '';
    let isStarted = false;
    const [isFinished, setFinished] = useState(false);
    const timerHandleRef = useRef(0);
    const isMountedRef = useRef(true);
    const timerDelay = segments.length / 2;
    let angleCurrent = 0;
    let angleDelta = 0;
    let canvasContext = null;
    let maxSpeed = Math.PI / `${segments.length}`* 4;
    const upTime = segments.length * upDuration;
    const downTime = segments.length * downDuration;
    let spinStart = 0;
    let frames = 0;
    const centerX = Math.round(wheelWidth/2);
    const centerY = Math.round(wheelHeight/2.5);

    useEffect(() => {
        isMountedRef.current = true;
        wheelInit();
        if (enableScrollTop) {
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 0);
        }
        return () => {
            isMountedRef.current = false;
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
                timerHandleRef.current = 0;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // const spinButton = new Path2D();
    // TODO: fix scope issues with button
    // canvasContext.beginPath();
    // spinButton.arc(centerX, centerY, 50, 0, 2 * Math.PI, false);
    // canvasContext.fill(rectangle);
    // canvasContext.beginPath();
    // canvasContext.arc(centerX, centerY, 50, 0, PI2, false);
    // canvasContext.closePath();

    const wheelInit = () => {
        initCanvas();
        wheelDraw();
    };

    const initCanvas = () => {
        let canvas = document.getElementById('canvas');
        if (navigator.appVersion.indexOf('MSIE') !== -1) {
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', wheelWidth);
            canvas.setAttribute('height', wheelHeight);
            canvas.setAttribute('id', 'canvas');
            document.getElementById('wheel').appendChild(canvas);
        }
        canvas.addEventListener('click', spin, false);
        canvasContext = canvas.getContext('2d');
    };
    const spin = (event) => {
        // if (!canvasContext.isPointInPath(spinButton, event.offsetX, event.offsetY)) {
        //     return;
        // }
        isStarted = true;
        if (timerHandleRef.current === 0) {
            spinStart = new Date().getTime();
            // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
            maxSpeed = Math.max(0.4, Math.PI / segments.length);
            frames = 0;
            timerHandleRef.current = setInterval(onTimerTick, timerDelay);
        }
        // console.log({maxSpeed});
        onStart();
    };
    const onTimerTick = () => {
        frames++;
        draw();
        const duration = new Date().getTime() - spinStart;
        let progress = 0;
        let finished = false;
        if (duration < upTime) {
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            if (winningSegment) {
                if (currentSegment === winningSegment && frames > segments.length) {
                    progress = duration / upTime;
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                    progress = 1;
                } else {
                    progress = duration / downTime;
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                }
            } else {
                progress = duration / downTime;
                angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            }
            if (progress >= 1) {
                finished = true;
            }
        }

        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) {
            angleCurrent -= Math.PI * 2;
        }
        if (finished) {
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
                timerHandleRef.current = 0;
            }
            angleDelta = 0;
            if (isMountedRef.current) {
                setFinished(true);
                onFinished(currentSegment);
            }
        }
        onSpinProgress && onSpinProgress({finished, progress, frames})
    };

    const wheelDraw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const draw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const drawSegment = (key, lastAngle, angle) => {
        const ctx = canvasContext;
        const value = segments[key];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = segColors[key];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = contrastColor || 'white';
        ctx.font = 'bold 1em ' + fontFamily;
        // ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
        if (multilineDelimiter && value.indexOf(multilineDelimiter) !== -1) {
            ctx.fillText(value.substr(0, value.indexOf(multilineDelimiter)), size / 2 + 25, -3);
            ctx.font = '0.75em ' + fontFamily;
            ctx.fillText(value.substr(value.indexOf(multilineDelimiter) + 1, 21), size / 2 + 25, 11);
        } else {
            ctx.fillText(value.substr(0, 21), size / 2 + 25, 0)
        }
        ctx.restore();
    };

    const drawWheel = () => {
        const ctx = canvasContext;
        let lastAngle = angleCurrent;
        const len = segments.length;
        const PI2 = Math.PI * 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor || 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '1em ' + fontFamily;
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        // Draw a center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = primaryColor || 'black';
        ctx.lineWidth = 10;
        ctx.strokeStyle = contrastColor || 'white';
        ctx.fill();
        ctx.font = 'bold 1em ' + fontFamily;
        ctx.fillStyle = contrastColor || 'white';
        ctx.textAlign = 'center';
        ctx.fillText(buttonText || 'Spin', centerX, centerY + 3);
        ctx.stroke();

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();

        ctx.lineWidth = 10;
        ctx.strokeStyle = primaryColor || 'black';
        ctx.stroke();
    };

    const drawNeedle = () => {
        const ctx = canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = contrastColor || 'white';
        ctx.fileStyle = contrastColor || 'white';
        ctx.beginPath();
        ctx.moveTo(centerX + 20, centerY - 50);
        ctx.lineTo(centerX - 20, centerY - 50);
        ctx.lineTo(centerX, centerY - 70);
        ctx.closePath();
        ctx.fill();
        const change = angleCurrent + Math.PI / 2;
        let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
        if (i < 0) {
            i = i + segments.length;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = primaryColor || 'black';
        ctx.font = 'bold 1.5em ' + fontFamily;
        currentSegment = segments[i];

        // prevent displaying 'undefined' as the selected label
        currentSegmentLabel = currentSegment || '';
        if (isStarted) {
            ctx.fillText(currentSegmentLabel, centerX + 10, centerY + size + 50);
        }
    };
    const clear = () => {
        const ctx = canvasContext;
        ctx.clearRect(0, 0, wheelWidth, wheelHeight);
    };

    let pointerEvents = 'auto';
    if (isFinished && isOnlyOnce) {
        pointerEvents = 'none'
    }

    return (
        <div id="wheel" style={{position: 'relative'}}>
            <canvas id="canvas" width={wheelWidth} height={wheelHeight} style={{pointerEvents}}/>
        </div>
    );
};
export default WheelComponent;
