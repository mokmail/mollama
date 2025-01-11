import React from 'react';
import MarkdownIt from 'markdown-it';

// Markdown renderer instance
const md = new MarkdownIt();

const MarkdownRenderer = ({ markdownText }) => {
  // Render markdown to HTML
  const renderedHtml = md.render(markdownText);

  return (
    <div
      className="markdown-container"
      
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MarkdownRenderer;
