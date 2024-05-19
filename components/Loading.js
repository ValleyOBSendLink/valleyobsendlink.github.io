export default function Loading({ children }) {
  return (
    <>
      {children}
      <div id="loading">
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    </>
  );
}
