Veritabanının yedeğini al
docker-compose exec db pg_dump -U myuser mydb > mydb_backup.sql
Yeni sunucuda yedeği yükle
cat ~/mydb_backup.sql | docker-compose exec -T db psql -U myuser -d mydb

Servisleri durdur docker-compose down
Servisleri başlat docker-compose up -d
Log'ları görmek docker-compose logs -f
Sadece backend log’u docker-compose logs -f server
Container’ı yeniden başlat docker-compose restart server
Volume’leri listele docker volume ls
Volume silmek docker volume rm online-notepad_pgdata

VITE_API_URL=/api
JWT_SECRET=
JWT_REFRESH_TOKEN_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_EXPIRY=
ENCRYPTION_SECRET=
PORT=
NODE_ENV=
ALLOWED_ORIGINS=https://online-notepad.yildizsalih.net

DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
