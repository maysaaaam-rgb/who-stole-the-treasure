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
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"==================================================")
        print(f" POKÉMON TRAINER BATTLE - CLASSROOM GAME SERVER")
        print(f" Serving live at: http://localhost:{PORT}")
        print(f" Smartboard / Projector Ready!")
        print(f" Press Ctrl+C to stop the server.")
        print(f"==================================================")
        webbrowser.open(f"http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped. Have a great Pokémon class!")

if __name__ == '__main__':
    run()
