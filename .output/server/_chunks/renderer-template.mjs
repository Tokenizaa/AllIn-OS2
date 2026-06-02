import { b as HTTPResponse } from "../_libs/h3.mjs";
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





const rendererTemplate = () => new HTTPResponse(`<!doctype html>\r
<html lang="en" class="dark">\r
  <head>\r
    <meta charset="UTF-8" />\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r
    <title>Allin OS — Enterprise Operating System</title>\r
    <meta name="description" content="AI-first, analytics-driven operating system for MLM, e-commerce, finance and intelligent operations." />\r
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />\r
    <link rel="preconnect" href="https://fonts.googleapis.com" />\r
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\r
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />\r
  </head>\r
  <body class="dark">\r
    <div id="root"></div>\r
    <script type="module" src="/src/main.tsx"><\/script>\r
  </body>\r
</html>\r
\r
`, { headers: { "content-type": "text/html; charset=utf-8" } });
function renderIndexHTML(event) {
  return rendererTemplate(event.req);
}
export {
  renderIndexHTML as default
};
