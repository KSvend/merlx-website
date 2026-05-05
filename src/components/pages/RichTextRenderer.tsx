import type { CSSProperties, ReactNode } from 'react';

/**
 * Lexical (Payload v3 default) → React renderer.
 *
 * Walks the SerializedLexicalNode tree, rendering the subset of node
 * types we use in marketing pages. Unknown nodes fall through with
 * their children, so we never crash on a richer body — we just don't
 * style what we don't recognise.
 *
 * Style decisions follow the design-system Voice + Typography chunks:
 * sentence case headings; max 64ch reading column; sand-dark
 * blockquote rule; deep-teal links underlined on hover.
 */

// biome-ignore lint/suspicious/noExplicitAny: Lexical AST nodes carry many shapes
type LexicalNode = any;

// Lexical AST nodes have no stable id — their position in the parent's
// children array IS their identity. Index keys are correct here, and
// the tree is rebuilt on each render of static content anyway.

interface RichTextRendererProps {
  /** Payload v3 stores rich text as `{ root: { children: [...] } }`. */
  data: { root?: { children?: LexicalNode[] } } | null | undefined;
}

export function RichTextRenderer({ data }: RichTextRendererProps) {
  const children = data?.root?.children;
  if (!children || children.length === 0) return null;

  return (
    <div style={proseStyle}>
      {children.map((node, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Lexical nodes have no stable ids
        <RenderNode key={idx} node={node} />
      ))}
    </div>
  );
}

const proseStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-lg)',
  fontWeight: 400,
  lineHeight: 1.65,
  letterSpacing: '0.01em',
  color: 'var(--ink-light)',
  maxWidth: '64ch',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-8)',
};

function RenderNode({ node }: { node: LexicalNode }): ReactNode {
  if (!node) return null;

  switch (node.type) {
    case 'heading':
      return <Heading tag={node.tag ?? 'h2'} node={node} />;
    case 'paragraph':
      return <p style={{ margin: 0 }}>{renderChildren(node.children)}</p>;
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <Tag
          style={{
            paddingInlineStart: 'var(--space-12)',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {(node.children ?? []).map((child: LexicalNode, i: number) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Lexical nodes have no stable ids
            <RenderNode key={i} node={child} />
          ))}
        </Tag>
      );
    }
    case 'listitem':
      return <li>{renderChildren(node.children)}</li>;
    case 'quote':
      return (
        <blockquote
          style={{
            margin: 0,
            paddingInlineStart: 'var(--space-8)',
            borderInlineStart: '2px solid var(--sand-dark)',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontStyle: 'italic',
            color: 'var(--ink)',
            lineHeight: 1.5,
          }}
        >
          {renderChildren(node.children)}
        </blockquote>
      );
    case 'horizontalrule':
      return (
        <hr
          style={{
            border: 0,
            borderTop: '1px solid var(--border-light)',
            margin: 'var(--space-8) 0',
          }}
        />
      );
    case 'link': {
      const href = node.fields?.url ?? node.url ?? '#';
      const newTab = node.fields?.newTab ?? node.newTab;
      return (
        <a
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          style={linkStyle}
        >
          {renderChildren(node.children)}
        </a>
      );
    }
    case 'autolink':
      return (
        <a href={node.fields?.url ?? '#'} style={linkStyle}>
          {renderChildren(node.children)}
        </a>
      );
    case 'text':
      return <TextLeaf node={node} />;
    case 'linebreak':
      return <br />;
    default:
      // Unknown block — render its children inline so we don't drop content.
      return <>{renderChildren(node.children)}</>;
  }
}

function renderChildren(children: LexicalNode[] | undefined): ReactNode {
  if (!children) return null;
  return children.map((child: LexicalNode, i: number) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: Lexical nodes have no stable ids
    <RenderNode key={i} node={child} />
  ));
}

function TextLeaf({ node }: { node: LexicalNode }) {
  const text: string = node.text ?? '';
  const format: number = node.format ?? 0;

  // Lexical bitmask flags (https://github.com/facebook/lexical):
  // 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
  let element: ReactNode = text;
  if (format & 16)
    element = (
      <code
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.92em',
          background: 'var(--shell-warm)',
          padding: '0 var(--space-2)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {element}
      </code>
    );
  if (format & 1)
    element = <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{element}</strong>;
  if (format & 2)
    element = <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{element}</em>;
  if (format & 4) element = <s>{element}</s>;
  if (format & 8) element = <u>{element}</u>;
  if (format & 32) element = <sub>{element}</sub>;
  if (format & 64) element = <sup>{element}</sup>;
  return <>{element}</>;
}

function Heading({ tag, node }: { tag: string; node: LexicalNode }) {
  const sizeMap: Record<string, string> = {
    h1: 'clamp(28px, 4vw, 40px)',
    h2: 'clamp(22px, 2.4vw, 28px)',
    h3: 'clamp(18px, 1.8vw, 20px)',
    h4: '17px',
    h5: '15px',
    h6: '13px',
  };
  const style: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: sizeMap[tag] ?? '20px',
    letterSpacing: '-0.2px',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1.2,
  };
  const Tag = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Tag style={style}>{renderChildren(node.children)}</Tag>;
}

const linkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
  textUnderlineOffset: '3px',
  transition: 'text-decoration-color var(--motion-default) var(--motion-easing)',
};
