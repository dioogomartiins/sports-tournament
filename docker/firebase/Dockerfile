FROM eclipse-temurin:21-jre-alpine

# Install Node.js, npm, bash, and curl
RUN apk add --no-cache nodejs npm bash curl

# Install firebase-tools
RUN npm install -g firebase-tools@15.5.0

# Pre-download database emulator JAR to speed up startup
RUN firebase setup:emulators:database

WORKDIR /app

# Expose Firebase Emulator Suite ports:
# 9000: Realtime Database
# 9099: Authentication
# 4000: Emulator Suite UI
# 4400: Emulator Hub
EXPOSE 9000 9099 4000 4400

COPY docker/firebase/seed.mjs /usr/local/bin/seed.mjs
COPY docker/firebase/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
