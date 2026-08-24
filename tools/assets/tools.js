const canUsePointerReaction = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUsePointerReaction) {
  let pointerFrame = 0;
  let pointerX = 50;
  let pointerY = 18;
  let targetX = 50;
  let targetY = 18;

  const applyPointerPosition = () => {
    pointerX += (targetX - pointerX) * 0.14;
    pointerY += (targetY - pointerY) * 0.14;
    document.documentElement.style.setProperty('--pointer-x', `${pointerX}%`);
    document.documentElement.style.setProperty('--pointer-y', `${pointerY}%`);

    if (Math.abs(targetX - pointerX) > 0.02 || Math.abs(targetY - pointerY) > 0.02) {
      pointerFrame = window.requestAnimationFrame(applyPointerPosition);
      return;
    }

    pointerFrame = 0;
  };

  window.addEventListener('pointermove', (event) => {
    targetX = (event.clientX / window.innerWidth) * 100;
    targetY = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--pointer-opacity', '1');

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(applyPointerPosition);
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    document.documentElement.style.setProperty('--pointer-opacity', '0');
  });
}
