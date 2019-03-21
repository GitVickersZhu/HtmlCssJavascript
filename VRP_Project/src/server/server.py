from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import vrp

datafile = "info.dat"
loadfile = "info_load.dat"

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json, charset=utf-8')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self._set_headers()

        if (self.path == "/"):
            response = {
                'state': 'success'
            }
        
        elif (self.path == "/data"):
            f = open(loadfile, "r")
            response = f.readlines()
            
        elif (self.path == "/solution"):
            response = vrp.solve(datafile)

        self.wfile.write(bytes(json.dumps(response), 'utf-8'))

    def do_HEAD(self):
        self._set_headers()
        
    def do_POST(self):
        self._set_headers()
        
        if (self.path == "/node"):
            raw = self.__parse_raw_POST()

            response = {
                'state': 'success'
            }

            self.__write(raw)
        
        elif (self.path == "/vehicles"):
            raw = self.__parse_raw_POST()
            with open(datafile, 'w') as f:
                f.write(raw)
                f.write('\n')

            response = {
                'state': 'success'
            }
        
        else:
            response = {
                'state': 'error',
                'msg': 'endpoint not defined'
            }

        self.wfile.write(bytes(json.dumps(response), 'utf-8'))

    def __parse_raw_POST(self):
        if 'content-length' in self.headers:
            length = self.headers['content-length']
        try:
            ret = self.rfile.read(int(length)).decode('utf-8')
        except:
            ret = ""

        return ret
    
    def __write(self, data):
        with open(datafile, 'a') as f:
            f.write(data)
            f.write('\n')
        
def run(server_class=HTTPServer, handler_class=S, port=1234):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Starting httpd...')
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()