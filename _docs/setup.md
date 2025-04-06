## docker

```sh
docker-compose up -d --build

cd /volume1/docker/servers/nextjs
docker exec -it nextjs-dev /bin/bash
cd sites/jnj-admin
npm run dev
```