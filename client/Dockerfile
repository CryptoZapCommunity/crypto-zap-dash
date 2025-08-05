# Dockerfile para Frontend React
FROM node:20-alpine as base

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# ===== STAGE: DEVELOPMENT =====
FROM base as development

# Instalar dependências (incluindo devDependencies)
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando para executar em modo de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ===== STAGE: BUILD =====
FROM base as build

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Construir a aplicação para produção
RUN npm run build

# ===== STAGE: PRODUCTION =====
FROM nginx:alpine as production

# Copiar arquivos construídos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 