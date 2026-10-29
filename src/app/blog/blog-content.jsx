import { Fragment } from "react";

function parseDelta(content) {
  try {
    const value = JSON.parse(content);
    return Array.isArray(value?.ops) ? value : null;
  } catch {
    return null;
  }
}

function safeLink(value) {
  return /^(https?:|mailto:|\/(?!\/)|#)/i.test(value) ? value : null;
}

function renderDeltaText(text, attributes = {}, key) {
  let content = text;
  const link =
    typeof attributes.link === "string" ? safeLink(attributes.link) : null;
  if (link) {
    content = (
      <a
        href={link}
        key={`${key}-link`}
        className="text-[#c2410c] underline underline-offset-2"
        rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
        target={link.startsWith("http") ? "_blank" : undefined}
      >
        {content}
      </a>
    );
  }

  for (const [format, Tag] of [
    ["bold", "strong"],
    ["italic", "em"],
    ["underline", "u"],
    ["strike", "s"],
  ]) {
    if (attributes[format]) {
      content = <Tag key={`${key}-${format}`}>{content}</Tag>;
    }
  }

  return <Fragment key={key}>{content}</Fragment>;
}

function renderRichText(delta, className) {
  const lines = [];
  let segments = [];

  for (const [operationIndex, operation] of delta.ops.entries()) {
    if (!operation || typeof operation.insert !== "string") {
      continue;
    }

    const attributes = operation.attributes || {};
    let start = 0;
    let newlineIndex = operation.insert.indexOf("\n");

    while (newlineIndex !== -1) {
      const text = operation.insert.slice(start, newlineIndex);
      if (text) {
        segments.push(
          renderDeltaText(
            text,
            attributes,
            `text-${operationIndex}-${start}`,
          ),
        );
      }
      lines.push({ content: segments, attributes });
      segments = [];
      start = newlineIndex + 1;
      newlineIndex = operation.insert.indexOf("\n", start);
    }

    const remainingText = operation.insert.slice(start);
    if (remainingText) {
      segments.push(
        renderDeltaText(
          remainingText,
          attributes,
          `text-${operationIndex}-${start}`,
        ),
      );
    }
  }

  if (segments.length) {
    lines.push({ content: segments, attributes: {} });
  }

  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const listType = line.attributes.list;

    if (listType === "bullet" || listType === "ordered") {
      const start = index;
      const items = [];
      while (index < lines.length && lines[index].attributes.list === listType) {
        items.push(lines[index].content);
        index += 1;
      }
      const List = listType === "bullet" ? "ul" : "ol";
      blocks.push(
        <List
          key={`list-${start}`}
          className={`space-y-2 pl-5 ${
            listType === "bullet" ? "list-disc" : "list-decimal"
          }`}
        >
          {items.map((content, itemIndex) => (
            <li key={`list-${start}-${itemIndex}`}>{content}</li>
          ))}
        </List>,
      );
      continue;
    }

    const headingLevel = line.attributes.header;
    if (headingLevel === 2 || headingLevel === 3) {
      const Heading = headingLevel === 2 ? "h2" : "h3";
      blocks.push(
        <Heading
          key={`heading-${index}`}
          className="pt-2 text-2xl font-semibold leading-snug text-[#29251f]"
        >
          {line.content.length ? line.content : <br />}
        </Heading>,
      );
    } else if (line.attributes.blockquote) {
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-2 border-[#c2410c] pl-4 italic text-[#69645b]"
        >
          {line.content.length ? line.content : <br />}
        </blockquote>,
      );
    } else {
      blocks.push(
        <p key={`paragraph-${index}`}>
          {line.content.length ? line.content : <br />}
        </p>,
      );
    }
    index += 1;
  }

  return <div className={`space-y-5 ${className}`}>{blocks}</div>;
}

function renderInline(text, keyPrefix) {
  const tokens = text.split(/(\*\*.+?\*\*|\*.+?\*)/g);

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

function isListItem(line) {
  return /^-\s+/.test(line);
}

export default function BlogContent({ content, className = "" }) {
  const delta = parseDelta(content);
  if (delta) {
    return renderRichText(delta, className);
  }

  const lines = content.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const Heading = heading[1].length === 2 ? "h2" : "h3";
      blocks.push(
        <Heading
          key={`heading-${index}`}
          className="pt-2 text-2xl font-semibold leading-snug text-[#29251f]"
        >
          {renderInline(heading[2], `heading-${index}`)}
        </Heading>,
      );
      index += 1;
      continue;
    }

    if (isListItem(line)) {
      const items = [];
      const start = index;
      while (index < lines.length && isListItem(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul
          key={`list-${start}`}
          className="list-disc space-y-2 pl-5"
        >
          {items.map((item, itemIndex) => (
            <li key={`list-${start}-${itemIndex}`}>
              {renderInline(item, `list-${start}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-2 border-[#c2410c] pl-4 italic text-[#69645b]"
        >
          {renderInline(line.slice(2), `quote-${index}`)}
        </blockquote>,
      );
      index += 1;
      continue;
    }

    const start = index;
    const paragraph = [];
    while (index < lines.length) {
      const nextLine = lines[index].trim();
      if (
        !nextLine ||
        /^(#{2,3})\s+/.test(nextLine) ||
        isListItem(nextLine) ||
        nextLine.startsWith("> ")
      ) {
        break;
      }
      paragraph.push(nextLine);
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${start}`}>
        {renderInline(paragraph.join(" "), `paragraph-${start}`)}
      </p>,
    );
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {blocks.length ? blocks : <p className="text-[#817a6e]">Nothing to preview yet.</p>}
    </div>
  );
}
