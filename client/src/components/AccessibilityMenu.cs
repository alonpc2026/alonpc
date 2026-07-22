/* AccessibilityMenu.css - FULL REPLACE */

.accessibility-wrapper {
  position: fixed;
  left: 18px;
  bottom: 18px;
  z-index: 9999;
}

.accessibility-floating-button {
  width: 64px;
  height: 64px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: linear-gradient(180deg, #247cf2, #0a48ae);
  color: #ffffff;
  font-size: 34px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.38);
  cursor: pointer;
}

.accessibility-panel {
  position: absolute;
  left: 0;
  bottom: 78px;
  width: min(340px, calc(100vw - 36px));
  padding: 18px;
  border: 2px solid #75b5ff;
  border-radius: 18px;
  background: #082558;
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.accessibility-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.accessibility-panel__header h2 {
  margin: 0;
}

.accessibility-panel button {
  width: 100%;
  min-height: 48px;
  margin-top: 10px;
  padding: 10px 14px;
  border: 2px solid #7fb7ff;
  border-radius: 12px;
  background: #ffffff;
  color: #093f91;
  font-weight: 900;
  cursor: pointer;
}

.accessibility-panel button:hover,
.accessibility-panel button.active {
  background: #ffd500;
  color: #071a3c;
}

.accessibility-font-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.accessibility-font-controls button {
  margin-top: 0;
}

.accessibility-panel .accessibility-reset {
  background: #d52c42;
  color: #ffffff;
  border-color: #ff8a99;
}

.accessibility-high-contrast {
  background: #000000 !important;
  color: #ffff00 !important;
}

.accessibility-high-contrast * {
  background-color: #000000 !important;
  color: #ffff00 !important;
  border-color: #ffff00 !important;
  box-shadow: none !important;
}

.accessibility-grayscale {
  filter: grayscale(1);
}

.accessibility-underline-links a {
  text-decoration: underline !important;
  text-decoration-thickness: 3px !important;
  text-underline-offset: 4px !important;
}

.accessibility-readable-font,
.accessibility-readable-font * {
  font-family: Arial, Verdana, sans-serif !important;
  letter-spacing: 0.03em;
  line-height: 1.65;
}

@media (max-width: 600px) {
  .accessibility-wrapper {
    left: 10px;
    bottom: 10px;
  }

  .accessibility-floating-button {
    width: 56px;
    height: 56px;
    font-size: 30px;
  }
}
