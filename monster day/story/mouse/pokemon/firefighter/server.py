import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run():
    os.chdir(DIRECTORY)
    # Attempt port 8000 or find next free port
    port = PORT
    for attempt in range(10):
        try:
            httpd = socketserver.TCPServer(("", port), Handler)
            break
        except OSError:
            port += 1

    print(f"==================================================")
    print(f" 🚒 FIRE STATION ADVENTURE - CLASSROOM SERVER")
    print(f" Serving live at: http://localhost:{port}")
    print(f" Optimized for Interactive Whiteboards & Touchscreens")
    print(f" Press Ctrl+C to stop the server.")
    print(f"==================================================")
    webbrowser.open(f"http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nLesson server stopped. Have a great teaching session!")

if __name__ == '__main__':
    run()
