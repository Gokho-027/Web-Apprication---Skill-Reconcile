import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdownToHtml(markdown: string): string {
  try {
    return marked.parse(markdown || '') as string;
  } catch (error) {
    console.error('Markdown parse error:', error);
    return `<pre class="whitespace-pre-wrap">${markdown}</pre>`;
  }
}
