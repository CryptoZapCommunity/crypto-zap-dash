# Dockerfile para Backend Python/FastAPI
FROM python:3.11-slim as base

# Definir variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONPATH=/app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# ===== STAGE: DEVELOPMENT =====
FROM base as development

# Instalar dependências de desenvolvimento
RUN pip install --no-cache-dir \
    pytest \
    pytest-cov \
    pytest-asyncio \
    black \
    flake8 \
    mypy

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 5000

# Comando para desenvolvimento (com reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload", "--log-level", "debug"]

# ===== STAGE: PRODUCTION =====
FROM base as production

# Criar usuário não-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copiar código da aplicação
COPY . .

# Alterar permissões
RUN chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 5000

# Comando para produção
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--workers", "4"] 