#!/usr/bin/env python3
"""Minimal static server for the built frontend behind code-server's proxy.

Serves ./dist and strips a leading /proxy/<port>/ prefix (which code-server
preserves in the path) so that /proxy/5173/assets/x.js maps to dist/assets/x.js.
Any unknown path falls back to index.html (SPA behaviour). No dependencies.
"""
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")
PREFIX = re.compile(r"^/proxy/\d+")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def translate_path(self, path):
        # Drop the /proxy/<port> prefix before resolving against dist/.
        path = PREFIX.sub("", path) or "/"
        return super().translate_path(path)

    def do_GET(self):
        stripped = PREFIX.sub("", self.path) or "/"
        # SPA fallback: serve index.html for non-file routes.
        candidate = self.translate_path(self.path)
        if not os.path.isfile(candidate) and "." not in os.path.basename(stripped):
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5173"))
    print(f"Serving {DIST} on 0.0.0.0:{port} (strips /proxy/<port> prefix)")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
