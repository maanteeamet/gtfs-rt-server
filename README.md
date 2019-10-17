## Run on Docker

### Prerequisites
Docker 1.9
On Mac and Windows use Docker toolbox

### Build a new docker image
- `docker build -t name/gtfs .`

### Run 
- `docker run -p 8080:3333 name/gtfs`

## Access running application
On Linux:
- open `http://localhost:3333`

On Mac:
- run `docker-machine env default`
- see IP of `DOCKER_HOST`
- open `http://[DOCKER_HOST]:3333`

On Windows:
- open `http://localhost:3333`
