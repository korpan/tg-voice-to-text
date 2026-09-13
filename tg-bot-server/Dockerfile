FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Compile TS to JS if needed, but since we use ts-node in the scripts,
# we might need to install typescript/ts-node or just use build.
# For production, it's better to build.
RUN npm install -g typescript ts-node

CMD ["npm", "start"]
