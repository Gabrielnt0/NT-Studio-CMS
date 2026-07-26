function Card({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-2xl border border-zinc-800 bg-zinc-900/60",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export default Card;