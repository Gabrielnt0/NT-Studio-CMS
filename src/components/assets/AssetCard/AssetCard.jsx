import AssetFooter from "./AssetFooter";
import AssetImage from "./AssetImage";
import AssetOverlay from "./AssetOverlay";
import AssetSelection from "./AssetSelection";

export default function AssetCard({
  imageUrl,
  imageAlt = "",
  imageFit = "cover",
  title,
  subtitle,
  metaLeft,
  metaRight,
  actions,
  onClick,
  selectable = false,
  selected = false,
  onSelectionChange,
  className = "",
}) {
  function handleCardClick() {
    if (selectable && onSelectionChange) {
      onSelectionChange(!selected);
      return;
    }

    onClick?.();
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleCardClick();
  }

  function handleSelectionClick() {
    onSelectionChange?.(!selected);
  }

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick || selectable ? 0 : undefined}
      role={onClick || selectable ? "button" : undefined}
      aria-pressed={selectable ? selected : undefined}
      className={`group relative overflow-visible rounded-2xl border bg-zinc-900 transition ${
        onClick || selectable ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-blue-500 ring-2 ring-blue-500/30"
          : "border-zinc-800 hover:-translate-y-1 hover:border-zinc-700"
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-zinc-950">
        <AssetImage
          src={imageUrl}
          alt={imageAlt}
          fit={imageFit}
        />

        <AssetOverlay />

        {selectable && (
          <AssetSelection
            selected={selected}
            onClick={handleSelectionClick}
          />
        )}
      </div>

      <AssetFooter
        title={title}
        subtitle={subtitle}
        metaLeft={metaLeft}
        metaRight={metaRight}
        actions={actions}
      />
    </article>
  );
}