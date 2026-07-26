function PageContainer({ children }) {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 lg:px-8">
      {children}
    </div>
  );
}

export default PageContainer;