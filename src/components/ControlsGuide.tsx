const controls = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["↑"], label: "Rotate" },
  { keys: ["↓"], label: "Soft drop" },
  { keys: ["SPACE"], label: "Hard drop" },
  { keys: ["P"], label: "Pause" }
];

export const ControlsGuide = () => {
  return (
    <aside className="left-column">
      <div className="brand-mark">
        <span className="brand-icon">N</span>
        <span>
          NEON
          <br />
          <b>BLOCKS</b>
        </span>
      </div>
      <div className="intro-copy">
        <span className="eyebrow">ARCADE PROTOCOL / 07</span>
        <h1 aria-label="Neon Blocks">
          Neon
          <br />
          <em>Blocks</em>
        </h1>
        <p>
          Stack the signal.
          <br />
          Clear the noise.
        </p>
      </div>
      <section className="controls-panel">
        <div className="panel-heading">
          <span>Controls</span>
          <span>KEYBOARD</span>
        </div>
        {controls.map(({ keys, label }) => (
          <div className="control-row" key={label}>
            <span>
              {keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </span>
            <b>{label}</b>
          </div>
        ))}
      </section>
      <p className="desktop-note">
        <span /> Desktop mode optimized
      </p>
    </aside>
  );
};
