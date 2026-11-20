export function CodeBlock({ code, language }) {
  return (
    <pre className="code" tabIndex={0} aria-label={`${language} code`}>
      <code>{code}</code>
    </pre>
  );
}
