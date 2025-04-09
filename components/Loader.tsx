export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}
