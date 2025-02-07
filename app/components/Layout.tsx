export default function Layout({ children, backgroundUrl }) {
    return (
      <div
        style={{
          background: `url('${backgroundUrl}')`,
          backgroundSize: "cover",
        }}
        className="min-h-screen flex items-center justify-center"
      >
        {children}
      </div>
    );
  }