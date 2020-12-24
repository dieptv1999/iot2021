### Guide line

- Download node_modules

```bash
npm i
```

- If have any errors:

```bash
npm install -g bcrypt --save
```

- Start backend:

```bash
npm run backend
```
or 
```bash
nodemon index.js
```

- Host: http://localhost:5000
- MongoDB account (normal account): tranphuongthao240599@gmail.com/


# Mô tả TOPIC

1. Device gửi dữ liệu lên server: REQUEST_TOPIC
2. Server gửi dữ liệu xác thực về cho device: AUTH_TOPIC/{deviceId}
3. Server gửi dữ liệu điều khiển về cho device: CONTROL/{deviceId}
