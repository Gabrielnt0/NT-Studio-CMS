function PageContainer({ children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {children}
    </div>
  );
}

export default PageContainer;